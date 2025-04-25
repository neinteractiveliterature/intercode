import { useMemo } from 'react';

import FormResponseChangeHistory from '../FormPresenter/ItemChangeDisplays/FormResponseChangeHistory';
import { EventProposalHistoryQueryDocument } from './queries.generated';
import { FormType } from '../graphqlTypes.generated';
import { Route } from './+types/EventProposalHistory';
import { apolloClientContext } from 'AppContexts';

const EXCLUDE_FIELDS = new Set([
  'minimum_age',
  'age_restrictions_description',
  'con_mail_destination',
  'email',
  'team_mailing_list_name',
]);

export async function loader({ params: { id }, context }: Route.LoaderArgs) {
  const { data } = await context.get(apolloClientContext).query({
    query: EventProposalHistoryQueryDocument,
    variables: { id: id ?? '' },
  });
  return data;
}

function EventProposalHistory({ loaderData: data }: Route.ComponentProps) {
  const changes = useMemo(
    () =>
      data.convention.event_proposal.form_response_changes.filter(
        (change) => !EXCLUDE_FIELDS.has(change.field_identifier),
      ),
    [data.convention.event_proposal.form_response_changes],
  );

  const form = data.convention.event_proposal.event_category.event_proposal_form;
  const effectiveForm: NonNullable<typeof form> = form ?? {
    __typename: 'Form',
    form_sections: [],
    form_type: FormType.EventProposal,
    id: '',
    title: '',
  };

  return (
    <FormResponseChangeHistory
      changes={changes}
      convention={data.convention}
      basePath={`/admin_event_proposals/${data.convention.event_proposal.id}/history`}
      form={effectiveForm}
    />
  );
}

export default EventProposalHistory;
