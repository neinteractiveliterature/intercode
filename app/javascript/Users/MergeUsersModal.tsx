import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import flatMap from 'lodash/flatMap';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import { ApolloError } from '@apollo/client';
import { LoadingIndicator, ChoiceSet, ErrorDisplay } from '@neinteractiveliterature/litform';

import { MergeUsersModalQueryData, useMergeUsersModalQuery } from './queries.generated';
import { useMergeUsersMutation } from './mutations.generated';
import humanize from '../humanize';
import { useTranslation } from 'react-i18next';

function renderIfQueryReady(render: () => JSX.Element, { loading, error }: { loading: boolean; error?: ApolloError }) {
  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (loading) {
    return <LoadingIndicator iconSet="bootstrap-icons" />;
  }

  return render();
}

type UserType = MergeUsersModalQueryData['users'][0];
type UserConProfileType = UserType['user_con_profiles'][0];
type ConventionType = UserConProfileType['convention'];

export type MergeUsersModalProps = {
  closeModal: () => void;
  visible: boolean;
  userIds?: string[];
};

function MergeUsersModal({ closeModal, visible, userIds }: MergeUsersModalProps): JSX.Element {
  const { data, loading, error } = useMergeUsersModalQuery({
    variables: { ids: userIds || [] },
  });
  const [winningUserId, setWinningUserId] = useState<string>();
  const [winningProfileIds, setWinningProfileIds] = useState(new Map<string, string>());
  const [mutate, { error: mutationError, loading: mutationInProgress }] = useMergeUsersMutation();
  const { t } = useTranslation();

  const performMerge = async () => {
    if (!userIds) {
      throw new Error(t('admin.users.merge.noUsers'));
    }
    if (!winningUserId) {
      throw new Error(t('admin.users.merge.noWinner'));
    }
    await mutate({
      variables: {
        userIds: userIds,
        winningUserId: winningUserId,
        winningUserConProfiles: [...winningProfileIds.entries()].map(([conventionId, userConProfileId]) => ({
          conventionId: conventionId,
          userConProfileId: userConProfileId,
        })),
      },
    });
    closeModal();
  };

  useEffect(() => {
    if (loading || error) {
      if (winningUserId !== null) {
        setWinningUserId(undefined);
        setWinningProfileIds(new Map<string, string>());
      }
    }
  }, [error, loading, winningUserId]);

  let allConventions: ConventionType[] = [];
  const profilesByConventionId = new Map<string, UserConProfileType[]>();
  if (!loading && !error && data) {
    allConventions = sortBy(
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
  }

  const ambiguousProfileConventionIds = [...profilesByConventionId.entries()]
    .filter(([, profiles]) => profiles.length > 1)
    .map(([conventionId]) => conventionId);

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
          <>
            <strong>{convention.name}:</strong> {userConProfiles[0].email}’s profile
          </>
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
        <p>
          {'User account '}
          {winningUserId} will be preserved. All the others will be deleted, and their convention profiles will be
          merged into it. The resulting account will look like this:
        </p>

        <dl className="row mb-0">
          <dt className="col-sm-3">First name</dt>
          <dd className="col-sm-9">{winningUser.first_name}</dd>

          <dt className="col-sm-3">Last name</dt>
          <dd className="col-sm-9">{winningUser.last_name}</dd>

          <dt className="col-sm-3">Email</dt>
          <dd className="col-sm-9">{winningUser.email}</dd>

          <dt className="col-sm-3">Privileges</dt>
          <dd className="col-sm-9">{allPrivileges.map((priv) => humanize(priv ?? '')).join(', ')}</dd>

          <dt className="col-sm-3">Conventions</dt>
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

  const renderModalContent = () => (
    <>
      <p>Please select a user account to merge others into:</p>

      <ChoiceSet
        choices={sortBy(data?.users, (user) => user.id).map((user) => ({
          label: `${user.id} (${user.name}, ${user.email})`,
          value: user.id.toString(),
        }))}
        value={winningUserId?.toString()}
        onChange={(newValue: string) => setWinningUserId(newValue)}
      />

      {renderMergePreview()}
    </>
  );

  return (
    <Modal visible={visible} dialogClassName="modal-lg">
      <div className="modal-header">Merge users</div>

      <div className="modal-body">
        {renderIfQueryReady(renderModalContent, { loading, error })}

        <ErrorDisplay graphQLError={mutationError} />
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={closeModal}>
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-danger"
          disabled={!winningUserId || !fullyDisambiguated || mutationInProgress}
          onClick={performMerge}
        >
          Merge
        </button>
      </div>
    </Modal>
  );
}

export default MergeUsersModal;
