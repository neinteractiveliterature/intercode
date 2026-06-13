import { vi } from 'vitest';
import { render } from '../testUtils';
import useLoginRequired from '../../../app/javascript/Authentication/useLoginRequired';
import {
  AuthenticationManager,
  AuthenticationManagerContext,
} from '../../../app/javascript/Authentication/authenticationManager';
import { AppRootContextValue } from '../../../app/javascript/AppRootContext';

function LoginRequiredHarness() {
  const loginRequired = useLoginRequired();
  return loginRequired === false ? <div>protected content</div> : loginRequired;
}

function renderWithManager(manager: AuthenticationManager, appRootContextValue: Partial<AppRootContextValue> = {}) {
  return render(
    <AuthenticationManagerContext.Provider value={manager}>
      <LoginRequiredHarness />
    </AuthenticationManagerContext.Provider>,
    { appRootContextValue },
  );
}

describe('useLoginRequired', () => {
  it('renders the protected content and does not initiate auth when signed in', async () => {
    const manager = new AuthenticationManager('test-client');
    const initiate = vi.spyOn(manager, 'initiateAuthentication');

    const { findByText } = await renderWithManager(manager, {
      currentUser: { __typename: 'User', id: '1', name: 'Test User' },
    });

    await findByText('protected content');
    expect(initiate).not.toHaveBeenCalled();
  });

  it('renders a loading indicator (not a blank page) while redirecting an anonymous visitor', async () => {
    const manager = new AuthenticationManager('test-client');
    // never resolves: stays in the "redirecting" state
    const initiate = vi.spyOn(manager, 'initiateAuthentication').mockReturnValue(new Promise(() => {}));

    const { queryByText } = await renderWithManager(manager);

    expect(initiate).toHaveBeenCalledTimes(1);
    expect(queryByText('protected content')).toBeNull();
  });

  it('shows an error with a retry — not a silent blank page — when initiating auth fails', async () => {
    const manager = new AuthenticationManager('test-client');
    const initiate = vi.spyOn(manager, 'initiateAuthentication').mockRejectedValue(new Error('OIDC discovery failed'));

    const { findByRole, queryByText } = await renderWithManager(manager);

    // A retry control is rendered rather than leaving a blank page
    await findByRole('button');
    expect(queryByText('protected content')).toBeNull();
    expect(initiate).toHaveBeenCalled();
  });
});
