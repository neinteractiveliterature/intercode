import { CombinedGraphQLErrors } from '@apollo/client';
import { vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import useAsyncFunction, { UserFacingError } from '../../app/javascript/useAsyncFunction';
import errorReporting from '../../app/javascript/ErrorReporting';

vi.mock('../../app/javascript/ErrorReporting', () => {
  const reporter = { error: vi.fn() };
  return { default: () => reporter };
});

describe('useAsyncFunction', () => {
  const reportError = errorReporting().error as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    reportError.mockReset();
  });

  const run = async (func: () => Promise<unknown>, options?: Parameters<typeof useAsyncFunction>[1]) => {
    const { result } = renderHook(() => useAsyncFunction(func, options));
    let outcome: { value?: unknown; error?: unknown } = {};
    await act(async () => {
      try {
        outcome = { value: await result.current[0]() };
      } catch (error) {
        outcome = { error };
      }
    });
    return { outcome, result };
  };

  it('returns the value and tracks no error on success', async () => {
    const { outcome, result } = await run(async () => 'done');

    expect(outcome.value).toBe('done');
    expect(result.current[1]).toBeNull();
    expect(result.current[2]).toBe(false);
  });

  describe('without suppressError', () => {
    it('sets the error and rethrows it to the caller, without reporting it', async () => {
      const failure = new Error('nope');
      const { outcome, result } = await run(async () => {
        throw failure;
      });

      expect(outcome.error).toBe(failure);
      expect(result.current[1]).toBe(failure);
      expect(reportError).not.toHaveBeenCalled();
    });
  });

  describe('with suppressError', () => {
    it('sets the error and resolves to null instead of throwing', async () => {
      const failure = new UserFacingError('Current password is invalid');
      const { outcome, result } = await run(
        async () => {
          throw failure;
        },
        { suppressError: true },
      );

      expect(outcome).toEqual({ value: null });
      expect(result.current[1]).toBe(failure);
    });

    it('reports an unexpected error, since nothing else will', async () => {
      const failure = new TypeError('Failed to fetch');
      await run(
        async () => {
          throw failure;
        },
        { suppressError: true },
      );

      expect(reportError).toHaveBeenCalledWith(failure, { tags: { context: 'useAsyncFunction' } });
    });

    it('does not report a user-facing error', async () => {
      await run(
        async () => {
          throw new UserFacingError('Current password is invalid');
        },
        { suppressError: true },
      );

      expect(reportError).not.toHaveBeenCalled();
    });

    it('does not report a GraphQL error, which the server has already dealt with', async () => {
      await run(
        async () => {
          throw new CombinedGraphQLErrors({ errors: [{ message: 'Validation failed' }] });
        },
        { suppressError: true },
      );

      expect(reportError).not.toHaveBeenCalled();
    });
  });
});
