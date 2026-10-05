import { vi } from 'vitest';

import { render, userEvent, waitFor, within } from '../testUtils';
import { BecomeUserModal } from '../../../app/javascript/UserConProfiles/UserConProfileAdminDisplay';
import {
  AuthenticationManager,
  AuthenticationManagerContext,
} from '../../../app/javascript/Authentication/authenticationManager';

const jsonResponse = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' }, ...init });

// Becoming another user is a sensitive action, so it's worth pinning down what exactly gets sent and when the modal
// closes or leaves the page.
describe('BecomeUserModal', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const fetchMock = vi.fn<typeof fetch>();
  const close = vi.fn();
  const location = { href: 'http://localhost/user_con_profiles/7' };

  beforeEach(() => {
    user = userEvent.setup();
    fetchMock.mockReset();
    close.mockReset();
    location.href = 'http://localhost/user_con_profiles/7';
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('location', location);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const renderModal = (
    props: Partial<React.ComponentProps<typeof BecomeUserModal>> = {},
    { token = 'access-token' }: { token?: string } = {},
  ) => {
    const manager = new AuthenticationManager('test-client');
    vi.spyOn(manager, 'ensureFreshAccessToken').mockResolvedValue(token || undefined);

    return render(
      <AuthenticationManagerContext.Provider value={manager}>
        <BecomeUserModal visible close={close} userConProfileId="7" userConProfileName="Alice Attendee" {...props} />
      </AuthenticationManagerContext.Provider>,
    );
  };

  const becomeButton = (result: Awaited<ReturnType<typeof renderModal>>) =>
    result.getByRole('button', { name: 'Become user', hidden: true });

  // (the test wrapper's confirm dialog has a Cancel button of its own, so look within this modal's footer)
  const cancelButton = (result: Awaited<ReturnType<typeof renderModal>>) =>
    within(becomeButton(result).closest('.modal-footer') as HTMLElement).getByRole('button', {
      name: 'Cancel',
      hidden: true,
    });

  it('names the user being become, and warns that the actions are logged', async () => {
    const { getByText } = await renderModal();

    expect(getByText(/Alice Attendee/)).toBeTruthy();
    expect(getByText(/will be logged/)).toBeTruthy();
  });

  it('sends the justification and the access token, then goes to the home page as that user', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}));
    const result = await renderModal();

    await user.type(result.getByLabelText('Justification'), 'User asked for signup help');
    await user.click(becomeButton(result));

    await waitFor(() => expect(location.href).toBe('/'));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/user_con_profiles/7/become');
    expect(init?.method).toBe('POST');
    expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer access-token');
    expect((init?.body as FormData).get('justification')).toBe('User asked for signup help');
    expect(close).toHaveBeenCalledTimes(1);
  });

  it('sends the request without an Authorization header when there is no access token', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}));
    const result = await renderModal({}, { token: '' });

    await user.click(becomeButton(result));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock.mock.calls[0][1]?.headers).not.toHaveProperty('Authorization');
  });

  it('shows the server’s errors, and neither leaves the page nor closes, if it is refused', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ errors: { justification: "can't be blank" } }, { status: 422 }));
    const result = await renderModal();

    await user.click(becomeButton(result));

    expect(await result.findByText(/Justification can't be blank/)).toBeTruthy();
    expect(location.href).toBe('http://localhost/user_con_profiles/7');
    expect(close).not.toHaveBeenCalled();
    expect(becomeButton(result)).toBeEnabled();
  });

  it('shows the error, and does not leave the page, if the request itself fails', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
    const result = await renderModal();

    await user.click(becomeButton(result));

    expect(await result.findByText(/Failed to fetch/)).toBeTruthy();
    expect(location.href).toBe('http://localhost/user_con_profiles/7');
    expect(close).not.toHaveBeenCalled();
  });

  it('disables both buttons while the request is in progress', async () => {
    let respond!: (response: Response) => void;
    fetchMock.mockReturnValue(new Promise<Response>((resolve) => (respond = resolve)));
    const result = await renderModal();

    await user.click(becomeButton(result));

    await waitFor(() => expect(becomeButton(result)).toBeDisabled());
    expect(cancelButton(result)).toBeDisabled();
    respond(jsonResponse({}));
    await waitFor(() => expect(close).toHaveBeenCalled());
  });

  it('closes without sending anything when cancelled', async () => {
    const result = await renderModal();

    await user.click(cancelButton(result));

    expect(close).toHaveBeenCalledTimes(1);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('has no Become user button when there is no profile to become', async () => {
    const { queryByRole } = await renderModal({ userConProfileId: undefined });

    expect(queryByRole('button', { name: 'Become user', hidden: true })).toBeNull();
  });
});
