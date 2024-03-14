import { LoadQueryWrapper } from "@neinteractiveliterature/litform";
import { CommonConventionDataQueryData, useCommonConventionDataQuery } from "../../queries.generated";
import useFilterableFormItems from "../../useFilterableFormItems";
import { TypedFormItem } from "../../../FormAdmin/FormItemUtils";
import useReactTableWithTheWorks, { QueryDataContext } from "../../../Tables/useReactTableWithTheWorks";
import usePageTitle from "../../../usePageTitle";
import { FilterCodecs, buildFieldFilterCodecs } from "../../../Tables/FilterUtils";
import { EventListEventsQueryData, useEventListEventsQuery } from "../EventList/queries.generated";
import TableHeader from "../../../Tables/TableHeader";
import ReactTableWithTheWorks from "../../../Tables/ReactTableWithTheWorks";
import { useNavigate } from "react-router";
import { Column } from "react-table";
import EventCategoryCell from "../../../Tables/EventCategoryCell";
import EventCategoryFilter from "../../../Tables/EventCategoryFilter";
import FreeTextFilter from "../../../Tables/FreeTextFilter";
import DurationCell from "../../../Tables/DurationCell";
import { useMemo } from "react";
import TimestampCell, { SingleLineTimestampCell } from "../../../Tables/TimestampCell";
import CapacityCell from "../../../Tables/CapacityCell";

const FILTER_CODECS = buildFieldFilterCodecs({
  status: FilterCodecs.stringArray,
  event_category: FilterCodecs.integerArray,
});

type EventType = EventListEventsQueryData['convention']['events_paginated']['entries'][number];

function getPossibleColumns(): Column<EventType>[] {
  return [
    {
      Header: 'Category',
      id: 'event_category',
      accessor: 'event_category',
      width: 100,
      Cell: EventCategoryCell,
      Filter: EventCategoryFilter,
      disableFilters: false,
      disableSortBy: false,
    },
    {
      Header: 'Title',
      id: 'title',
      accessor: 'title',
      Filter: FreeTextFilter,
      disableFilters: false,
      disableSortBy: false,
    },
    {
      Header: 'Duration',
      id: 'length_seconds',
      accessor: 'length_seconds',
      width: 80,
      disableSortBy: false,
      Cell: DurationCell,
    },
    {
      Header: 'Capacity',
      id: 'total_slots',
      width: 80,
      accessor: 'registration_policy',
      Cell: CapacityCell,
    },
    {
      Header: 'Date added',
      id: 'created_at',
      accessor: 'created_at',
      Cell: SingleLineTimestampCell
    }
  ];
}

const defaultVisibleColumns = [
  'event_category',
  'title',
  'length_seconds',
  'total_slots',
];

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
    getData: ({ data: tableData }) => tableData.convention.events_paginated.entries,
    getPages: ({ data: tableData }) => tableData.convention.events_paginated.total_pages,
    getPossibleColumns,
    useQuery: useEventListEventsQuery,
    storageKeyPrefix: 'eventTable',
  });

  const mergedQueryData = useMemo(() => ({ ...queryData, convention }), [queryData, convention]);

  return <>
  <h1 className="mb-4">Event Catalog</h1>
    <div className="mb-4">
      <TableHeader {...tableHeaderProps} exportUrl="/csv_exports/events" />

      <QueryDataContext.Provider value={mergedQueryData}>
        <ReactTableWithTheWorks
          tableInstance={tableInstance}
          loading={loading}
          onClickRow={(row) => navigate(`/events/${row.original.id}`)}
        />
      </QueryDataContext.Provider>
    </div>
  </>;
}

const EventTableWrapper = LoadQueryWrapper(useCommonConventionDataQuery, ({ data }) => {
  const filterableFormItems = useFilterableFormItems(data.convention);
  return <EventTable convention={data.convention} filterableFormItems={filterableFormItems} />;
});

export default EventTableWrapper;
