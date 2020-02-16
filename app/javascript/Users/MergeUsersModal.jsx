import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { useQuery, useMutation } from '@apollo/react-hooks';
import flatMap from 'lodash-es/flatMap';
import keyBy from 'lodash-es/keyBy';
import mapValues from 'lodash-es/mapValues';
import pickBy from 'lodash-es/pickBy';
import sortBy from 'lodash-es/sortBy';
import uniq from 'lodash-es/uniq';
import uniqBy from 'lodash-es/uniqBy';
import { humanize } from 'inflected';

import ChoiceSet from '../BuiltInFormControls/ChoiceSet';
import ErrorDisplay from '../ErrorDisplay';
import LoadingIndicator from '../LoadingIndicator';
import { MergeUsers } from './mutations.gql';
import { MergeUsersModalQuery } from './queries.gql';
import pluralizeWithCount from '../pluralizeWithCount';

function renderIfQueryReady(render, { loading, error }) {
  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (loading) {
    return <LoadingIndicator />;
  }

  return render();
}

function MergeUsersModal({ closeModal, visible, userIds }) {
  const { data, loading, error } = useQuery(MergeUsersModalQuery, {
    variables: { ids: userIds || [] },
  });
  const [winningUserId, setWinningUserId] = useState(null);
  const [winningProfileIds, setWinningProfileIds] = useState({});
  const [mutate, { error: mutationError, loading: mutationInProgress }] = useMutation(MergeUsers);

  const performMerge = async () => {
    await mutate({
      variables: {
        userIds,
        winningUserId: Number.parseInt(winningUserId, 10),
        winningUserConProfiles: Object.entries(winningProfileIds)
          .map(([conventionId, userConProfileId]) => ({
            conventionId: Number.parseInt(conventionId, 10),
            userConProfileId: Number.parseInt(userConProfileId, 10),
          })),
      },
    });
    closeModal();
  };

  if (loading || error) {
    if (winningUserId !== null) {
      setWinningUserId(null);
      setWinningProfileIds({});
    }
  }

  let allConventions = [];
  let profilesByConventionId = {};
  if (!loading && !error) {
    allConventions = sortBy(
      uniqBy(
        flatMap(
          data.users,
          (user) => user.user_con_profiles.map((profile) => profile.convention),
        ),
        (convention) => convention.id,
      ),
      (convention) => new Date(convention.starts_at).getTime(),
    );
    allConventions.reverse();

    profilesByConventionId = mapValues(
      keyBy(allConventions, (convention) => convention.id),
      (convention) => flatMap(
        data.users,
        (user) => user.user_con_profiles
          .map((profile) => ({ ...profile, email: user.email }))
          .filter((profile) => profile.convention.id === convention.id),
      ),
    );
  }

  const ambiguousProfileConventionIds = Object.keys(pickBy(
    profilesByConventionId,
    (profiles) => profiles.length > 1,
  ));

  const fullyDisambiguated = ambiguousProfileConventionIds.every(
    (conventionId) => winningProfileIds[conventionId],
  );

  const renderMergePreview = () => {
    if (!winningUserId) {
      return null;
    }

    const winningUser = data.users.find((user) => user.id.toString() === winningUserId);
    if (!winningUser) {
      return null;
    }

    const allPrivileges = uniq(flatMap(data.users, (user) => user.privileges));

    const renderConventionRow = (convention) => {
      const userConProfiles = profilesByConventionId[convention.id];

      if (userConProfiles.length === 1) {
        return (
          <>
            <strong>
              {convention.name}
              :
            </strong>
            {' '}
            {userConProfiles[0].email}
            &rsquo;
            {'s profile'}
          </>
        );
      }

      return (
        <fieldset>
          <legend className="col-form-label pb-0"><strong>{convention.name}</strong></legend>

          <ChoiceSet
            choices={
              userConProfiles.map((profile) => {
                const ticketWording = profile.ticket ? `Has ${convention.ticket_name}` : `No ${convention.ticket_name}`;
                const signups = profile.signups.filter((signup) => signup.state !== 'withdrawn');
                return {
                  label: `${profile.email}’s profile [${ticketWording}, ${pluralizeWithCount('signup', signups.length)}]`,
                  value: profile.id.toString(),
                };
              })
            }
            value={winningProfileIds[convention.id]}
            onChange={(value) => setWinningProfileIds({
              ...winningProfileIds,
              [convention.id]: value,
            })}
          />
        </fieldset>
      );
    };

    return (
      <div className="mt-4">
        <p>
          {'User account '}
          {winningUserId}
          {' '}
          will be preserved.  All the others will be deleted, and their convention profiles will
          {' '}
          be merged into it.  The resulting account will look like this:
        </p>

        <dl className="row mb-0">
          <dt className="col-sm-3">First name</dt>
          <dd className="col-sm-9">{winningUser.first_name}</dd>

          <dt className="col-sm-3">Last name</dt>
          <dd className="col-sm-9">{winningUser.last_name}</dd>

          <dt className="col-sm-3">Email</dt>
          <dd className="col-sm-9">{winningUser.email}</dd>

          <dt className="col-sm-3">Privileges</dt>
          <dd className="col-sm-9">{allPrivileges.map(humanize).join(', ')}</dd>

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
        choices={sortBy(data.users, (user) => user.id).map((user) => ({
          label: `${user.id} (${user.name}, ${user.email})`,
          value: user.id.toString(),
        }))}
        value={winningUserId}
        onChange={setWinningUserId}
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
        <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
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

MergeUsersModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  userIds: PropTypes.arrayOf(PropTypes.number),
};

MergeUsersModal.defaultProps = {
  userIds: null,
};

export default MergeUsersModal;
