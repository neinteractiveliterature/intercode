import { vi } from 'vitest';

import AuthenticityTokensManager from '../../app/javascript/AuthenticityTokensContext';

describe('AuthenticityTokensManager', () => {
  const buildManager = (tokens?: ConstructorParameters<typeof AuthenticityTokensManager>[1]) =>
    new AuthenticityTokensManager(vi.fn<typeof fetch>(), tokens, new URL('http://localhost/'));

  describe('setTokens', () => {
    it('keeps the same tokens object when nothing has changed', () => {
      const manager = buildManager({ graphql: 'a', signIn: 'b' });
      const before = manager.tokens;

      manager.setTokens({ graphql: 'a', signIn: 'b' });

      expect(manager.tokens).toBe(before);
    });

    it('keeps the same tokens object when given a subset of what it already has', () => {
      const manager = buildManager({ graphql: 'a', signIn: 'b' });
      const before = manager.tokens;

      manager.setTokens({ graphql: 'a' });

      expect(manager.tokens).toBe(before);
    });

    it('applies new tokens when every existing token has changed', () => {
      const manager = buildManager({ graphql: 'a', signIn: 'b' });

      manager.setTokens({ graphql: 'a2', signIn: 'b2' });

      expect(manager.tokens).toEqual({ graphql: 'a2', signIn: 'b2' });
    });

    it('applies new tokens when only some have changed', () => {
      const manager = buildManager({ graphql: 'a', signIn: 'b' });

      manager.setTokens({ graphql: 'a2' });

      expect(manager.tokens).toEqual({ graphql: 'a2', signIn: 'b' });
    });

    it('adds tokens it did not have before', () => {
      const manager = buildManager({ graphql: 'a' });

      manager.setTokens({ signUp: 'c' });

      expect(manager.tokens).toEqual({ graphql: 'a', signUp: 'c' });
    });

    it('accepts tokens when it had none', () => {
      const manager = buildManager();

      manager.setTokens({ graphql: 'a' });

      expect(manager.tokens).toEqual({ graphql: 'a' });
    });
  });

  describe('refresh', () => {
    it('takes on the tokens the server returns, even if all of them changed', async () => {
      const fetcher = vi.fn<typeof fetch>(
        async () => new Response(JSON.stringify({ graphql: 'new-a', signIn: 'new-b' })),
      );
      const manager = new AuthenticityTokensManager(
        fetcher,
        { graphql: 'a', signIn: 'b' },
        new URL('http://localhost/authenticity_tokens'),
      );

      const tokens = await manager.refresh();

      expect(tokens).toEqual({ graphql: 'new-a', signIn: 'new-b' });
    });
  });

  describe('getTokens', () => {
    it('returns the tokens it has without asking the server', async () => {
      const fetcher = vi.fn<typeof fetch>();
      const manager = new AuthenticityTokensManager(fetcher, { graphql: 'a' }, new URL('http://localhost/'));

      expect(await manager.getTokens()).toEqual({ graphql: 'a' });
      expect(fetcher).not.toHaveBeenCalled();
    });

    it('fetches them when it has none', async () => {
      const fetcher = vi.fn<typeof fetch>(async () => new Response(JSON.stringify({ graphql: 'fetched' })));
      const manager = new AuthenticityTokensManager(
        fetcher,
        undefined,
        new URL('http://localhost/authenticity_tokens'),
      );

      expect(await manager.getTokens()).toEqual({ graphql: 'fetched' });
    });
  });
});
