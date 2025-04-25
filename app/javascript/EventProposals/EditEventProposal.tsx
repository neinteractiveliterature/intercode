import { Navigate, useNavigate, Link, LoaderFunction, useLoaderData, useSubmit } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay, useConfirm } from '@neinteractiveliterature/litform';

import EventProposalForm from './EventProposalForm';
import usePageTitle from '../usePageTitle';
import { EventProposalQueryData, EventProposalQueryDocument, EventProposalQueryVariables } from './queries.generated';
import { client } from '../useIntercodeApolloClient';

export const loader: LoaderFunction = async ({ params: { id } }) => {
  const { data } = await client.query<EventProposalQueryData, EventProposalQueryVariables>({
    query: EventProposalQueryDocument,
    variables: { eventProposalId: id ?? '' },
  });
  return data;
};

function EditEventProposal() {
  const data = useLoaderData() as EventProposalQueryData;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const submit = useSubmit();

  usePageTitle(
    t('general.pageTitles.editing', {
      title: data.convention.event_proposal.title,
    }),
  );

  if (data.convention.event_proposal.event) {
    return <Navigate to={`/events/${data.convention.event_proposal.event.id}/edit`} replace />;
  }

  const eventProposalId = data.convention.event_proposal.id;

  const canDelete = data.currentAbility.can_delete_event_proposal;
  const deleteButtonProps = {
    children: t('eventProposals.edit.deleteButton'),
    // eslint-disable-next-line i18next/no-literal-string
    className: 'btn btn-danger',
    onClick: () =>
      confirm({
        prompt: t('eventProposals.edit.deleteConfirmation'),
        action: () => submit(null, { action: `/event_proposals/${eventProposalId}`, method: 'DELETE' }),
        renderError: (e) => <ErrorDisplay graphQLError={e} />,
      }),
  };

  return (
    <>
      <div className="row mb-2">
        <div className="col-md-9">
          <h1>{t('navigation.events.newProposal')}</h1>
        </div>
        <div className="col-md-3">
          {canDelete && (
            <>
              <div className="d-md-none">
                <button type="button" {...deleteButtonProps} />
              </div>
              <div className="d-none d-md-block">
                <div className="text-end">
                  <button type="button" {...deleteButtonProps} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <EventProposalForm
        eventProposalId={eventProposalId}
        afterSubmit={() => navigate('/pages/new-proposal')}
        exitButton={
          <Link className="btn btn-outline-secondary me-2" to="/pages/new-proposal">
            {t('eventProposals.edit.exitButton')}
          </Link>
        }
      />
    </>
  );
}

export const Component = EditEventProposal;
