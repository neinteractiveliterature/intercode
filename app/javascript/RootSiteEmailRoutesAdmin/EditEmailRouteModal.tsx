import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { ApolloError } from '@apollo/client';
import { useConfirm, ErrorDisplay } from '@neinteractiveliterature/litform';

import EmailRouteForm from './EmailRouteForm';
import buildEmailRouteInput from './buildEmailRouteInput';
import { RootSiteSingleEmailRouteQueryData, RootSiteSingleEmailRouteQueryDocument } from './queries.generated';
import { redirect, useLoaderData } from 'react-router';
import { DeleteEmailRouteDocument, UpdateEmailRouteDocument } from './mutations.generated';
import { EmailRouteInput } from 'graphqlTypes.generated';
import { Link, useFetcher } from 'react-router';
import { Route } from './+types/EditEmailRouteModal';

export async function action({ params: { id }, request, context }: Route.ActionArgs) {
  try {
    if (request.method === 'DELETE') {
      await context.client.mutate({
        mutation: DeleteEmailRouteDocument,
        variables: { id },
      });
      await context.client.resetStore();
      return redirect('..');
    } else if (request.method === 'PATCH') {
      const emailRoute = (await request.json()) as EmailRouteInput;
      await context.client.mutate({
        mutation: UpdateEmailRouteDocument,
        variables: { id, emailRoute },
      });
      return redirect('..');
    } else {
      throw new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
}

export async function loader({ params: { id }, context }: Route.LoaderArgs) {
  const { data } = await context.client.query({ query: RootSiteSingleEmailRouteQueryDocument, variables: { id } });
  return data;
}

function EditEmailRouteModal(): JSX.Element {
  const data = useLoaderData() as RootSiteSingleEmailRouteQueryData;
  const initialEmailRoute = data.email_route;
  const confirm = useConfirm();
  const [emailRoute, setEmailRoute] = useState(initialEmailRoute);
  const fetcher = useFetcher();
  const error = fetcher.data instanceof Error ? fetcher.data : undefined;
  const inProgress = fetcher.state !== 'idle';

  const updateClicked = () => {
    fetcher.submit(buildEmailRouteInput(emailRoute), { method: 'PATCH', encType: 'application/json' });
  };

  const deleteConfirmed = () => {
    fetcher.submit({}, { method: 'DELETE' });
  };

  useEffect(() => {
    setEmailRoute(initialEmailRoute);
  }, [initialEmailRoute]);

  return (
    <Modal visible dialogClassName="modal-lg">
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
        <Link to=".." className="btn btn-secondary">
          Cancel
        </Link>

        <button className="btn btn-primary" type="button" onClick={updateClicked} disabled={inProgress}>
          Update email route
        </button>
      </div>
    </Modal>
  );
}

export default EditEmailRouteModal;
