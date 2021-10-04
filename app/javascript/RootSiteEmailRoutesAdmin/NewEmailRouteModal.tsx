import { useState } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { useApolloClient, ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import EmailRouteForm from './EmailRouteForm';
import useAsyncFunction from '../useAsyncFunction';
import buildEmailRouteInput from './buildEmailRouteInput';
import { useCreateEmailRouteMutation } from './mutations.generated';
import { EmailRouteFieldsFragment } from './queries.generated';

export type NewEmailRouteModalProps = {
  visible: boolean;
  close: () => void;
};

function NewEmailRouteModal({ visible, close }: NewEmailRouteModalProps): JSX.Element {
  const [emailRoute, setEmailRoute] = useState<EmailRouteFieldsFragment>({
    __typename: 'EmailRoute',
    id: 0,
    receiver_address: '',
    forward_addresses: [],
  });
  const apolloClient = useApolloClient();
  const [createMutate] = useCreateEmailRouteMutation();
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

        <ErrorDisplay graphQLError={error as ApolloError} />
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

export default NewEmailRouteModal;
