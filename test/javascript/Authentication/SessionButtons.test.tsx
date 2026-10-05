import { vi } from 'vitest';

import { render, userEvent, waitFor } from '../testUtils';
import {
  AuthenticationManager,
  AuthenticationManagerContext,
} from '../../../app/javascript/Authentication/authenticationManager';
import SignInButton from '../../../app/javascript/Authentication/SignInButton';
import SignUpButton from '../../../app/javascript/Authentication/SignUpButton';
import SignOutButton from '../../../app/javascript/Authentication/SignOutButton';

const toastOnNextPageLoad = vi.fn();

vi.mock('@neinteractiveliterature/litform', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@neinteractiveliterature/litform')>()),
  useToastOnNextPageLoad: () => toastOnNextPageLoad,
}));

describe('the sign in, sign up and sign out buttons', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let manager: AuthenticationManager;
  let location: { href: string; host: string; origin: string; reload: () => void };

  beforeEach(() => {
    user = userEvent.setup();
    toastOnNextPageLoad.mockReset();
    manager = new AuthenticationManager('test-client');
    location = {
      href: 'https://example.com/events/1',
      host: 'example.com',
      origin: 'https://example.com',
      reload: vi.fn(),
    };
    vi.stubGlobal('location', location);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const renderWithManager = (ui: React.JSX.Element) =>
    render(<AuthenticationManagerContext.Provider value={manager}>{ui}</AuthenticationManagerContext.Provider>);

  describe('SignInButton', () => {
    it('starts authentication, returning to the current page, and goes to the authorization URL', async () => {
      const initiate = vi
        .spyOn(manager, 'initiateAuthentication')
        .mockResolvedValue({ redirectUrl: new URL('https://auth.example.com/oauth/authorize?x=1') });
      const { getByRole } = await renderWithManager(<SignInButton />);

      await user.click(getByRole('button', { name: 'Log in' }));

      await waitFor(() => expect(location.href).toBe('https://auth.example.com/oauth/authorize?x=1'));
      expect(initiate).toHaveBeenCalledWith('https://example.com/events/1');
    });

    it('can be told where to return to, and what to say', async () => {
      const initiate = vi
        .spyOn(manager, 'initiateAuthentication')
        .mockResolvedValue({ redirectUrl: new URL('https://auth.example.com/authorize') });
      const { getByRole } = await renderWithManager(
        <SignInButton afterSignInPath="/my_profile" caption="Sign in here" className="btn btn-primary" />,
      );

      await user.click(getByRole('button', { name: 'Sign in here' }));

      expect(initiate).toHaveBeenCalledWith('/my_profile');
      expect(getByRole('button', { name: 'Sign in here' }).className).toBe('btn btn-primary');
    });
  });

  describe('SignUpButton', () => {
    it('goes to the sign-up page on the issuer, set to continue into authentication afterwards', async () => {
      manager.issuerUrl = 'https://auth.example.com';
      vi.spyOn(manager, 'initiateAuthentication').mockResolvedValue({
        redirectUrl: new URL('https://auth.example.com/oauth/authorize?x=1'),
      });
      const { getByRole } = await renderWithManager(<SignUpButton />);

      await user.click(getByRole('button', { name: 'Sign up' }));

      await waitFor(() => expect(location.href).toContain('https://auth.example.com/users/sign_up'));
      const url = new URL(location.href);
      expect(url.searchParams.get('user_return_to')).toBe('https://auth.example.com/oauth/authorize?x=1');
    });

    it('uses the current site when there is no issuer URL', async () => {
      vi.spyOn(manager, 'initiateAuthentication').mockResolvedValue({
        redirectUrl: new URL('https://auth.example.com/oauth/authorize'),
      });
      const { getByRole } = await renderWithManager(<SignUpButton caption="Join" />);

      await user.click(getByRole('button', { name: 'Join' }));

      await waitFor(() => expect(location.href).toContain('https://example.com/users/sign_up'));
    });
  });

  describe('SignOutButton', () => {
    it('goes to the end-session endpoint when there is one', async () => {
      const signOut = vi
        .spyOn(manager, 'signOut')
        .mockResolvedValue({ endSessionEndpoint: 'https://auth.example.com/users/sign_out' });
      const { getByRole } = await renderWithManager(<SignOutButton />);

      await user.click(getByRole('button', { name: 'Log out' }));

      await waitFor(() => expect(location.href).toBe('https://auth.example.com/users/sign_out'));
      expect(signOut).toHaveBeenCalled();
      expect(toastOnNextPageLoad).not.toHaveBeenCalled();
    });

    it('otherwise goes home with a signed-out message', async () => {
      vi.spyOn(manager, 'signOut').mockResolvedValue({ endSessionEndpoint: undefined });
      const { getByRole } = await renderWithManager(<SignOutButton />);

      await user.click(getByRole('button', { name: 'Log out' }));

      await waitFor(() => expect(location.href).toBe('https://example.com/'));
      expect(toastOnNextPageLoad).toHaveBeenCalledWith(
        expect.objectContaining({ title: expect.any(String), body: expect.any(String) }),
      );
    });

    it('can be given its own caption and class', async () => {
      const { getByRole } = await renderWithManager(<SignOutButton caption="Bye" className="nav-link" />);

      expect(getByRole('button', { name: 'Bye' }).className).toBe('nav-link');
    });
  });
});
