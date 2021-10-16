import { useMemo } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform';

import FormResponseChangeHistory from '../FormPresenter/ItemChangeDisplays/FormResponseChangeHistory';
import { useEventProposalHistoryQuery } from './queries.generated';
import { FormType } from '../graphqlTypes.generated';

const EXCLUDE_FIELDS = new Set([
  'minimum_age',
  'age_restrictions_description',
  'con_mail_destination',
  'email',
  'team_mailing_list_name',
]);

function useEventProposalHistoryQueryFromParams() {
  const match = useRouteMatch<{ id: string }>();
  return useEventProposalHistoryQuery({
    variables: { id: match.params.id },
  });
}

export default LoadQueryWrapper(useEventProposalHistoryQueryFromParams, function EventProposalHistory({ data }) {
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
});
