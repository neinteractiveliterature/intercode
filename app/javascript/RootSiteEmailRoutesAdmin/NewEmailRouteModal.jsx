import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { useMutation, useApolloClient } from '@apollo/react-hooks';

import { CreateEmailRoute } from './mutations.gql';
import EmailRouteForm from './EmailRouteForm';
import useAsyncFunction from '../useAsyncFunction';
import buildEmailRouteInput from './buildEmailRouteInput';
import ErrorDisplay from '../ErrorDisplay';

function NewEmailRouteModal({ visible, close }) {
  const [emailRoute, setEmailRoute] = useState({
    receiver_address: '',
    forward_addresses: [],
  });
  const apolloClient = useApolloClient();
  const [createMutate] = useMutation(CreateEmailRoute);
  const create = async () => {
    await createMutate({
      variables: {
        emailRoute: buildEmailRouteInput(emailRoute),
      },
    });
    await apolloClient.resetStore();
    close();
  };
  const [createClicked, error, inProgress] = useAsyncFunction(create);

  return (
    <Modal visible={visible} dialogClassName="modal-lg">
      <div className="modal-header">New email route</div>

      <div className="modal-body">
        <EmailRouteForm emailRoute={emailRoute} onChange={setEmailRoute} />

        <ErrorDisplay graphQLError={error} />
      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" type="button" onClick={close} disabled={inProgress}>
          Cancel
        </button>

        <button className="btn btn-primary" type="button" onClick={createClicked} disabled={inProgress}>
          Create email route
        </button>
      </div>
    </Modal>
  );
}

NewEmailRouteModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};

export default NewEmailRouteModal;
