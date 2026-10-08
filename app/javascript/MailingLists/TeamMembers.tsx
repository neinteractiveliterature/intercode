import { useMemo } from 'react';
import { FormGroupWithLabel } from '@neinteractiveliterature/litform';
import Select from 'react-select';
import { LoaderFunction, RouterContextProvider, useLoaderData, useSearchParams } from 'react-router';

import TabbedMailingList from './TabbedMailingList';
import usePageTitle from '../usePageTitle';
import { TeamMembersMailingListQueryData, TeamMembersMailingListQueryDocument } from './queries.generated';
import { apolloClientContext } from '../AppContexts';

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
  const selectedCategories = useMemo(
    () => data.convention.event_categories.filter((category) => selectedCategoryIds.includes(category.id)),
    [data.convention.event_categories, selectedCategoryIds],
  );

  return (
    <>
      <h1 className="mb-4">Mail to all event team members</h1>

      <div className="mb-4">
        <FormGroupWithLabel label="Limit to events in these categories">
          {(id) => (
            <Select
              inputId={id}
              isMulti
              options={data.convention.event_categories}
              value={selectedCategories}
              getOptionValue={(category) => category.id}
              getOptionLabel={(category) => category.name}
              placeholder="All event categories"
              onChange={(categories) =>
                setSearchParams({ [EVENT_CATEGORY_PARAM]: categories.map((category) => category.id) })
              }
              styles={{ menu: (provided) => ({ ...provided, zIndex: 25 }) }}
            />
          )}
        </FormGroupWithLabel>
      </div>

      <TabbedMailingList
        emails={data.convention.mailing_lists.team_members.emails}
        metadataFields={data.convention.mailing_lists.team_members.metadata_fields}
        csvFilename={`Event team members - ${data.convention.name}.csv`}
      />
    </>
  );
}

export const Component = TeamMembers;
