import { useTranslation } from 'react-i18next';
import { useLoaderData, useNavigate } from 'react-router';
import { Link } from 'react-router';
import usePageTitle from '../usePageTitle';
import EventProposalForm from './EventProposalForm';
import { EventProposalQueryDocument } from './queries.generated';
import { apolloClientContext } from 'AppContexts';
import type { Route } from './+types/AdminEditEventProposal';

export const clientLoader = async ({ params: { id }, context }: Route.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({
    query: EventProposalQueryDocument,
    variables: { eventProposalId: id ?? '' },
    errorPolicy: 'none',
  });
  return data;
};

function AdminEditEventProposal() {
  const data = useLoaderData<typeof clientLoader>();
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
