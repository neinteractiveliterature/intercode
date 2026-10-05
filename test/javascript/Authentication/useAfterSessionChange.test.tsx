import { vi } from 'vitest';

import { render, userEvent } from '../testUtils';
import useAfterSessionChange from '../../../app/javascript/Authentication/useAfterSessionChange';

const toastOnNextPageLoad = vi.fn();

vi.mock('@neinteractiveliterature/litform', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@neinteractiveliterature/litform')>()),
  useToastOnNextPageLoad: () => toastOnNextPageLoad,
}));

describe('useAfterSessionChange', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let location: { href: string; host: string; reload: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    user = userEvent.setup();
    toastOnNextPageLoad.mockReset();
    location = { href: 'https://example.com/events?show_authentication=true', host: 'example.com', reload: vi.fn() };
    vi.stubGlobal('location', location);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const renderHarness = (destPath?: string | null, toast?: { title: string; body: string }) => {
    function Harness() {
      const afterSessionChange = useAfterSessionChange();
      return (
        <button type="button" onClick={() => afterSessionChange(destPath as string | undefined, toast)}>
          go
        </button>
      );
    }

    return render(<Harness />);
  };

  const go = async (destPath?: string | null, toast?: { title: string; body: string }) => {
    const { getByRole } = await renderHarness(destPath, toast);
    await user.click(getByRole('button', { name: 'go' }));
  };

  it('goes to the destination path', async () => {
    await go('/my_profile');

    expect(location.href).toBe('https://example.com/my_profile');
    expect(location.reload).not.toHaveBeenCalled();
  });

  it('goes to an absolute URL on another host', async () => {
    await go('https://other.example.org/page');

    expect(location.href).toBe('https://other.example.org/page');
  });

  it('strips show_authentication from the destination', async () => {
    await go('/events?show_authentication=true&page=2');

    expect(location.href).toBe('https://example.com/events?page=2');
  });

  it('goes to the current page without show_authentication if that is what it had', async () => {
    await go(undefined);

    expect(location.href).toBe('https://example.com/events');
    expect(location.reload).not.toHaveBeenCalled();
  });

  it('reloads when the destination is the current page', async () => {
    location.href = 'https://example.com/events';

    await go('/events');

    expect(location.reload).toHaveBeenCalled();
  });

  it('goes home instead of to the sign-in page, so as not to sign in twice', async () => {
    await go('/users/sign_in');

    expect(location.href).toBe('https://example.com/');
  });

  it('does not treat a sign-in page on another host that way', async () => {
    await go('https://other.example.org/users/sign_in');

    expect(location.href).toBe('https://other.example.org/users/sign_in');
  });

  it('arranges for a toast on the next page load, if given a message', async () => {
    await go('/', { title: 'Welcome', body: 'Hello there' });

    expect(toastOnNextPageLoad).toHaveBeenCalledWith({ title: 'Welcome', body: 'Hello there' });
  });

  it('does not toast without a message', async () => {
    await go('/');

    expect(toastOnNextPageLoad).not.toHaveBeenCalled();
  });
});
