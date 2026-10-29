import { vi } from 'vitest';
import { SHELL_RECOVERY_SCRIPT } from '../../app/javascript/shellRecovery';

type Listener = (event: unknown) => void;

describe('SHELL_RECOVERY_SCRIPT', () => {
  let listeners: Record<string, Listener[]>;
  let fakeWindow: { intercodeShellBooted?: boolean; addEventListener: (type: string, listener: Listener) => void };
  let reload: ReturnType<typeof vi.fn>;
  let storage: Record<string, string>;
  let sessionStorageStub: { getItem: (key: string) => string | null; setItem: (key: string, value: string) => void };

  // Runs the script the way the browser would, against a stand-in window so that each test gets fresh listeners
  const runScript = () => {
    new Function('window', 'sessionStorage', 'location', SHELL_RECOVERY_SCRIPT)(fakeWindow, sessionStorageStub, {
      reload,
    });
  };

  const fire = (type: string, event: unknown) => (listeners[type] ?? []).forEach((listener) => listener(event));
  const failedElement = (tagName: string, rel = '') => ({ target: { tagName, rel } });

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-29T12:00:00Z'));
    document.body.innerHTML = '<div class="custom-loading-indicator"></div>';
    listeners = {};
    storage = {};
    reload = vi.fn();
    sessionStorageStub = {
      getItem: (key) => storage[key] ?? null,
      setItem: (key, value) => {
        storage[key] = value;
      },
    };
    fakeWindow = {
      addEventListener: (type, listener) => {
        listeners[type] = [...(listeners[type] ?? []), listener];
      },
    };
    runScript();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('reloads once when a script fails to load', () => {
    fire('error', failedElement('SCRIPT'));

    expect(reload).toHaveBeenCalledTimes(1);
    expect(storage['intercode.entryScriptReloadAt']).toBe(String(Date.now()));
  });

  it.each([['modulepreload'], ['stylesheet']])('reloads when a %s link fails to load', (rel) => {
    fire('error', failedElement('LINK', rel));

    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('reloads when the entry file’s dynamic import is rejected', () => {
    fire('unhandledrejection', {
      reason: new TypeError('Failed to fetch dynamically imported module: https://example.com/assets/entry.js'),
    });

    expect(reload).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['IMG', ''],
    ['LINK', 'icon'],
  ])('ignores a failed %s %s', (tagName, rel) => {
    fire('error', failedElement(tagName, rel));

    expect(reload).not.toHaveBeenCalled();
  });

  it('ignores errors that are not about loading a file', () => {
    fire('error', { target: fakeWindow });
    fire('unhandledrejection', { reason: new Error('something else') });
    fire('unhandledrejection', { reason: undefined });

    expect(reload).not.toHaveBeenCalled();
  });

  it('reloads only once for several failures', () => {
    fire('error', failedElement('SCRIPT'));
    fire('error', failedElement('LINK', 'modulepreload'));

    expect(reload).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[role=alert]')).toBeNull();
  });

  it('shows a message with a reload button instead of reloading again within 15 seconds', () => {
    storage['intercode.entryScriptReloadAt'] = String(Date.now() - 5000);

    fire('error', failedElement('SCRIPT'));

    expect(reload).not.toHaveBeenCalled();
    const alert = document.querySelector('[role=alert]');
    expect(alert?.textContent).toContain('We couldn’t finish loading this page');
    expect((document.querySelector('.custom-loading-indicator') as HTMLElement).style.display).toBe('none');

    (alert?.querySelector('button') as HTMLButtonElement).click();
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('reloads again after the 15 seconds have passed', () => {
    storage['intercode.entryScriptReloadAt'] = String(Date.now() - 16000);

    fire('error', failedElement('SCRIPT'));

    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('does nothing once the app has started', () => {
    fakeWindow.intercodeShellBooted = true;

    fire('error', failedElement('SCRIPT'));

    expect(reload).not.toHaveBeenCalled();
    expect(document.querySelector('[role=alert]')).toBeNull();
  });

  it('shows the message, and does not risk a reload loop, when sessionStorage is unavailable', () => {
    sessionStorageStub.getItem = () => {
      throw new Error('denied');
    };

    fire('error', failedElement('SCRIPT'));

    expect(reload).not.toHaveBeenCalled();
    expect(document.querySelector('[role=alert]')).not.toBeNull();
  });
});
