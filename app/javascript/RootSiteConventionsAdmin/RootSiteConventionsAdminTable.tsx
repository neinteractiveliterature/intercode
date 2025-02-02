import { useMemo } from 'react';
import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

import useReactTableWithTheWorks from 'Tables/useReactTableWithTheWorks';
import ReactTableWithTheWorks from 'Tables/ReactTableWithTheWorks';
import { buildFieldFilterCodecs } from 'Tables/FilterUtils';
import FreeTextFilter from 'Tables/FreeTextFilter';
import { describeTimespan, timespanFromConvention } from 'TimespanUtils';
import TableHeader from 'Tables/TableHeader';
import usePageTitle from 'usePageTitle';
import {
  RootSiteConventionsAdminTableQueryData,
  RootSiteConventionsAdminTableQueryDocument,
} from './queries.generated';
import { getDateTimeFormat } from 'TimeUtils';

type ConventionType = RootSiteConventionsAdminTableQueryData['conventions_paginated']['entries'][0];

const { encodeFilterValue, decodeFilterValue } = buildFieldFilterCodecs({});

function ConventionDatesCell({ row }: CellContext<ConventionType, unknown>) {
  const value = row.original;
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

    return describeTimespan(timespan, t, 'longDate', value.timezone_name ?? 'Etc/UTC');
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

const defaultVisibleColumns = ['name', 'organization_name', 'starts_at'];

function RootSiteConventionsAdminTable(): JSX.Element {
  const navigate = useNavigate();

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<ConventionType>();
    return [
      columnHelper.accessor('name', {
        header: 'Name',
        id: 'name',
        enableColumnFilter: true,
        enableSorting: true,
      }),
      columnHelper.accessor('organization.name', {
        header: 'Organization name',
        id: 'organization_name',
        enableColumnFilter: true,
        enableSorting: true,
      }),
      columnHelper.accessor((row) => row, {
        header: 'Dates',
        id: 'starts_at',
        cell: ConventionDatesCell,
        enableSorting: true,
      }),
    ];
  }, []);

  const {
    table: tableInstance,
    loading,
    tableHeaderProps,
  } = useReactTableWithTheWorks({
    decodeFilterValue,
    defaultVisibleColumns,
    encodeFilterValue,
    getData: ({ data }) => data.conventions_paginated.entries,
    getPages: ({ data }) => data.conventions_paginated.total_pages,
    columns,
    storageKeyPrefix: 'conventions',
    query: RootSiteConventionsAdminTableQueryDocument,
  });
  usePageTitle('Conventions');

  return (
    <div className="mb-4">
      <h1 className="mb-4">Conventions</h1>

      <TableHeader
        {...tableHeaderProps}
        renderLeftContent={() => (
          <>
            <Link to="./new" className="btn btn-outline-primary">
              New convention
            </Link>
          </>
        )}
      />

      <ReactTableWithTheWorks
        table={tableInstance}
        loading={loading}
        onClickRow={(row) => navigate(`/conventions/${row.original.id}`)}
        renderFilter={({ column }) => {
          if (column.id === 'name' || column.id === 'organization_name') {
            return <FreeTextFilter column={column} />;
          }
        }}
      />

      <Outlet />
    </div>
  );
}

export const Component = RootSiteConventionsAdminTable;
