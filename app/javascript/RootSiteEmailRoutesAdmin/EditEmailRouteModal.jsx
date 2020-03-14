import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { useMutation, useApolloClient } from '@apollo/react-hooks';

import { UpdateEmailRoute, DeleteEmailRoute } from './mutations.gql';
import EmailRouteForm from './EmailRouteForm';
import useAsyncFunction from '../useAsyncFunction';
import buildEmailRouteInput from './buildEmailRouteInput';
import ErrorDisplay from '../ErrorDisplay';
import { useConfirm } from '../ModalDialogs/Confirm';

function EditEmailRouteModal({ visible, close, initialEmailRoute }) {
  const confirm = useConfirm();
  const [emailRoute, setEmailRoute] = useState(initialEmailRoute);
  const apolloClient = useApolloClient();

  const [updateMutate] = useMutation(UpdateEmailRoute);
  const update = async () => {
    await updateMutate({
      variables: {
        id: initialEmailRoute.id,
        emailRoute: buildEmailRouteInput(emailRoute),
      },
    });
    close();
  };
  const [updateClicked, error, inProgress] = useAsyncFunction(update);

  const [deleteMutate] = useMutation(DeleteEmailRoute);
  const deleteConfirmed = async () => {
    await deleteMutate({ variables: { id: initialEmailRoute.id } });
    await apolloClient.resetStore();
    close();
  };

  useEffect(
    () => {
      setEmailRoute(initialEmailRoute);
    },
    [initialEmailRoute],
  );

  return (
    <Modal visible={visible} dialogClassName="modal-lg">
      <div className="modal-header">
        <div className="flex-grow-1">Edit email route</div>
        <button
          className="btn-sm btn-outline-danger"
          type="button"
          onClick={() => confirm({
            prompt: `Are you sure you want to delete the email route for ${initialEmailRoute.receiver_address}?`,
            action: deleteConfirmed,
            renderError: (e) => <ErrorDisplay graphQLError={e} />,
          })}
        >
          <i className="fa fa-trash-o" />
          {' '}
          Delete route
        </button>
      </div>

      <div className="modal-body">
        {emailRoute && <EmailRouteForm emailRoute={emailRoute} onChange={setEmailRoute} />}

        <ErrorDisplay graphQLError={error} />
      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" type="button" onClick={close} disabled={inProgress}>
          Cancel
        </button>

        <button className="btn btn-primary" type="button" onClick={updateClicked} disabled={inProgress}>
          Update email route
        </button>
      </div>
    </Modal>
  );
}

EditEmailRouteModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  initialEmailRoute: PropTypes.shape({
    id: PropTypes.number.isRequired,
    receiver_address: PropTypes.string.isRequired,
  }).isRequired,
};

export default EditEmailRouteModal;
