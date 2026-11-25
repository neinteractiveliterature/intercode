import { vi } from 'vitest';
import { waitFor } from '@testing-library/react';
import { initErrorReporting } from '../../app/javascript/ErrorReporting';
import errorReporting from '../../app/javascript/ErrorReporting';

const { init, captureException, showContent } = vi.hoisted(() => ({
  init: vi.fn(),
  captureException: vi.fn(),
  showContent: { now: () => {} },
}));

vi.mock('@sentry/browser', () => ({
  init,
  Scope: class {
    setUser() {}
    setContext() {}
    setTags() {}
  },
}));

vi.mock('../../app/javascript/contentShown', () => ({
  afterContentShown: () =>
    new Promise<void>((resolve) => {
      showContent.now = resolve;
    }),
}));

describe('ErrorReporting', () => {
  beforeEach(() => {
    init.mockReset().mockReturnValue({ captureException, captureMessage: vi.fn() });
    captureException.mockReset();
  });

  const captured = () => captureException.mock.calls.map(([error]) => error);

  it('does not start Sentry until the content has been shown', async () => {
    initErrorReporting(undefined, 'https://key@sentry.example.test/1');
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(init).not.toHaveBeenCalled();

    showContent.now();
    await waitFor(() => expect(init).toHaveBeenCalledTimes(1));
  });

  it('starts Sentry at once when there is something to report, and then sends it', async () => {
    initErrorReporting(undefined, 'https://key@sentry.example.test/1');
    const error = new Error('broke during startup');
    errorReporting().error(error);

    await waitFor(() => expect(captured()).toEqual([error]));
    expect(init).toHaveBeenCalledTimes(1);
  });

  it('sends an uncaught error from before Sentry loaded, once', async () => {
    initErrorReporting(undefined, 'https://key@sentry.example.test/1');
    const error = new Error('uncaught during startup');
    // With no listener of its own, the test runner would count these as failures once ours has gone
    const ignore = () => {};
    window.addEventListener('error', ignore);
    const event = new ErrorEvent('error', { error });
    window.dispatchEvent(event);

    await waitFor(() => expect(captured()).toEqual([error]));

    // From here on Sentry's own handlers do this
    window.dispatchEvent(event);
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(captured()).toEqual([error]);
    window.removeEventListener('error', ignore);
  });

  it('does nothing without a DSN', async () => {
    initErrorReporting(undefined);
    errorReporting().error(new Error('nowhere to go'));
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(init).not.toHaveBeenCalled();
  });
});
