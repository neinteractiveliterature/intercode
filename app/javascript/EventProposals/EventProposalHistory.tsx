import { useMemo } from 'react';
import { LoaderFunction, useLoaderData } from 'react-router-dom';

import FormResponseChangeHistory from '../FormPresenter/ItemChangeDisplays/FormResponseChangeHistory';
import {
  EventProposalHistoryQueryData,
  EventProposalHistoryQueryDocument,
  EventProposalHistoryQueryVariables,
} from './queries.generated';
import { FormType } from '../graphqlTypes.generated';
import { client } from '../useIntercodeApolloClient';

const EXCLUDE_FIELDS = new Set([
  'minimum_age',
  'age_restrictions_description',
  'con_mail_destination',
  'email',
  'team_mailing_list_name',
]);

export const loader: LoaderFunction = async ({ params: { id } }) => {
  const { data } = await client.query<EventProposalHistoryQueryData, EventProposalHistoryQueryVariables>({
    query: EventProposalHistoryQueryDocument,
    variables: { id: id ?? '' },
  });
  return data;
};

function EventProposalHistory() {
  const data = useLoaderData() as EventProposalHistoryQueryData;
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

export const Component = EventProposalHistory;
