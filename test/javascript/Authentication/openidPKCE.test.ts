// @vitest-environment node
// (openid-client's hashing rejects the typed arrays that jsdom's realm hands it)
import { generatePKCEChallenge } from '../../../app/javascript/Authentication/openid';

describe('generatePKCEChallenge', () => {
  it('produces an S256 challenge that matches its verifier', async () => {
    const { verifier, challenge } = await generatePKCEChallenge();

    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
    const expected = btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    expect(challenge).toBe(expected);
    expect(verifier.length).toBeGreaterThanOrEqual(43);
  });

  it('produces a different verifier and state every time', async () => {
    const first = await generatePKCEChallenge();
    const second = await generatePKCEChallenge();

    expect(second.verifier).not.toBe(first.verifier);
    expect(second.state).not.toBe(first.state);
  });
});
