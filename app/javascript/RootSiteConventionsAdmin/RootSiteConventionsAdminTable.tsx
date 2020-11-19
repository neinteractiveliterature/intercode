import { useMemo, useContext } from 'react';
import { Column } from 'react-table';
import { useHistory } from 'react-router-dom';
import { getYear, getMonth, getDate, isAfter } from 'date-fns';
import { utcToZonedTime, format } from 'date-fns-tz';

import AppRootContext from '../AppRootContext';
import useReactTableWithTheWorks from '../Tables/useReactTableWithTheWorks';
import ReactTableWithTheWorks from '../Tables/ReactTableWithTheWorks';
import { buildFieldFilterCodecs } from '../Tables/FilterUtils';
import FreeTextFilter from '../Tables/FreeTextFilter';
import { timespanFromConvention } from '../TimespanUtils';
import TableHeader from '../Tables/TableHeader';
import usePageTitle from '../usePageTitle';
import useModal from '../ModalDialogs/useModal';
import NewConventionModal from './NewConventionModal';
import {
  RootSiteConventionsAdminTableQueryQuery,
  useRootSiteConventionsAdminTableQueryQuery,
} from './queries.generated';

type ConventionType = RootSiteConventionsAdminTableQueryQuery['conventions_paginated']['entries'][0];

const { encodeFilterValue, decodeFilterValue } = buildFieldFilterCodecs({});

function ConventionDatesCell({ value }: { value: ConventionType }) {
  const { dateFnsLocale } = useContext(AppRootContext);
  const timespan = useMemo(() => timespanFromConvention(value), [value]);

  const datesDescription = useMemo(() => {
    if (timespan.isFinite()) {
      const localStart = utcToZonedTime(timespan.start, timespan.timezone);
      const localFinish = utcToZonedTime(timespan.finish, timespan.timezone);
      const sameYear = getYear(localStart) === getYear(localFinish);
      const sameMonth = sameYear && getMonth(localStart) === getMonth(localFinish);
      const sameDay = sameMonth && getDate(localStart) === getDate(localFinish);
      const formatOptions = { locale: dateFnsLocale, timeZone: timespan.timezone };

      if (sameDay) {
        return format(timespan.start, 'PP', formatOptions);
      }

      const startFormat = sameYear ? 'MMMM d' : 'PP';
      const finishFormat = sameMonth ? 'd, yyyy' : 'PP';
      return `${format(timespan.start, startFormat, formatOptions)} - ${format(
        timespan.finish,
        finishFormat,
        formatOptions,
      )}`;
    }

    return timespan.humanize('PP', 'PP');
  }, [timespan, dateFnsLocale]);

  const now = new Date();

  if (timespan.includesTime(now)) {
    return (
      <>
        <i className="fa fa-circle" aria-label="Ongoing convention" />{' '}
        <strong>{datesDescription}</strong>
      </>
    );
  }

  if (timespan.isFinite() && isAfter(timespan.start, now)) {
    return (
      <>
        <i className="fa fa-arrow-circle-right" aria-label="Future convention" /> {datesDescription}
      </>
    );
  }

  return (
    <span className="text-secondary">
      <i className="fa fa-arrow-circle-left" aria-label="Past convention" /> {datesDescription}
    </span>
  );
}

function getPossibleColumns(): Column<ConventionType>[] {
  return [
    {
      Header: 'Name',
      id: 'name',
      accessor: 'name',
      Filter: FreeTextFilter,
      disableFilters: false,
      disableSortBy: false,
    },
    {
      Header: 'Organization name',
      id: 'organization_name',
      accessor: (convention: ConventionType) => convention.organization?.name,
      Filter: FreeTextFilter,
      disableFilters: false,
      disableSortBy: false,
    },
    {
      Header: 'Dates',
      id: 'starts_at',
      accessor: (convention: ConventionType) => convention,
      Cell: ConventionDatesCell,
      disableSortBy: false,
    },
  ];
}

const defaultVisibleColumns = ['name', 'organization_name', 'starts_at'];

function RootSiteConventionsAdminTable() {
  const newConventionModal = useModal();
  const history = useHistory();
  const { tableInstance, loading, tableHeaderProps } = useReactTableWithTheWorks({
    decodeFilterValue,
    defaultVisibleColumns,
    encodeFilterValue,
    getData: ({ data }) => data.conventions_paginated.entries,
    getPages: ({ data }) => data.conventions_paginated.total_pages,
    getPossibleColumns,
    storageKeyPrefix: 'conventions',
    useQuery: useRootSiteConventionsAdminTableQueryQuery,
  });
  usePageTitle('Conventions');

  return (
    <div className="mb-4">
      <h1 className="mb-4">Conventions</h1>

      <TableHeader
        {...tableHeaderProps}
        renderLeftContent={() => (
          <>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={newConventionModal.open}
            >
              New convention
            </button>
          </>
        )}
      />

      <ReactTableWithTheWorks
        tableInstance={tableInstance}
        loading={loading}
        onClickRow={(row) => history.push(`/conventions/${row.original.id}`)}
      />

      <NewConventionModal visible={newConventionModal.visible} close={newConventionModal.close} />
    </div>
  );
}

export default RootSiteConventionsAdminTable;
