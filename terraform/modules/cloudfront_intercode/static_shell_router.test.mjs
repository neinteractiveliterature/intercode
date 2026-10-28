import { beforeEach, expect, test } from 'vitest';
// The source is a CloudFront Function, which is a script rather than a module, so import its text and evaluate it
// with a stand-in for the 'cloudfront' module
import source from './static_shell_router.js?raw';
import routing from './routing.json';

const BROWSER = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0 Safari/537.36';

let originSelections;
const handler = new Function('cf', `${source.replace(/^import .*$/m, '')}; return handler;`)({
  selectRequestOriginById: (id, options) => originSelections.push({ id, options }),
});

beforeEach(() => {
  originSelections = [];
});

function route(uri, userAgent, { host = 'con.example.com', querystring = {} } = {}) {
  const headers = { host: { value: host } };
  if (userAgent != null) {
    headers['user-agent'] = { value: userAgent };
  }
  return handler({ request: { uri, querystring, headers } });
}

test('sends browsers to index.html in the bucket and drops the query string', () => {
  const request = route('/events/4130', BROWSER, { querystring: { utm_source: { value: 'newsletter' } } });
  expect(request.uri).toBe('/index.html');
  expect(request.querystring).toEqual({});
  expect(originSelections).toEqual([]);
});

test('sends requests with no user agent to index.html', () => {
  expect(route('/', undefined).uri).toBe('/index.html');
  expect(originSelections).toEqual([]);
});

test('sends crawlers to the OG shell on Rails, with the viewer Host and the original path', () => {
  const request = route('/events/a%20b/c', 'facebookexternalhit/1.1', { host: 'i.interconlarp.org' });
  expect(request.uri).toBe('/og-shell');
  expect(request.querystring).toEqual({ path: { value: '%2Fevents%2Fa%2520b%2Fc' } });
  expect(originSelections).toEqual([{ id: 'rails', options: { hostHeader: 'i.interconlarp.org' } }]);
});

test('sends the iMessage user agent to the OG shell', () => {
  const ua =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/601.2.4 (KHTML, like Gecko) Version/9.0.1 Safari/601.2.4 facebookexternalhit/1.1 Facebot Twitterbot/1.0';
  expect(route('/events/1', ua).uri).toBe('/og-shell');
});

test('selects the Rails origin without a host option when the request has no Host', () => {
  handler({ request: { uri: '/events/1', querystring: {}, headers: { 'user-agent': { value: 'Twitterbot/1.0' } } } });
  expect(originSelections).toEqual([{ id: 'rails', options: {} }]);
});

for (const pattern of [...routing.rails_paths, ...routing.shell_paths]) {
  const uri = pattern.endsWith('/*') ? `${pattern.slice(0, -1)}example` : pattern;
  for (const [label, userAgent] of [
    ['browsers', BROWSER],
    ['crawlers', 'facebookexternalhit/1.1'],
  ]) {
    test(`sends ${uri} to Rails unchanged for ${label}`, () => {
      const request = route(uri, userAgent, { querystring: { a: { value: '1' } } });
      expect(request.uri).toBe(uri);
      expect(request.querystring).toEqual({ a: { value: '1' } });
      expect(originSelections).toEqual([{ id: 'rails', options: { hostHeader: 'con.example.com' } }]);
    });
  }
}

for (const pattern of routing.asset_paths) {
  const uri = `${pattern.slice(0, -1)}entry.client-abc123.js`;
  test(`leaves ${uri} for the bucket, even for crawlers`, () => {
    const request = route(uri, 'facebookexternalhit/1.1');
    expect(request.uri).toBe(uri);
    expect(originSelections).toEqual([]);
  });
}

test('does not treat a prefix path as matching its bare name', () => {
  expect(route('/users', BROWSER).uri).toBe('/index.html');
  expect(route('/assets', BROWSER).uri).toBe('/index.html');
});
