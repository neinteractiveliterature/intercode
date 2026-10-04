import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import { renderRoute, userEvent, waitFor } from '../testUtils';
import formFromExportJSON from '../formFromExportJSON';
import {
  Component as EditUserConProfile,
  action,
  loader,
} from '../../../app/javascript/UserConProfiles/EditUserConProfile';
import {
  UserConProfileQueryData,
  UserConProfileQueryDocument,
} from '../../../app/javascript/UserConProfiles/queries.generated';
import {
  UpdateUserConProfileDocument,
  UpdateUserConProfileMutationData,
  UpdateUserConProfileMutationVariables,
} from '../../../app/javascript/UserConProfiles/mutations.generated';
import { FormItemRole, FormType, TimezoneMode } from '../../../app/javascript/graphqlTypes.generated';

const profileForm = formFromExportJSON({
  title: 'Attendee profile',
  form_type: FormType.UserConProfile,
  sections: [
    {
      title: 'Profile',
      section_items: [
        {
          item_type: 'free_text',
          identifier: 'first_name',
          caption: 'First name',
          lines: 1,
          free_text_type: 'text',
          format: 'text',
        },
        {
          item_type: 'free_text',
          identifier: 'last_name',
          caption: 'Last name',
          lines: 1,
          free_text_type: 'text',
          format: 'text',
        },
      ],
    },
  ],
});

function buildQueryData(formResponseAttrs: Record<string, string>): UserConProfileQueryData {
  return {
    __typename: 'Query',
    convention: {
      __typename: 'Convention',
      id: '1',
      starts_at: '2026-06-01T00:00:00Z',
      ends_at: '2026-06-03T00:00:00Z',
      timezone_name: 'America/New_York',
      timezone_mode: TimezoneMode.ConventionLocal,
      user_con_profile: {
        __typename: 'UserConProfile',
        id: '7',
        current_user_form_item_viewer_role: FormItemRole.Admin,
        current_user_form_item_writer_role: FormItemRole.Admin,
        name: 'Alice Attendee',
        form_response_attrs_json: JSON.stringify(formResponseAttrs),
        gravatar_enabled: false,
        gravatar_url: '',
      },
      user_con_profile_form: profileForm,
    },
  };
}

function buildMutationData(formResponseAttrs: Record<string, string>): UpdateUserConProfileMutationData {
  return {
    __typename: 'Mutation',
    updateUserConProfile: {
      __typename: 'UpdateUserConProfilePayload',
      user_con_profile: {
        __typename: 'UserConProfile',
        id: '7',
        needs_update: false,
        name: 'Alicia Attendee',
        form_response_attrs_json: JSON.stringify(formResponseAttrs),
        gravatar_enabled: false,
        gravatar_url: '',
      },
    },
  };
}

describe('EditUserConProfile', () => {
  const initialAttrs = { first_name: 'Alice', last_name: 'Attendee' };
  let user: ReturnType<typeof userEvent.setup>;
  const savedAttrs = vi.fn<(attrs: Record<string, unknown>) => void>();

  beforeEach(() => {
    user = userEvent.setup();
    savedAttrs.mockReset();
  });

  const queryMock: MockLink.MockedResponse<UserConProfileQueryData> = {
    request: { query: UserConProfileQueryDocument, variables: { id: '7' } },
    result: { data: buildQueryData(initialAttrs) },
  };

  // A mutation mock that records what it was asked to save, so the tests can check the payload the action sent
  const mutationMock = (
    options: Partial<
      MockLink.MockedResponse<UpdateUserConProfileMutationData, UpdateUserConProfileMutationVariables>
    > = {},
  ): MockLink.MockedResponse<UpdateUserConProfileMutationData, UpdateUserConProfileMutationVariables> => ({
    request: {
      query: UpdateUserConProfileDocument,
      variables: (variables) => {
        savedAttrs(JSON.parse(variables.input.user_con_profile?.form_response_attrs_json ?? 'null'));
        return variables.input.id === '7';
      },
    },
    result: { data: buildMutationData({ first_name: 'Alicia', last_name: 'Attendee' }) },
    ...options,
  });

  const renderEditPage = (apolloMocks: MockLink.MockedResponse[]) =>
    renderRoute(
      [
        { path: '/user_con_profiles/:id/edit', loader, action, Component: EditUserConProfile },
        { path: '/user_con_profiles/:id', Component: () => <h1>Viewing a profile</h1> },
      ],
      { apolloMocks, initialEntries: ['/user_con_profiles/7/edit'] },
    );

  it('loads the profile named in the URL, and shows its name and form values', async () => {
    const { findByRole, getByRole } = await renderEditPage([queryMock]);

    expect(await findByRole('heading', { name: 'Editing Alice Attendee' })).toBeTruthy();
    expect(getByRole('textbox', { name: 'First name' })).toHaveValue('Alice');
    expect(getByRole('textbox', { name: 'Last name' })).toHaveValue('Attendee');
    await waitFor(() => expect(document.title).toBe('Editing “Alice Attendee”'));
  });

  it('saves the edited form values and goes to the profile page', async () => {
    const { findByRole, getByRole } = await renderEditPage([queryMock, mutationMock()]);

    const firstName = await findByRole('textbox', { name: 'First name' });
    await user.clear(firstName);
    await user.type(firstName, 'Alicia');
    await user.click(getByRole('button', { name: 'Save changes' }));

    expect(await findByRole('heading', { name: 'Viewing a profile' })).toBeTruthy();
    expect(savedAttrs).toHaveBeenLastCalledWith({ first_name: 'Alicia', last_name: 'Attendee' });
  });

  it('keeps the Save button disabled while the update is in progress', async () => {
    const { getByRole, findByRole } = await renderEditPage([queryMock, mutationMock({ delay: 50 })]);

    await findByRole('textbox', { name: 'First name' });
    await user.click(getByRole('button', { name: 'Save changes' }));

    await waitFor(() => expect(getByRole('button', { name: 'Save changes' })).toBeDisabled());
    expect(await findByRole('heading', { name: 'Viewing a profile' })).toBeTruthy();
  });

  it('shows the error and stays on the page if the update fails', async () => {
    const { findByRole, getByRole, findByText } = await renderEditPage([
      queryMock,
      mutationMock({ result: { errors: [{ message: 'First name is invalid' }] } }),
    ]);

    await user.type(await findByRole('textbox', { name: 'First name' }), '!');
    await user.click(getByRole('button', { name: 'Save changes' }));

    expect(await findByText(/First name is invalid/)).toBeTruthy();
    expect(getByRole('heading', { name: 'Editing Alice Attendee' })).toBeTruthy();
    expect(getByRole('button', { name: 'Save changes' })).toBeEnabled();
  });
});
