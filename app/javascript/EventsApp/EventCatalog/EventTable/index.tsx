import { LoadQueryWrapper, notEmpty } from '@neinteractiveliterature/litform';
import { CommonConventionDataQueryData, useCommonConventionDataQuery } from '../../queries.generated';
import useFilterableFormItems from '../../useFilterableFormItems';
import { TypedFormItem } from '../../../FormAdmin/FormItemUtils';
import useReactTableWithTheWorks, { QueryDataContext } from '../../../Tables/useReactTableWithTheWorks';
import usePageTitle from '../../../usePageTitle';
import { FilterCodecs, buildFieldFilterCodecs } from '../../../Tables/FilterUtils';
import TableHeader from '../../../Tables/TableHeader';
import ReactTableWithTheWorks from '../../../Tables/ReactTableWithTheWorks';
import { useNavigate } from 'react-router';
import { Column } from 'react-table';
import EventCategoryCell from '../../../Tables/EventCategoryCell';
import EventCategoryFilter from '../../../Tables/EventCategoryFilter';
import { useContext, useMemo } from 'react';
import { SingleLineTimestampCell } from '../../../Tables/TimestampCell';
import CapacityCell from '../../../Tables/CapacityCell';
import { EventCatalogRunsQueryData, useEventCatalogRunsQuery } from './queries.generated';
import FormItemDisplay from '../../../FormPresenter/ItemDisplays/FormItemDisplay';
import DurationCell from '../../../Tables/DurationCell';
import FreeTextFilter from '../../../Tables/FreeTextFilter';
import HtmlCell from '../../../Tables/HtmlCell';
import { DateTime } from 'luxon';
import EventCatalogNavTabs from '../EventCatalogNavTabs';

const FILTER_CODECS = buildFieldFilterCodecs({
  status: FilterCodecs.stringArray,
  category: FilterCodecs.integerArray,
});

function TeamMembersCell({ value }: { value: RunType['event']['team_members'] }) {
  return (
    <div>
      {value
        .filter((teamMember) => teamMember.display_team_member)
        .map((teamMember) => teamMember.user_con_profile.name_without_nickname.trim())
        .join(', ')}
    </div>
  );
}

type RunType = EventCatalogRunsQueryData['convention']['runs_paginated']['entries'][number];

function getPossibleColumns(filterableFormItems: TypedFormItem[]): Column<RunType>[] {
  return [
    {
      Header: 'Category',
      id: 'category',
      accessor: (run) => run.event.event_category,
      width: 100,
      Cell: EventCategoryCell,
      Filter: EventCategoryFilter,
      disableFilters: false,
      disableSortBy: false,
    },
    {
      Header: 'Title',
      id: 'title',
      accessor: (run) => run.event.title,
      Filter: FreeTextFilter,
      disableFilters: false,
      disableSortBy: false,
    },
    {
      Header: 'Starts at',
      id: 'starts_at',
      accessor: (run) => run.starts_at,
      width: 80,
      disableSortBy: false,
      Cell: SingleLineTimestampCell,
    },
    {
      Header: 'Ends at',
      id: 'ends_at',
      accessor: (run) => DateTime.fromISO(run.starts_at).plus({ seconds: run.event.length_seconds }).toISO(),
      width: 80,
      disableSortBy: false,
      Cell: SingleLineTimestampCell,
    },
    {
      Header: 'Duration',
      id: 'length_seconds',
      accessor: (run) => run.event.length_seconds,
      width: 80,
      disableSortBy: false,
      Cell: DurationCell,
    },
    {
      Header: 'Short blurb',
      id: 'short_blurb',
      accessor: (run) => run.event.short_blurb_html,
      Cell: HtmlCell,
    },
    {
      Header: 'Description',
      id: 'description',
      accessor: (run) => run.event.description_html,
      Cell: HtmlCell,
    },
    {
      Header: 'Content warnings',
      id: 'content_warnings',
      accessor: (run) => run.event.content_warnings,
      Cell: HtmlCell,
    },
    {
      Header: 'Participant communications',
      id: 'participant communications',
      accessor: (run) => run.event.participant_communications,
      Cell: HtmlCell,
    },
    {
      Header: 'Capacity',
      id: 'total_slots',
      width: 80,
      accessor: (run) => run.event.registration_policy,
      Cell: CapacityCell,
    },
    {
      Header: 'Team members',
      id: 'team_members',
      accessor: (run) => run.event.team_members,
      Cell: TeamMembersCell,
    },
    {
      Header: 'Author(s)',
      id: 'author',
      accessor: (run) => run.event.author,
    },
    {
      Header: 'Event added at',
      id: 'event_created_at',
      accessor: (run) => run.event.created_at,
      Cell: SingleLineTimestampCell,
    },
    ...filterableFormItems
      .map((formItem) => {
        if (formItem.item_type === 'static_text') {
          return undefined;
        }

        return {
          Header: formItem.public_description ?? formItem.identifier,
          id: `form_fields[${formItem.identifier}]`,
          accessor: (run: RunType) =>
            JSON.parse(run.event.form_response_attrs_json_with_rendered_markdown ?? '{}')[formItem.identifier],
          Cell: ({ value }: { value: unknown }) => {
            const data = useContext(QueryDataContext) as EventCatalogRunsQueryData;
            return (
              <FormItemDisplay convention={data.convention} formItem={formItem} displayMode="public" value={value} />
            );
          },
        };
      })
      .filter(notEmpty),
  ];
}

const defaultVisibleColumns = ['category', 'title', 'starts_at', 'length_seconds', 'total_slots'];

type EventTableProps = {
  convention: CommonConventionDataQueryData['convention'];
  filterableFormItems: TypedFormItem[];
};

function EventTable({ convention, filterableFormItems }: EventTableProps) {
  const navigate = useNavigate();
  usePageTitle('Table View - Event Catalog');

  const { tableHeaderProps, tableInstance, loading, queryData } = useReactTableWithTheWorks({
    decodeFilterValue: FILTER_CODECS.decodeFilterValue,
    defaultVisibleColumns,
    encodeFilterValue: FILTER_CODECS.encodeFilterValue,
    getData: ({ data: tableData }) => tableData.convention.runs_paginated.entries,
    getPages: ({ data: tableData }) => tableData.convention.runs_paginated.total_pages,
    getPossibleColumns: () => getPossibleColumns(filterableFormItems),
    useQuery: useEventCatalogRunsQuery,
    storageKeyPrefix: 'eventTable',
  });

  const mergedQueryData = useMemo(() => ({ ...queryData, convention }), [queryData, convention]);

  return (
    <>
      <h1>Event Catalog</h1>
      <EventCatalogNavTabs />
      <div className="mb-4">
        <TableHeader {...tableHeaderProps} exportUrl="/csv_exports/runs" />

        <QueryDataContext.Provider value={mergedQueryData}>
          <ReactTableWithTheWorks
            tableInstance={tableInstance}
            loading={loading}
            onClickRow={(row) => navigate(`/events/${row.original.id}`)}
          />
        </QueryDataContext.Provider>
      </div>
    </>
  );
}

const EventTableWrapper = LoadQueryWrapper(useCommonConventionDataQuery, ({ data }) => {
  const filterableFormItems = useFilterableFormItems(data.convention);
  return <EventTable convention={data.convention} filterableFormItems={filterableFormItems} />;
});

export default EventTableWrapper;
