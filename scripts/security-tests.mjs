import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, cp, readFile, rm, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const dataDir = await mkdtemp(join(tmpdir(), 'criativo-security-'));
await cp('data/store.json', join(dataDir, 'store.json'));
const port = Number(process.env.TEST_PORT || 3219);
const origin = `http://127.0.0.1:${port}`;
const password = crypto.randomBytes(24).toString('hex');
let child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', String(port), '-H', '127.0.0.1'], {
  env: { ...process.env, CATALOG_BACKEND: "file", VERCEL: "", SUPABASE_URL: "", SUPABASE_SECRET_KEY: "", SUPABASE_SERVICE_ROLE_KEY: "", ADMIN_PASSWORD: password, JWT_SECRET: crypto.randomBytes(32).toString('hex'),
    APP_ORIGIN: origin, CATALOG_DATA_DIR: dataDir, NEXT_TELEMETRY_DISABLED: '1' }, stdio: ['ignore', 'pipe', 'pipe'],
});
let output = '';
child.stdout.on('data', chunk => { output += chunk; });
child.stderr.on('data', chunk => { output += chunk; });
let cookie = '';
let checks = 0;
const uploaded = [];
async function request(path, method = 'GET', body, { authenticated = false, originHeader = origin, headers = {} } = {}) {
  const h = { ...headers };
  if (originHeader !== null) h.Origin = originHeader;
  if (authenticated) h.Cookie = cookie;
  if (body !== undefined && !(body instanceof FormData)) { h['Content-Type'] = 'application/json'; body = typeof body === 'string' ? body : JSON.stringify(body); }
  return fetch(`${origin}${path}`, { method, headers: h, body, redirect: 'manual' });
}
async function status(response, expected, label) {
  assert.equal(response.status, expected, `${label}: ${await response.text()}`); checks++; console.log(`PASS ${label}`);
}
try {
  let ready = false;
  for (let n = 0; n < 80; n++) {
    try { await fetch(`${origin}/api/auth/me`); ready = true; break; } catch { await new Promise(resolve => setTimeout(resolve, 250)); }
  }
  assert.ok(ready, output);
  for (const path of ['/', '/catalogo', '/empresas', '/contato', '/trabalhos', '/orcamento', '/admin/login', '/sitemap.xml', '/robots.txt']) {
    await status(await request(path), 200, `public page ${path}`);
  }
  await status(await request('/admin'), 307, 'admin page redirects visitors');
  const malformed = await request('/api/products', 'GET', undefined, { headers: { Cookie: 'criativo_admin_token=%E0%A4%A' } });
  await status(malformed, 200, 'malformed cookies do not crash public API');
  for (const path of ['products','categories','occasions','services','gallery','faqs','campaigns','settings','upload']) {
    await status(await request(`/api/${path}`, path === 'products' || path === 'upload' ? 'POST' : 'PUT', {}), 401, `visitor cannot mutate ${path}`);
  }
  await status(await request('/api/auth/login', 'POST', { password }, { originHeader: 'https://attacker.example' }), 403, 'cross-origin login blocked');
  await status(await request('/api/auth/login', 'POST', { password }, { originHeader: null }), 403, 'missing origin login blocked');
  await status(await request('/api/auth/login', 'POST', '{'), 400, 'malformed JSON rejected');
  await status(await request('/api/auth/login', 'POST', { password: 'criativo2026' }), 401, 'old published password rejected');
  const login = await request('/api/auth/login', 'POST', { password });
  assert.equal(login.status, 200);
  const setCookie = login.headers.get('set-cookie');
  assert.match(setCookie, /HttpOnly/i); assert.match(setCookie, /Secure/i); assert.match(setCookie, /SameSite=Strict/i);
  cookie = setCookie.split(';')[0]; checks++; console.log('PASS configured login and protected cookie');
  await status(await request('/admin', 'GET', undefined, { authenticated: true }), 200, 'authenticated admin page');
  const forgedData = Buffer.from(JSON.stringify({role:'admin',exp:Math.floor(Date.now()/1000)+3600})).toString('base64url');
  const forgedHeader = Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url');
  const oldSignature = crypto.createHmac('sha256','criativo-artes-secret-key-2026-secure').update(`${forgedHeader}.${forgedData}`).digest('base64url');
  const forged = await (await request('/api/auth/me','GET',undefined,{ headers:{Cookie:`criativo_admin_token=${forgedHeader}.${forgedData}.${oldSignature}`} })).json();
  assert.equal(forged.authenticated,false); checks++; console.log('PASS tokens signed with published old secret rejected');
  for(const [route,param] of [['categories','includeAll'],['occasions','includeAll'],['services','includeDrafts'],['gallery','includeAll'],['faqs','includeAll'],['campaigns','includeInactive']]) {
    const data = await (await request(`/api/${route}?${param}=true`,'GET',undefined,{authenticated:true})).json();
    await status(await request(`/api/${route}`,'PUT',data,{authenticated:true}),200,`valid ${route} roundtrip`);
  }

  await status(await request('/api/products', 'POST', { name: 'Denied', category: 'canecas' }, { authenticated: true, originHeader: 'https://attacker.example' }), 401, 'cross-origin mutation blocked');
  await status(await request('/api/products', 'POST', { name: [], category: 'canecas' }, { authenticated: true }), 400, 'invalid product types rejected');
  await status(await request('/api/products', 'POST', { name: 'Bad', category: 'canecas', images: ['https://127.0.0.1/private'] }, { authenticated: true }), 400, 'remote image target rejected');
  await status(await request('/api/products', 'POST', ' '.repeat(1024 * 1024 + 1), { authenticated: true }), 413, 'large JSON body rejected');
  const payload = { name: 'Security regression test', category: 'canecas', slug: '', description: '</script><script>alert("xss")</script>', price: 12 };
  const createdRes = await request('/api/products', 'POST', payload, { authenticated: true });
  assert.equal(createdRes.status, 201, await createdRes.clone().text());
  const product = await createdRes.json(); assert.equal(product.isPublished, false); checks++; console.log('PASS product starts as draft and blank slug is generated');
  await status(await request(`/api/products/${product.id}`), 404, 'draft product ID hidden');
  await status(await request(`/catalogo/${product.slug}`), 404, 'draft product page hidden');
  const publicList = await (await request('/api/products?includeAll=true')).json();
  assert.ok(!publicList.some(p => p.id === product.id)); checks++; console.log('PASS includeAll does not expose drafts');
  await status(await request(`/api/products/${product.id}`, 'GET', undefined, { authenticated: true }), 200, 'admin can inspect draft');
  await status(await request('/api/products', 'POST', { name: payload.name, category: 'canecas' }, { authenticated: true }), 409, 'duplicate slug rejected');
  await status(await request(`/api/products/${product.id}`, 'PUT', { minQuantity: -1 }, { authenticated: true }), 400, 'negative quantity rejected');
  await status(await request(`/api/products/${product.id}`, 'PUT', { price: null, isPublished: true, id: 'forged', createdAt: 'forged' }, { authenticated: true }), 200, 'product publish and price clear');
  const updated = await (await request(`/api/products/${product.id}`)).json();
  assert.equal(updated.id, product.id); assert.equal(updated.createdAt, product.createdAt); assert.equal(updated.price, undefined); checks++; console.log('PASS immutable identity and optional price');
  const persisted = JSON.parse(await readFile(join(dataDir, 'store.json'), 'utf8'));
  assert.equal(persisted.products.find(p => p.id === product.id).isPublished, true); checks++; console.log('PASS product persisted to isolated data file');
  const html = await (await request(`/catalogo/${product.slug}`)).text();
  assert.ok(!html.includes('</script><script>alert("xss")</script>')); assert.ok(html.includes('\\u003c/script>')); checks++; console.log('PASS structured data script boundary escaped');
  const map = await (await request('/sitemap.xml')).text(); assert.ok(map.includes(product.slug)); checks++; console.log('PASS sitemap reflects freshly published product');
  for (const [path, body] of [['categories', [{ id: 'bad' }]], ['occasions', [{ id: 'bad' }]], ['services', [{ id: 'bad' }]], ['gallery', [{ id: 'bad' }]], ['faqs', [{ id: 'bad' }]], ['campaigns', [{ id: 'bad', buttonLink: 'javascript:alert(1)' }]], ['settings', { address: null }]]) {
    await status(await request(`/api/${path}`, 'PUT', body, { authenticated: true }), 400, `invalid ${path} rejected`);
  }
  await status(await request('/api/settings', 'PUT', { whatsapp: '5511999999999', instagramHandle: '@regression_test' }, { authenticated: true }), 200, 'contact settings update');
  const settings = await (await request('/api/settings')).json();
  assert.equal(settings.whatsappLink, 'https://wa.me/5511999999999'); assert.equal(settings.instagram, 'https://www.instagram.com/regression_test/'); checks++; console.log('PASS contact links follow updated values');
  const home = await (await request('/')).text(); assert.ok(home.includes('https://wa.me/5511999999999')); checks++; console.log('PASS public contact links follow settings');
  const upload = async (content, type, filename) => { const form = new FormData(); form.set('file', new File([content], filename, { type })); return request('/api/upload', 'POST', form, { authenticated: true }); };
  await status(await upload('<svg onload="alert(1)"></svg>', 'image/svg+xml', 'evil.svg'), 400, 'active SVG upload rejected');
  await status(await upload('<html>evil</html>', 'image/png', 'evil.html'), 400, 'fake raster MIME rejected');
  const image = await sharp({ create: { width: 10, height: 10, channels: 3, background: 'white' } }).png().toBuffer();
  const uploadedRes = await upload(image, 'image/png', '../../unsafe.html');
  assert.equal(uploadedRes.status, 200, await uploadedRes.clone().text());
  const result = await uploadedRes.json(); assert.match(result.fileName, /^[a-f0-9-]+\.webp$/); uploaded.push(join('public', result.url));
  const uploadedMeta = await sharp(await readFile(join('public', result.url))).metadata(); assert.equal(uploadedMeta.format, 'webp'); checks++; console.log('PASS decoded upload uses generated safe WebP filename');
  await status(await request(`/api/products/${product.id}`, 'DELETE', undefined, { authenticated: true }), 200, 'authenticated delete');
  await status(await request('/api/auth/logout', 'POST', undefined, { authenticated: true }), 200, 'logout clears cookie');
  let throttled = false;
  for (let i = 0; i < 35; i++) { const r = await request('/api/auth/login', 'POST', { password: 'invalid' }); if (r.status === 429) { assert.equal(r.headers.get('retry-after'), '300'); throttled = true; break; } }
  assert.ok(throttled); checks++; console.log('PASS login brute-force throttle');
  child.kill('SIGTERM'); await new Promise(resolve => child.once('exit',resolve));
  child = spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p',String(port),'-H','127.0.0.1'],{
    env:{...process.env,CATALOG_BACKEND:"file",VERCEL:"",SUPABASE_URL:"",SUPABASE_SECRET_KEY:"",SUPABASE_SERVICE_ROLE_KEY:"",ADMIN_PASSWORD:'',JWT_SECRET:'',APP_ORIGIN:origin,CATALOG_DATA_DIR:dataDir},stdio:['ignore','pipe','pipe']
  });
  child.stdout.on('data', chunk => { output += chunk; }); child.stderr.on('data', chunk => { output += chunk; });
  let secondReady=false;
  for(let n=0;n<80;n++){ try{ await fetch(`${origin}/api/auth/me`);secondReady=true;break;}catch{await new Promise(resolve=>setTimeout(resolve,250));} }
  assert.ok(secondReady,output);
  await status(await request('/api/auth/login','POST',{password:'criativo2026'}),503,'missing admin configuration fails closed');
  const previousSession=await (await request('/api/auth/me','GET',undefined,{authenticated:true})).json();
  assert.equal(previousSession.authenticated,false);checks++;console.log('PASS sessions rejected without server configuration');
  console.log(`\n${checks} security and functional checks passed.`);
} catch (error) {
  console.error(error); console.error(output.slice(-4000)); process.exitCode = 1;
} finally {
  if (child.exitCode === null && child.signalCode === null) {
    child.kill('SIGTERM');
    await new Promise(resolve => child.once('exit', resolve));
  }
  await rm(dataDir, { recursive: true, force: true });
  for (const path of uploaded) await unlink(path).catch(() => {});
}
