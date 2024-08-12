import { useMemo } from 'react';
import { Column } from 'react-table';
import { useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { useModal } from '@neinteractiveliterature/litform';

import useReactTableWithTheWorks from '../Tables/useReactTableWithTheWorks';
import ReactTableWithTheWorks from '../Tables/ReactTableWithTheWorks';
import { buildFieldFilterCodecs } from '../Tables/FilterUtils';
import FreeTextFilter from '../Tables/FreeTextFilter';
import { timespanFromConvention } from '../TimespanUtils';
import TableHeader from '../Tables/TableHeader';
import usePageTitle from '../usePageTitle';
import NewConventionModal from './NewConventionModal';
import { RootSiteConventionsAdminTableQueryData, useRootSiteConventionsAdminTableQuery } from './queries.generated';
import { getDateTimeFormat } from '../TimeUtils';

type ConventionType = RootSiteConventionsAdminTableQueryData['conventions_paginated']['entries'][0];

const { encodeFilterValue, decodeFilterValue } = buildFieldFilterCodecs({});

function ConventionDatesCell({ value }: { value: ConventionType }) {
  const { t } = useTranslation();
  const timespan = useMemo(() => timespanFromConvention(value), [value]);

  const datesDescription = useMemo(() => {
    if (timespan.isFinite()) {
      const sameYear = timespan.start.year === timespan.finish.year;
      const sameMonth = sameYear && timespan.start.month === timespan.finish.month;
      const sameDay = sameMonth && timespan.start.day === timespan.finish.day;

      if (sameDay) {
        return timespan.start.toFormat(getDateTimeFormat('longDate', t));
      }

      const startFormat = getDateTimeFormat(sameYear ? 'longMonthDay' : 'longDate', t);
      const finishFormat = getDateTimeFormat(sameMonth ? 'longDayYear' : 'longDate', t);
      return `${timespan.start.toFormat(startFormat)} - ${timespan.finish.toFormat(finishFormat)}`;
    }

    return timespan.humanizeInTimezone(value.timezone_name ?? 'Etc/UTC', t, 'longDate', 'longDate');
  }, [timespan, value.timezone_name, t]);

  const now = DateTime.local();

  if (timespan.includesTime(now)) {
    return (
      <>
        <i className="bi-circle" aria-label="Ongoing convention" /> <strong>{datesDescription}</strong>
      </>
    );
  }

  if (timespan.isFinite() && timespan.start > now) {
    return (
      <>
        <i className="bi-arrow-right-circle-fill" aria-label="Future convention" /> {datesDescription}
      </>
    );
  }

  return (
    <span className="text-secondary">
      <i className="bi-arrow-left-circle-fill" aria-label="Past convention" /> {datesDescription}
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

function RootSiteConventionsAdminTable(): JSX.Element {
  const newConventionModal = useModal();
  const navigate = useNavigate();
  const { tableInstance, loading, tableHeaderProps } = useReactTableWithTheWorks({
    decodeFilterValue,
    defaultVisibleColumns,
    encodeFilterValue,
    getData: ({ data }) => data.conventions_paginated.entries,
    getPages: ({ data }) => data.conventions_paginated.total_pages,
    getPossibleColumns,
    storageKeyPrefix: 'conventions',
    useQuery: useRootSiteConventionsAdminTableQuery,
  });
  usePageTitle('Conventions');

  return (
    <div className="mb-4">
      <h1 className="mb-4">Conventions</h1>

      <TableHeader
        {...tableHeaderProps}
        renderLeftContent={() => (
          <>
            <button type="button" className="btn btn-outline-primary" onClick={newConventionModal.open}>
              New convention
            </button>
          </>
        )}
      />

      <ReactTableWithTheWorks
        tableInstance={tableInstance}
        loading={loading}
        onClickRow={(row) => navigate(`/conventions/${row.original.id}`)}
      />

      <NewConventionModal visible={newConventionModal.visible} close={newConventionModal.close} />
    </div>
  );
}

export const Component = RootSiteConventionsAdminTable;
