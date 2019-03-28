import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { useQuery } from 'react-apollo-hooks';
import { flatMap, sortBy, uniq } from 'lodash';
import { humanize } from 'inflected';

import ChoiceSet from '../BuiltInFormControls/ChoiceSet';
import ErrorDisplay from '../ErrorDisplay';
import LoadingIndicator from '../LoadingIndicator';
import { MergeUsersModalQuery } from './queries.gql';

function renderIfQueryReady(render, { loading, error }) {
  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (loading) {
    return <LoadingIndicator />;
  }

  return render();
}

function getMostRecentConventionDate(user) {
  return user.user_con_profiles.map(profile => new Date(profile.convention.starts_at).getTime());
}

function compareUsers(a, b) {
  return getMostRecentConventionDate(a) - getMostRecentConventionDate(b);
}

function MergeUsersModal({ closeModal, visible, userIds }) {
  const { data, loading, error } = useQuery(MergeUsersModalQuery, {
    variables: { ids: userIds || [] },
  });
  const [winningUserId, setWinningUserId] = useState(null);

  if (winningUserId === null && !loading && !error && data.users.length > 0) {
    // loading just finished
    const usersSorted = [...data.users].sort(compareUsers);
    setWinningUserId(usersSorted[usersSorted.length - 1].id.toString());
  }

  const renderMergePreview = () => {
    if (!winningUserId) {
      return null;
    }

    const winningUser = data.users.find(user => user.id.toString() === winningUserId);
    if (!winningUser) {
      return null;
    }

    const allConventions = sortBy(
      flatMap(
        data.users,
        user => user.user_con_profiles.map(profile => profile.convention),
      ),
      convention => new Date(convention.starts_at).getTime(),
    );
    allConventions.reverse();

    const allPrivileges = uniq(flatMap(data.users, user => user.privileges));

    return (
      <div className="alert alert-warning mt-4">
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
          <dd className="col-sm-9">{allConventions.map(convention => convention.name).join(', ')}</dd>
        </dl>
      </div>
    );
  };

  const renderModalContent = () => (
    <>
      <p>Please select a user account to merge others into:</p>

      <ChoiceSet
        choices={sortBy(data.users, user => user.id).map(user => ({
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
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
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
