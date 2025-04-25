import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Link } from 'react-router';
import usePageTitle from '../usePageTitle';
import EventProposalForm from './EventProposalForm';
import { EventProposalQueryDocument } from './queries.generated';
import { Route } from './+types/AdminEditEventProposal';
import { apolloClientContext } from 'AppContexts';

export async function loader({ params: { id }, context }: Route.LoaderArgs) {
  const { data } = await context.get(apolloClientContext).query({
    query: EventProposalQueryDocument,
    variables: { eventProposalId: id ?? '' },
  });
  return data;
}

function AdminEditEventProposal({ loaderData: data }: Route.ComponentProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  usePageTitle(
    t('general.pageTitles.editing', {
      title: data?.convention.event_proposal.title,
    }),
  );

  return (
    <EventProposalForm
      eventProposalId={data.convention.event_proposal.id}
      afterSubmit={() => {
        navigate(`/admin_event_proposals/${data.convention.event_proposal.id}`);
      }}
      exitButton={
        <Link
          className="btn btn-outline-secondary me-2"
          to={`/admin_event_proposals/${data.convention.event_proposal.id}`}
        >
          {t('admin.eventProposals.edit.exitButton')}
        </Link>
      }
    />
  );
}

export default AdminEditEventProposal;
