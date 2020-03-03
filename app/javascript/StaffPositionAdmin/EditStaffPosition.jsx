import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';

import ErrorDisplay from '../ErrorDisplay';
import StaffPositionForm from './StaffPositionForm';
import { UpdateStaffPosition } from './mutations.gql';
import { StaffPositionsQuery } from './queries.gql';
import useAsyncFunction from '../useAsyncFunction';
import usePageTitle from '../usePageTitle';
import PageLoadingIndicator from '../PageLoadingIndicator';

function EditStaffPositionForm({ initialStaffPosition }) {
  const history = useHistory();
  const [staffPosition, setStaffPosition] = useState(initialStaffPosition);
  const [updateMutate] = useMutation(UpdateStaffPosition);
  const [mutate, updateError, requestInProgress] = useAsyncFunction(updateMutate);

  usePageTitle(`Editing “${initialStaffPosition.name}”`);

  const saveClicked = useCallback(
    async () => {
      await mutate({
        variables: {
          input: {
            id: staffPosition.id,
            staff_position: {
              name: staffPosition.name,
              email: staffPosition.email,
              visible: staffPosition.visible,
              user_con_profile_ids: (staffPosition.user_con_profiles || []).map((
                (userConProfile) => userConProfile.id
              )),
            },
          },
        },
      });
      history.push('/staff_positions');
    },
    [mutate, staffPosition, history],
  );

  return (
    <div>
      <h1 className="mb-4">
        Editing
        {' '}
        {initialStaffPosition.name}
      </h1>
      <StaffPositionForm
        staffPosition={staffPosition}
        onChange={setStaffPosition}
      />
      <ErrorDisplay graphQLError={updateError} />
      <button type="button" className="btn btn-primary" onClick={saveClicked} disabled={requestInProgress}>
        Save changes
      </button>
    </div>
  );
}

EditStaffPositionForm.propTypes = {
  initialStaffPosition: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

function EditStaffPosition() {
  const { id } = useParams();
  const { data, loading, error } = useQuery(StaffPositionsQuery);

  const initialStaffPosition = useMemo(
    () => (loading || error
      ? null
      : data.convention.staff_positions.find((sp) => sp.id.toString(10) === id)),
    [loading, error, data, id],
  );

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return <EditStaffPositionForm initialStaffPosition={initialStaffPosition} />;
}

export default EditStaffPosition;
