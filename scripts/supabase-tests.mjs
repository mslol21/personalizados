import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { readFile, mkdtemp, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const seed = JSON.parse(await readFile('data/store.json','utf8'));
const row = { id:'main', revision:1, data:seed };
const objects = new Map();
const secret = `sb_secret_${crypto.randomBytes(32).toString('hex')}`;
let failBackend = false, conflicts = 0, checks = 0;
const api = createServer(async (req,res) => {
  try {
    if (req.headers.apikey !== secret || req.headers.authorization) { res.writeHead(401).end(); return; }
    if (failBackend) { res.writeHead(503).end(); return; }
    const url = new URL(req.url,'http://mock');
    const buffers=[]; for await(const b of req) buffers.push(b); const bytes=Buffer.concat(buffers);
    if(url.pathname==='/rest/v1/catalog_store') {
      res.setHeader('Content-Type','application/json');
      if(req.method==='GET') {res.end(JSON.stringify([row]));return;}
      if(req.method==='PATCH') {
        await new Promise(r=>setTimeout(r,20)); // Exercise competing read/modify/write requests.
        if(url.searchParams.get('revision')!==`eq.${row.revision}`){conflicts++;res.end('[]');return;}
        const value=JSON.parse(bytes);Object.assign(row,value);res.end(JSON.stringify([row]));return;
      }
    }
    if(url.pathname.startsWith('/storage/v1/object/')) {
      const name=url.pathname.split('/').at(-1);
      if(req.method==='POST') {assert.equal(req.headers['content-type'],'image/webp');assert.equal(req.headers['x-upsert'],'false');objects.set(name,bytes);res.end('{}');return;}
      if(req.method==='GET' && objects.has(name)) {res.setHeader('Content-Type','image/webp');res.end(objects.get(name));return;}
    }
    res.writeHead(404).end();
  }catch(e){res.writeHead(500).end();console.error(e);}
});
await new Promise(r=>api.listen(0,'127.0.0.1',r));
const transport=`http://127.0.0.1:${api.address().port}`;
const port=3221,origin=`http://127.0.0.1:${port}`;
const password=crypto.randomBytes(24).toString('hex');
const dataDir=await mkdtemp(join(tmpdir(),'criativo-supabase-test-'));
let child,logs='',cookie='';
function start(key=secret){
  child=spawn(process.execPath,['--require',resolve('scripts/supabase-test-preload.cjs'),'node_modules/next/dist/bin/next','start','-p',String(port),'-H','127.0.0.1'],{
    env:{...process.env,NODE_OPTIONS:'',VERCEL:'1',CATALOG_BACKEND:'supabase',SUPABASE_URL:'https://catalogtest.supabase.co',SUPABASE_SECRET_KEY:key,SUPABASE_SERVICE_ROLE_KEY:'',CRIATIVO_TEST_TRANSPORT:transport,ADMIN_PASSWORD:password,JWT_SECRET:crypto.randomBytes(32).toString('hex'),APP_ORIGIN:origin,CATALOG_DATA_DIR:dataDir,NEXT_TELEMETRY_DISABLED:'1'},stdio:['ignore','pipe','pipe']});
  child.stdout.on('data',c=>logs+=c);child.stderr.on('data',c=>logs+=c);
}
async function ready(){for(let i=0;i<80;i++){try{await fetch(origin+'/api/auth/me');return;}catch{await new Promise(r=>setTimeout(r,250));}}throw Error(logs);}
async function stop(){if(child && child.exitCode===null && child.signalCode===null){child.kill();await new Promise(r=>child.once('exit',r));}}
async function request(path,method='GET',data,auth=false){const headers={Origin:origin};if(auth)headers.Cookie=cookie;let body=data;if(data && !(data instanceof FormData)){headers['Content-Type']='application/json';body=JSON.stringify(data);}return fetch(origin+path,{method,headers,body,redirect:'manual'});}
async function status(response,expected,name){assert.equal(response.status,expected,`${name}: ${await response.text()}`);checks++;console.log('PASS',name);}
async function login(){const r=await request('/api/auth/login','POST',{password});assert.equal(r.status,200);cookie=r.headers.get('set-cookie').split(';')[0];}
try{
  start();await ready();await login();
  await status(await request('/api/products'),200,'Supabase catalog read in Vercel mode');
  await status(await request('/api/products','POST',{name:'denied',category:'canecas'}),401,'visitor cannot save');
  const png=await sharp({create:{width:16,height:16,channels:3,background:'red'}}).png().toBuffer();
  const form=new FormData();form.set('file',new File([png],'../../bad.png',{type:'image/png'}));
  const uploaded=await request('/api/upload','POST',form,true);assert.equal(uploaded.status,200,await uploaded.clone().text());
  const image=await uploaded.json();assert.equal((await sharp(objects.get(image.fileName)).metadata()).format,'webp');checks++;console.log('PASS upload sanitized and stored in object storage');
  await status(await request(image.url),404,'unsaved image is private');
  await status(await request(image.url,'GET',undefined,true),200,'admin previews private upload');
  const made=await request('/api/products','POST',{name:'Supabase integration product',category:'canecas',images:[image.url]},true);assert.equal(made.status,201,await made.clone().text());const p=await made.json();
  assert.ok(row.data.products.some(x=>x.id===p.id));checks++;console.log('PASS product persisted in remote adapter');
  await status(await request(`/api/products/${p.id}`),404,'draft product stays private');
  await status(await request(image.url),404,'draft image stays private');
  await status(await request(`/api/products/${p.id}`,'PUT',{isPublished:true},true),200,'publish persisted');
  await status(await request(image.url),200,'published product image visible');
  const page=await (await request(`/catalogo/${p.slug}`)).text();assert.ok(page.includes(p.name));checks++;console.log('PASS public product page uses persisted catalog');
  const concurrent=await Promise.all([request(`/api/products/${p.id}`,'PUT',{description:'Concurrent description'},true),request(`/api/products/${p.id}`,'PUT',{price:19},true)]);
  for(const response of concurrent)assert.equal(response.status,200,await response.clone().text());
  const saved=row.data.products.find(x=>x.id===p.id);assert.equal(saved.description,'Concurrent description');assert.equal(saved.price,19);assert.ok(conflicts>0);checks++;console.log('PASS competing writes preserve both changes through version retry');
  await status(await request('/api/settings','PUT',{whatsapp:'5511888888888'},true),200,'settings persisted');
  await stop();start();await ready();await login();
  const restarted=await (await request(`/api/products/${p.id}`)).json();assert.equal(restarted.price,19);assert.equal(restarted.images[0],image.url);checks++;console.log('PASS product survives application restart');
  const settings=await (await request('/api/settings')).json();assert.equal(settings.whatsapp,'5511888888888');checks++;console.log('PASS settings survive application restart');
  await status(await request(image.url),200,'image survives application restart');
  await status(await request(`/api/products/${p.id}`,'PUT',{isPublished:false},true),200,'unpublish');
  await status(await request(image.url),404,'unpublished image hidden');
  failBackend=true;
  await status(await request('/api/products'),503,'backend outage fails visibly without local fallback');
  await status(await request('/api/products','POST',{name:'not saved',category:'canecas'},true),503,'failed write cannot report success');
  failBackend=false;
  assert.equal((await readdir(dataDir)).length,0);checks++;console.log('PASS Supabase backend never writes local catalog');
  await stop();start('sb_publishable_invalid');await ready();await login();
  await status(await request('/api/products','POST',{name:'Bad key',category:'canecas'},true),503,'publishable key rejected for server writes');
  console.log(`\n${checks} Supabase adapter checks passed with an isolated API simulation.`);
}catch(e){console.error(e);console.error(logs.slice(-3000));process.exitCode=1;}
finally{await stop();await new Promise(r=>api.close(r));await rm(dataDir,{recursive:true,force:true});}
