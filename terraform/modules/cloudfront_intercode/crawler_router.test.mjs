import { expect, test } from 'vitest';
// The source is a CloudFront Function, which is a script rather than a module, so import its text and evaluate it
import source from './crawler_router.js?raw';
import routing from './routing.json';
import mainTf from './main.tf?raw';

const handler = new Function(`${source}; return handler;`)();

const BROWSER = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0 Safari/537.36';

function route(uri, userAgent, querystring = {}) {
  const headers = userAgent == null ? {} : { 'user-agent': { value: userAgent } };
  return handler({ request: { uri, querystring, headers } });
}

test('sends browsers to the SPA shell and drops the query string', () => {
  const request = route('/events/4130', BROWSER, { utm_source: { value: 'newsletter' } });
  expect(request.uri).toBe('/cdn-spa-shell');
  expect(request.querystring).toEqual({});
});

test('sends requests with no user agent to the SPA shell', () => {
  expect(route('/events/4130', undefined).uri).toBe('/cdn-spa-shell');
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
    expect(request.uri).toBe('/og-shell');
    expect(request.querystring).toEqual({ path: { value: '%2Fevents%2F4130' } });
  });
}

test('encodes the original path, including percent-encoded characters', () => {
  const request = route('/events/a%20b/c', 'facebookexternalhit/1.1');
  expect(request.querystring.path.value).toBe('%2Fevents%2Fa%2520b%2Fc');
});

test('sends the root path to the OG shell for crawlers', () => {
  expect(route('/', 'Twitterbot/1.0').querystring.path.value).toBe('%2F');
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
    expect(request.uri).toBe(uri);
    expect(request.querystring).toEqual({ a: { value: '1' } });
  });
}

test('does not treat a path that merely starts with a Rails prefix as a Rails path', () => {
  expect(route('/users-guide', BROWSER).uri).toBe('/cdn-spa-shell');
});

// The Rails paths come from routing.json, so check them all rather than a sample
for (const pattern of routing.rails_paths) {
  const uri = pattern.endsWith('/*') ? `${pattern.slice(0, -1)}example` : pattern;
  test(`leaves the routing.json path ${uri} alone`, () => {
    expect(route(uri, 'facebookexternalhit/1.1').uri).toBe(uri);
  });
}

test('does not treat a prefix path as matching its bare name', () => {
  expect(route('/users', 'facebookexternalhit/1.1').uri).toBe('/og-shell');
});

// The shell and asset behaviors are written out in main.tf, so make sure they stay in step with routing.json
test('main.tf has a behavior for each shell and asset path', () => {
  const patterns = [...mainTf.matchAll(/path_pattern\s*=\s*"([^"]+)"/g)].map((m) => m[1]);
  expect(patterns.sort()).toEqual([...routing.shell_paths, ...routing.asset_paths].sort());
});
