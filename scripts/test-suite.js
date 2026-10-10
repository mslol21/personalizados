const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body,
        });
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log("=== STARTING COMPREHENSIVE TEST SUITE ===");

  // 1. Test public products API
  console.log("\n[Test 1] Testing Public Products API (GET /api/products)...");
  const publicProductsRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/products',
    method: 'GET'
  });
  console.log(`Status: ${publicProductsRes.statusCode}`);
  const products = JSON.parse(publicProductsRes.body);
  console.log(`Found ${products.length} published products.`);
  if (publicProductsRes.statusCode !== 200 || products.length === 0) throw new Error("Public products failed");

  // 2. Test unauthorized mutation (POST /api/products without auth)
  console.log("\n[Test 2] Testing Unauthorized Product Creation Block (POST /api/products)...");
  const unauthRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/products',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({ name: "Hacker Product", category: "canecas" }));
  console.log(`Status: ${unauthRes.statusCode} (Expected 401)`);
  if (unauthRes.statusCode !== 401) throw new Error("Expected 401 Unauthorized for visitor write");

  // 3. Test Admin Login
  console.log("\n[Test 3] Testing Admin Login (POST /api/auth/login)...");
  const loginRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({ password: "criativo2026" }));
  console.log(`Status: ${loginRes.statusCode}`);
  const cookieHeader = loginRes.headers['set-cookie'];
  console.log(`Received Auth Cookie: ${cookieHeader ? "YES" : "NO"}`);
  if (!cookieHeader) throw new Error("Admin login failed to return cookie");
  const cookieStr = cookieHeader[0].split(';')[0];

  // 4. Test Authorized Product Creation
  console.log("\n[Test 4] Testing Authorized Product Creation with Session Cookie...");
  const newProdPayload = {
    name: "Caneca Teste Automatizado Ouro",
    category: "canecas",
    categoryName: "Canecas",
    occasions: ["aniversarios"],
    description: "Caneca de teste automatizado persistida em JSON real.",
    details: ["Capacidade 325ml", "Gravação em ouro"],
    price: 38.50,
    isFeatured: true,
    isPublished: true,
    images: ["/images/products/caneca-personalizada-1.svg"]
  };
  const createRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/products',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieStr
    }
  }, JSON.stringify(newProdPayload));
  console.log(`Status: ${createRes.statusCode} (Expected 201)`);
  const createdProduct = JSON.parse(createRes.body);
  console.log(`Created Product ID: ${createdProduct.id}, Slug: ${createdProduct.slug}`);
  if (createRes.statusCode !== 201 || !createdProduct.id) throw new Error("Authorized creation failed");

  // 5. Verify Persistence across fresh request
  console.log("\n[Test 5] Verifying Persistence across Fresh Public GET Request...");
  const verifyRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: `/api/products/${createdProduct.id}`,
    method: 'GET'
  });
  console.log(`Status: ${verifyRes.statusCode}`);
  const retrievedProduct = JSON.parse(verifyRes.body);
  console.log(`Retrieved Product Name: "${retrievedProduct.name}", Price: R$ ${retrievedProduct.price}`);
  if (retrievedProduct.name !== newProdPayload.name) throw new Error("Persistence verification failed");

  // 6. Test Product Update
  console.log("\n[Test 6] Testing Authorized Product Update (PUT /api/products/[id])...");
  const updateRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: `/api/products/${createdProduct.id}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieStr
    }
  }, JSON.stringify({ price: 42.00, isFeatured: false }));
  console.log(`Status: ${updateRes.statusCode}`);
  const updatedProduct = JSON.parse(updateRes.body);
  console.log(`Updated Price: R$ ${updatedProduct.price}`);
  if (updatedProduct.price !== 42.00) throw new Error("Update failed");

  // 7. Test Product Deletion (cleanup)
  console.log("\n[Test 7] Testing Authorized Product Deletion (DELETE /api/products/[id])...");
  const deleteRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: `/api/products/${createdProduct.id}`,
    method: 'DELETE',
    headers: { 'Cookie': cookieStr }
  });
  console.log(`Status: ${deleteRes.statusCode}`);
  if (deleteRes.statusCode !== 200) throw new Error("Deletion failed");

  // 8. Test Sitemap
  console.log("\n[Test 8] Testing Sitemap generation (GET /sitemap.xml)...");
  const sitemapRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/sitemap.xml',
    method: 'GET'
  });
  console.log(`Status: ${sitemapRes.statusCode}`);
  if (sitemapRes.statusCode !== 200) throw new Error("Sitemap failed");

  // 9. Test Robots.txt
  console.log("\n[Test 9] Testing Robots.txt (GET /robots.txt)...");
  const robotsRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/robots.txt',
    method: 'GET'
  });
  console.log(`Status: ${robotsRes.statusCode}`);
  if (robotsRes.statusCode !== 200) throw new Error("Robots.txt failed");

  console.log("\n=============================================");
  console.log("ALL 9 TEST SUITE CHECKS PASSED PERFECTLY! ✨");
  console.log("=============================================\n");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
