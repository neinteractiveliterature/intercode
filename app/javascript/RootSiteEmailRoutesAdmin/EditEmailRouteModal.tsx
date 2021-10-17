import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { useApolloClient, ApolloError } from '@apollo/client';
import { useConfirm, ErrorDisplay } from '@neinteractiveliterature/litform';

import EmailRouteForm from './EmailRouteForm';
import useAsyncFunction from '../useAsyncFunction';
import buildEmailRouteInput from './buildEmailRouteInput';
import { RootSiteEmailRoutesAdminTableQueryData } from './queries.generated';
import { useDeleteEmailRouteMutation, useUpdateEmailRouteMutation } from './mutations.generated';

export type EditEmailRouteModalProps = {
  visible: boolean;
  close: () => void;
  initialEmailRoute?: RootSiteEmailRoutesAdminTableQueryData['email_routes_paginated']['entries'][0];
};

function EditEmailRouteModal({
  visible,
  close,
  initialEmailRoute,
}: EditEmailRouteModalProps): JSX.Element {
  const confirm = useConfirm();
  const [emailRoute, setEmailRoute] = useState(initialEmailRoute);
  const apolloClient = useApolloClient();

  const [updateMutate] = useUpdateEmailRouteMutation();
  const update = async () => {
    if (!initialEmailRoute || !emailRoute) {
      return;
    }

    await updateMutate({
      variables: {
        id: initialEmailRoute.id,
        emailRoute: buildEmailRouteInput(emailRoute),
      },
    });
    close();
  };
  const [updateClicked, error, inProgress] = useAsyncFunction(update);

  const [deleteMutate] = useDeleteEmailRouteMutation();
  const deleteConfirmed = async () => {
    if (!initialEmailRoute) {
      return;
    }

    await deleteMutate({ variables: { id: initialEmailRoute.id } });
    await apolloClient.resetStore();
    close();
  };

  useEffect(() => {
    setEmailRoute(initialEmailRoute);
  }, [initialEmailRoute]);

  return (
    <Modal visible={visible} dialogClassName="modal-lg">
      <div className="modal-header">
        <div className="flex-grow-1">Edit email route</div>
        <button
          className="btn btn-sm btn-outline-danger"
          type="button"
          onClick={() =>
            confirm({
              prompt: `Are you sure you want to delete the email route for ${initialEmailRoute?.receiver_address}?`,
              action: deleteConfirmed,
              renderError: (e) => <ErrorDisplay graphQLError={e} />,
            })
          }
        >
          <i className="bi-trash" /> Delete route
        </button>
      </div>

      <div className="modal-body">
        {emailRoute && <EmailRouteForm emailRoute={emailRoute} onChange={setEmailRoute} />}

        <ErrorDisplay graphQLError={error as ApolloError} />
      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" type="button" onClick={close} disabled={inProgress}>
          Cancel
        </button>

        <button
          className="btn btn-primary"
          type="button"
          onClick={updateClicked}
          disabled={inProgress}
        >
          Update email route
        </button>
      </div>
    </Modal>
  );
}

export default EditEmailRouteModal;
