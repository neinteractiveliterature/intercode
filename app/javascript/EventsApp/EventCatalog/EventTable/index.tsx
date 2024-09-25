import { notEmpty } from '@neinteractiveliterature/litform';
import { CommonConventionDataQueryData, CommonConventionDataQueryDocument } from '../../queries.generated';
import { getFilterableFormItems } from '../../useFilterableFormItems';
import useReactTableWithTheWorks, { QueryDataContext } from '../../../Tables/useReactTableWithTheWorks';
import usePageTitle from '../../../usePageTitle';
import { FilterCodecs, buildFieldFilterCodecs } from '../../../Tables/FilterUtils';
import TableHeader from '../../../Tables/TableHeader';
import ReactTableWithTheWorks from '../../../Tables/ReactTableWithTheWorks';
import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { useNavigate } from 'react-router';
import EventCategoryCell from '../../../Tables/EventCategoryCell';
import EventCategoryFilter from '../../../Tables/EventCategoryFilter';
import { useContext, useMemo } from 'react';
import { SingleLineTimestampCell } from '../../../Tables/TimestampCell';
import CapacityCell from '../../../Tables/CapacityCell';
import { EventCatalogRunsQueryData, EventCatalogRunsQueryDocument } from './queries.generated';
import FormItemDisplay from '../../../FormPresenter/ItemDisplays/FormItemDisplay';
import DurationCell from '../../../Tables/DurationCell';
import FreeTextFilter from '../../../Tables/FreeTextFilter';
import HtmlCell from '../../../Tables/HtmlCell';
import { DateTime } from 'luxon';
import EventCatalogNavTabs from '../EventCatalogNavTabs';
import { Route } from './+types/index';

const FILTER_CODECS = buildFieldFilterCodecs({
  status: FilterCodecs.stringArray,
  category: FilterCodecs.integerArray,
});

type RunType = EventCatalogRunsQueryData['convention']['runs_paginated']['entries'][number];

function TeamMembersCell<TData, TValue extends RunType['event']['team_members']>({
  getValue,
}: CellContext<TData, TValue>) {
  return (
    <div>
      {getValue()
        .filter((teamMember) => teamMember.display_team_member)
        .map((teamMember) => teamMember.user_con_profile.name_without_nickname.trim())
        .join(', ')}
    </div>
  );
}

function RoomNamesCell<TData, TValue extends RunType['rooms']>({ getValue }: CellContext<TData, TValue>) {
  return (
    <div>
      {getValue()
        .map((room) => room.name)
        .join(', ')}
    </div>
  );
}

const defaultVisibleColumns = ['category', 'title', 'starts_at', 'length_seconds', 'total_slots'];

export const loader = async ({ context }: Route.LoaderArgs) => {
  const { data } = await context.client.query<CommonConventionDataQueryData>({
    query: CommonConventionDataQueryDocument,
  });
  const filterableFormItems = getFilterableFormItems(data.convention);
  return { convention: data.convention, filterableFormItems };
};

function EventTable({ loaderData: { convention, filterableFormItems } }: Route.ComponentProps) {
  const navigate = useNavigate();
  usePageTitle('Table View - Event Catalog');

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<RunType>();
    return [
      columnHelper.accessor('event.event_category', {
        header: 'Category',
        id: 'category',
        size: 100,
        cell: EventCategoryCell,
        enableColumnFilter: true,
        enableSorting: true,
      }),
      columnHelper.accessor('event.title', {
        header: 'Title',
        id: 'title',
        enableColumnFilter: true,
        enableSorting: true,
      }),
      columnHelper.accessor('starts_at', {
        header: 'Starts at',
        id: 'starts_at',
        size: 80,
        enableSorting: true,
        cell: SingleLineTimestampCell,
      }),
      columnHelper.accessor(
        (run) => DateTime.fromISO(run.starts_at).plus({ seconds: run.event.length_seconds }).toISO(),
        {
          header: 'Ends at',
          id: 'ends_at',
          size: 80,
          enableSorting: true,
          cell: SingleLineTimestampCell,
        },
      ),
      columnHelper.accessor('event.length_seconds', {
        header: 'Duration',
        id: 'length_seconds',
        size: 80,
        enableSorting: true,
        cell: DurationCell,
      }),
      columnHelper.accessor('rooms', {
        header: 'Rooms',
        id: 'room_names',
        cell: RoomNamesCell,
      }),
      columnHelper.accessor('event.short_blurb_html', {
        header: 'Short blurb',
        id: 'short_blurb',
        cell: HtmlCell,
      }),
      columnHelper.accessor('event.description_html', {
        header: 'Description',
        id: 'description',
        cell: HtmlCell,
      }),
      columnHelper.accessor('event.content_warnings', {
        header: 'Content warnings',
        id: 'content_warnings',
        cell: HtmlCell,
      }),
      columnHelper.accessor('event.participant_communications', {
        header: 'Participant communications',
        id: 'participant communications',
        cell: HtmlCell,
      }),
      columnHelper.accessor('event.registration_policy', {
        header: 'Capacity',
        id: 'total_slots',
        size: 80,
        cell: CapacityCell,
      }),
      columnHelper.accessor('event.team_members', {
        header: 'Team members',
        id: 'team_members',
        cell: TeamMembersCell,
      }),
      columnHelper.accessor('event.author', {
        header: 'Author(s)',
        id: 'author',
      }),
      columnHelper.accessor('event.created_at', {
        header: 'Event added at',
        id: 'event_created_at',
        cell: SingleLineTimestampCell,
      }),
      ...filterableFormItems
        .map((formItem) => {
          if (formItem.item_type === 'static_text') {
            return undefined;
          }

          function FormItemCell<TData, TValue>({ getValue }: CellContext<TData, TValue>) {
            const data = useContext(QueryDataContext) as EventCatalogRunsQueryData;
            return (
              <FormItemDisplay
                convention={data.convention}
                formItem={formItem}
                displayMode="public"
                value={getValue()}
              />
            );
          }

          return columnHelper.accessor(
            (run: RunType) =>
              JSON.parse(run.event.form_response_attrs_json_with_rendered_markdown ?? '{}')[formItem.identifier],
            {
              header: formItem.public_description ?? formItem.identifier,
              id: `form_fields[${formItem.identifier}]`,
              cell: FormItemCell,
            },
          );
        })
        .filter(notEmpty),
    ];
  }, [filterableFormItems]);

  const {
    tableHeaderProps,
    table: tableInstance,
    loading,
    queryData,
  } = useReactTableWithTheWorks({
    decodeFilterValue: FILTER_CODECS.decodeFilterValue,
    defaultVisibleColumns,
    encodeFilterValue: FILTER_CODECS.encodeFilterValue,
    getData: ({ data: tableData }) => tableData.convention.runs_paginated.entries,
    getPages: ({ data: tableData }) => tableData.convention.runs_paginated.total_pages,
    columns,
    query: EventCatalogRunsQueryDocument,
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
            table={tableInstance}
            loading={loading}
            onClickRow={(row) => navigate(`/events/${row.original.event.id}`)}
            renderFilter={({ column }) => {
              if (column.id === 'category') {
                return <EventCategoryFilter column={column} />;
              } else if (column.id === 'title') {
                return <FreeTextFilter column={column} />;
              }
            }}
          />
        </QueryDataContext.Provider>
      </div>
    </>
  );
}

export default EventTable;
