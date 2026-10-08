import { useMemo } from 'react';
import { ChoiceSet } from '@neinteractiveliterature/litform';
import { LoaderFunction, RouterContextProvider, useLoaderData, useSearchParams } from 'react-router';

import TabbedMailingList from './TabbedMailingList';
import usePageTitle from '../usePageTitle';
import { TeamMembersMailingListQueryData, TeamMembersMailingListQueryDocument } from './queries.generated';
import { apolloClientContext } from '../AppContexts';
import humanize from '../humanize';

const EVENT_CATEGORY_PARAM = 'event_category';

export const loader: LoaderFunction<RouterContextProvider> = async ({ context, request }) => {
  const client = context.get(apolloClientContext);
  const eventCategoryIds = new URL(request.url).searchParams.getAll(EVENT_CATEGORY_PARAM);
  const { data } = await client.query<TeamMembersMailingListQueryData>({
    query: TeamMembersMailingListQueryDocument,
    variables: { eventCategoryIds: eventCategoryIds.length > 0 ? eventCategoryIds : undefined },
  });
  return data;
};

function TeamMembers() {
  const data = useLoaderData() as TeamMembersMailingListQueryData;
  const [searchParams, setSearchParams] = useSearchParams();
  usePageTitle('Event team members');

  const selectedCategoryIds = searchParams.getAll(EVENT_CATEGORY_PARAM);
  const categoryChoices = useMemo(
    () => data.convention.event_categories.map((category) => ({ label: humanize(category.name), value: category.id })),
    [data.convention.event_categories],
  );

  return (
    <>
      <h1 className="mb-4">Mail to all event team members</h1>

      <fieldset className="mb-4">
        <legend className="col-form-label p-0">Limit to events in these categories</legend>
        <small className="text-muted">Leave all unchecked to include every category.</small>
        <ChoiceSet
          choices={categoryChoices}
          value={selectedCategoryIds}
          onChange={(categoryIds: string[]) => setSearchParams({ [EVENT_CATEGORY_PARAM]: categoryIds })}
          multiple
        />
      </fieldset>

      <TabbedMailingList
        emails={data.convention.mailing_lists.team_members.emails}
        metadataFields={data.convention.mailing_lists.team_members.metadata_fields}
        csvFilename={`Event team members - ${data.convention.name}.csv`}
      />
    </>
  );
}

export const Component = TeamMembers;
