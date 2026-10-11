// Test-only transport: the child Next.js process connects to an isolated local API.
// The production application never imports this file.
if (!process.env.CRIATIVO_TEST_TRANSPORT) throw new Error('Test transport missing');
const fetchOriginal = globalThis.fetch;
globalThis.fetch = (input, options) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  if (url.startsWith('https://catalogtest.supabase.co/')) {
    return fetchOriginal(process.env.CRIATIVO_TEST_TRANSPORT + url.slice('https://catalogtest.supabase.co'.length), options);
  }
  return fetchOriginal(input, options);
};
