import { useApolloClient } from '@apollo/client';
import { Redirect, useHistory, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import ErrorDisplay from '../ErrorDisplay';
import EventProposalForm from './EventProposalForm';
import { useConfirm } from '../ModalDialogs/Confirm';
import usePageTitle from '../usePageTitle';
import { LoadQueryWrapper } from '../GraphqlLoadingWrappers';
import { useDeleteEventProposalMutation } from './mutations.generated';
import { useEventProposalQuery } from './queries.generated';

function useLoadEventProposal() {
  const eventProposalId = Number.parseInt(useParams<{ id: string }>().id, 10);
  return useEventProposalQuery({ variables: { eventProposalId } });
}

export default LoadQueryWrapper(useLoadEventProposal, function EditEventProposal({ data }) {
  const { t } = useTranslation();
  const history = useHistory();
  const [deleteProposal] = useDeleteEventProposalMutation();
  const confirm = useConfirm();
  const apolloClient = useApolloClient();

  usePageTitle(
    t('general.pageTitles.editing', 'Editing “{{ title }}”', {
      title: data.eventProposal.title,
    }),
  );

  if (data.eventProposal.event) {
    return <Redirect to={`/events/${data.eventProposal.event.id}/edit`} />;
  }

  const eventProposalId = data.eventProposal.id;

  const canDelete = data.currentAbility.can_delete_event_proposal;
  const deleteButtonProps = {
    children: t('eventProposals.edit.deleteButton', 'Delete proposal'),
    className: 'btn btn-danger',
    onClick: () =>
      confirm({
        prompt: t(
          'eventProposals.edit.deleteConfirmation',
          'Are you sure?  This will erase your proposal along with everything you’ve written here.',
        ),
        action: async () => {
          await deleteProposal({ variables: { id: eventProposalId } });
          await apolloClient.clearStore();
          history.replace('/pages/new-proposal');
        },
        renderError: (e) => <ErrorDisplay graphQLError={e} />,
      }),
  };

  return (
    <>
      <div className="row mb-2">
        <div className="col-md-9">
          <h1>{t('navigation.events.newProposal', 'Propose an Event')}</h1>
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
        afterSubmit={() => history.push('/pages/new-proposal')}
        exitButton={
          <Link className="btn btn-outline-secondary me-2" to="/pages/new-proposal">
            {t('eventProposals.edit.exitButton', 'Return to proposals page')}
          </Link>
        }
      />
    </>
  );
});
