import { vi } from 'vitest';

import { render } from '../testUtils';
import {
  AuthenticationManager,
  AuthenticationManagerContext,
} from '../../../app/javascript/Authentication/authenticationManager';
import {
  AuthorizationWrapper,
  NoLoginAuthorizationWrapper,
} from '../../../app/javascript/Authentication/useAuthorizationRequired';
import { appRootContextDefaultValue, AppRootContextValue } from '../../../app/javascript/AppRootContext';

const signedIn = { __typename: 'User', id: '1', name: 'Test User' } as AppRootContextValue['currentUser'];

describe('the authorization wrappers', () => {
  let manager: AuthenticationManager;

  beforeEach(() => {
    manager = new AuthenticationManager('test-client');
  });

  const renderWrapper = (
    Wrapper: typeof AuthorizationWrapper,
    appRootContextValue: Partial<AppRootContextValue>,
    abilities: Parameters<typeof AuthorizationWrapper>[0]['abilities'] = ['can_manage_rooms'],
  ) =>
    render(
      <AuthenticationManagerContext.Provider value={manager}>
        <Wrapper abilities={abilities}>
          <div>secret stuff</div>
        </Wrapper>
      </AuthenticationManagerContext.Provider>,
      { appRootContextValue },
    );

  const abilityContext = (
    abilities: Partial<AppRootContextValue['currentAbility']>,
    currentUser: AppRootContextValue['currentUser'] | null = signedIn,
  ): Partial<AppRootContextValue> => ({
    currentUser: currentUser ?? undefined,
    currentAbility: { ...appRootContextDefaultValue.currentAbility, ...abilities },
  });

  describe('AuthorizationWrapper', () => {
    it('shows the children to a signed-in user with every required ability', async () => {
      const { getByText } = await renderWrapper(
        AuthorizationWrapper,
        abilityContext({ can_manage_rooms: true, can_manage_runs: true }),
        ['can_manage_rooms', 'can_manage_runs'],
      );

      expect(getByText('secret stuff')).toBeTruthy();
    });

    it('shows an authorization error to a signed-in user lacking an ability', async () => {
      const { getByText, queryByText } = await renderWrapper(
        AuthorizationWrapper,
        abilityContext({ can_manage_rooms: true, can_manage_runs: false }),
        ['can_manage_rooms', 'can_manage_runs'],
      );

      expect(getByText('Sorry, your account is not authorized to view this page.')).toBeTruthy();
      expect(queryByText('secret stuff')).toBeNull();
    });

    it('sends a signed-out visitor to log in rather than telling them they are unauthorized', async () => {
      const initiate = vi.spyOn(manager, 'initiateAuthentication').mockReturnValue(new Promise(() => {}));

      const { queryByText } = await renderWrapper(
        AuthorizationWrapper,
        abilityContext({ can_manage_rooms: true }, null),
      );

      expect(initiate).toHaveBeenCalled();
      expect(queryByText('secret stuff')).toBeNull();
      expect(queryByText(/not authorized/)).toBeNull();
    });
  });

  describe('NoLoginAuthorizationWrapper', () => {
    it('shows the children to anyone with the abilities, signed in or not', async () => {
      const initiate = vi.spyOn(manager, 'initiateAuthentication');

      const { getByText } = await renderWrapper(
        NoLoginAuthorizationWrapper,
        abilityContext({ can_manage_rooms: true }, null),
      );

      expect(getByText('secret stuff')).toBeTruthy();
      expect(initiate).not.toHaveBeenCalled();
    });

    it('shows an authorization error to anyone without them', async () => {
      const { getByText, queryByText } = await renderWrapper(
        NoLoginAuthorizationWrapper,
        abilityContext({ can_manage_rooms: false }),
      );

      expect(getByText(/not authorized/)).toBeTruthy();
      expect(queryByText('secret stuff')).toBeNull();
    });
  });
});
