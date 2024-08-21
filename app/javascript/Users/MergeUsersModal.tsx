import { useMemo, useState } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import flatMap from 'lodash/flatMap';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import { ChoiceSet, ErrorDisplay } from '@neinteractiveliterature/litform';

import { MergeUsersModalQueryData, MergeUsersModalQueryDocument } from './queries.generated';
import humanize from '../humanize';
import { Trans, useTranslation } from 'react-i18next';
import {
  ActionFunction,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from 'react-router';
import { client } from '../useIntercodeApolloClient';
import { MergeUsersDocument } from './mutations.generated';
import { i18n } from '../setupI18Next';
import { ApolloError } from '@apollo/client';
import { useSubmit } from 'react-router-dom';

type UserType = MergeUsersModalQueryData['users'][0];
type UserConProfileType = UserType['user_con_profiles'][0];
type ConventionType = UserConProfileType['convention'];

type ActionArgs = {
  userIds: string[];
  winningUserId: string | null;
  winningProfileIds: Record<string, string>;
};

export const action: ActionFunction = async ({ request }) => {
  const { userIds, winningUserId, winningProfileIds } = (await request.json()) as ActionArgs;
  if (!userIds) {
    throw new Error(i18n.t('admin.users.merge.noUsers'));
  }
  if (!winningUserId) {
    throw new Error(i18n.t('admin.users.merge.noWinner'));
  }

  try {
    await client.mutate({
      mutation: MergeUsersDocument,
      variables: {
        userIds: userIds,
        winningUserId: winningUserId,
        winningUserConProfiles: Object.entries(winningProfileIds).map(([conventionId, userConProfileId]) => ({
          conventionId: conventionId,
          userConProfileId: userConProfileId,
        })),
      },
      refetchQueries: 'active',
      awaitRefetchQueries: true,
    });
  } catch (e) {
    return e;
  }

  return redirect('..');
};

export const loader: LoaderFunction = async ({ params: { ids } }) => {
  const { data } = await client.query({
    query: MergeUsersModalQueryDocument,
    variables: { ids: ids?.split(',') ?? [] },
  });
  return data;
};

function MergeUsersModal(): JSX.Element {
  const data = useLoaderData() as MergeUsersModalQueryData;
  const [winningUserId, setWinningUserId] = useState<string>();
  const [winningProfileIds, setWinningProfileIds] = useState(new Map<string, string>());
  const { t } = useTranslation();
  const navigate = useNavigate();
  const mutationError = useActionData();
  const navigation = useNavigation();
  const submit = useSubmit();

  const { profilesByConventionId, allConventions, ambiguousProfileConventionIds } = useMemo(() => {
    const profilesByConventionId = new Map<string, UserConProfileType[]>();
    const allConventions = sortBy(
      uniqBy(
        flatMap(data.users, (user) => user.user_con_profiles.map((profile) => profile.convention)),
        (convention) => convention.id,
      ),
      (convention) => (convention.starts_at ? new Date(convention.starts_at).getTime() : 0),
    );
    allConventions.reverse();

    allConventions.forEach((convention) => {
      const profiles = flatMap(data.users, (user) =>
        user.user_con_profiles
          .map((profile) => ({ ...profile, email: user.email }))
          .filter((profile) => profile.convention.id === convention.id),
      );
      profilesByConventionId.set(convention.id, profiles);
    });

    const ambiguousProfileConventionIds = [...profilesByConventionId.entries()]
      .filter(([, profiles]) => profiles.length > 1)
      .map(([conventionId]) => conventionId);

    return { profilesByConventionId, allConventions, ambiguousProfileConventionIds };
  }, [data.users]);

  const fullyDisambiguated = ambiguousProfileConventionIds.every((conventionId) => winningProfileIds.get(conventionId));

  const renderMergePreview = () => {
    if (!winningUserId || !data) {
      return null;
    }

    const winningUser = data.users.find((user) => user.id === winningUserId);
    if (!winningUser) {
      return null;
    }

    const allPrivileges = uniq(flatMap(data.users, (user) => user.privileges));

    const renderConventionRow = (convention: ConventionType) => {
      const userConProfiles = profilesByConventionId.get(convention.id) ?? [];

      if (userConProfiles.length === 1) {
        return (
          <Trans
            i18nKey="admin.users.merge.singleProfile"
            values={{ conventionName: convention.name, email: userConProfiles[0].email }}
          />
        );
      }

      return (
        <fieldset>
          <legend className="col-form-label pb-0">
            <strong>{convention.name}</strong>
          </legend>
          <ChoiceSet
            choices={userConProfiles.map((profile) => {
              const ticketWording = profile.ticket
                ? t('admin.users.merge.hasTicket', { ticketName: convention.ticket_name })
                : t('admin.users.merge.noTicket', { ticketName: convention.ticket_name });
              const signups = profile.signups.filter((signup) => signup.state !== 'withdrawn');
              const signupWording = t('admin.users.merge.signupCount', {
                count: signups.length,
              });
              return {
                label: t('admin.users.merge.profileLabel', {
                  email: profile.email,
                  ticketDescription: ticketWording,
                  signupsDescription: signupWording,
                }),
                value: profile.id.toString(),
              };
            })}
            value={winningProfileIds.get(convention.id)?.toString()}
            onChange={(value: string) =>
              setWinningProfileIds((prevWinningProfileIds) => {
                const newWinningProfileIds = new Map(prevWinningProfileIds);
                newWinningProfileIds.set(convention.id, value);
                return newWinningProfileIds;
              })
            }
          />
        </fieldset>
      );
    };

    return (
      <div className="mt-4">
        <p>{t('admin.users.merge.actionDescription', { winningUserId })}</p>

        <dl className="row mb-0">
          <dt className="col-sm-3">{t('authentication.userForm.firstNameLabel')}</dt>
          <dd className="col-sm-9">{winningUser.first_name}</dd>

          <dt className="col-sm-3">{t('authentication.userForm.lastNameLabel')}</dt>
          <dd className="col-sm-9">{winningUser.last_name}</dd>

          <dt className="col-sm-3">{t('authentication.userForm.emailLabel')}</dt>
          <dd className="col-sm-9">{winningUser.email}</dd>

          <dt className="col-sm-3">{t('admin.users.edit.privileges')}</dt>
          <dd className="col-sm-9">{allPrivileges.map((priv) => humanize(priv ?? '')).join(', ')}</dd>

          <dt className="col-sm-3">{t('admin.users.edit.conventionProfiles')}</dt>
          <dd className="col-sm-9">
            <ul className="list-unstyled">
              {allConventions.map((convention) => (
                <li key={convention.id}>{renderConventionRow(convention)}</li>
              ))}
            </ul>
          </dd>
        </dl>
      </div>
    );
  };

  return (
    <Modal visible dialogClassName="modal-lg">
      <div className="modal-header">{t('admin.users.merge.title')}</div>

      <div className="modal-body">
        <p>{t('admin.users.merge.selectWinningUser')}</p>

        <ChoiceSet
          choices={sortBy(data?.users, (user) => user.id).map((user) => ({
            label: `${user.id} (${user.name}, ${user.email})`,
            value: user.id.toString(),
          }))}
          value={winningUserId?.toString()}
          onChange={(newValue: string) => setWinningUserId(newValue)}
        />

        {renderMergePreview()}

        <ErrorDisplay graphQLError={mutationError as ApolloError} />
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={() => navigate('..')}>
          {t('buttons.cancel')}
        </button>
        <button
          type="button"
          className="btn btn-danger"
          disabled={!winningUserId || !fullyDisambiguated || navigation.state !== 'idle'}
          onClick={() => {
            const args: ActionArgs = {
              userIds: data.users.map((user) => user.id),
              winningProfileIds: Object.fromEntries(winningProfileIds.entries()),
              winningUserId: winningUserId ?? null,
            };
            submit(args, { method: 'POST', encType: 'application/json' });
          }}
        >
          {t('admin.users.merge.buttonLabel')}
        </button>
      </div>
    </Modal>
  );
}

export const Component = MergeUsersModal;
