// Run with: node --test terraform/modules/cloudfront_intercode/
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

// The source is a CloudFront Function, which is a script rather than a module, so evaluate it for its handler
const source = readFileSync(new URL('./crawler_router.js', import.meta.url), 'utf8');
const handler = new Function(`${source}; return handler;`)();

const BROWSER = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0 Safari/537.36';

function route(uri, userAgent, querystring = {}) {
  const headers = userAgent == null ? {} : { 'user-agent': { value: userAgent } };
  return handler({ request: { uri, querystring, headers } });
}

test('sends browsers to the SPA shell and drops the query string', () => {
  const request = route('/events/4130', BROWSER, { utm_source: { value: 'newsletter' } });
  assert.equal(request.uri, '/cdn-spa-shell');
  assert.deepEqual(request.querystring, {});
});

test('sends requests with no user agent to the SPA shell', () => {
  assert.equal(route('/events/4130', undefined).uri, '/cdn-spa-shell');
});

for (const userAgent of [
  'facebookexternalhit/1.1',
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'Twitterbot/1.0',
  'WhatsApp/2',
  'Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)',
  // What iMessage sends for a page fetch
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/601.2.4 (KHTML, like Gecko) Version/9.0.1 Safari/601.2.4 facebookexternalhit/1.1 Facebot Twitterbot/1.0',
]) {
  test(`sends ${userAgent.slice(0, 40)} to the OG shell with the original path`, () => {
    const request = route('/events/4130', userAgent);
    assert.equal(request.uri, '/og-shell');
    assert.deepEqual(request.querystring, { path: { value: '%2Fevents%2F4130' } });
  });
}

test('encodes the original path, including percent-encoded characters', () => {
  const request = route('/events/a%20b/c', 'facebookexternalhit/1.1');
  assert.equal(request.querystring.path.value, '%2Fevents%2Fa%2520b%2Fc');
});

test('sends the root path to the OG shell for crawlers', () => {
  assert.equal(route('/', 'Twitterbot/1.0').querystring.path.value, '%2F');
});

for (const uri of [
  '/graphql',
  '/client_configuration',
  '/oauth_session/refresh',
  '/uploads/x.png',
  '/packs/application.js',
]) {
  test(`leaves ${uri} alone, even for crawlers`, () => {
    const request = route(uri, 'facebookexternalhit/1.1', { a: { value: '1' } });
    assert.equal(request.uri, uri);
    assert.deepEqual(request.querystring, { a: { value: '1' } });
  });
}

test('does not treat a path that merely starts with a Rails prefix as a Rails path', () => {
  assert.equal(route('/users-guide', BROWSER).uri, '/cdn-spa-shell');
});
