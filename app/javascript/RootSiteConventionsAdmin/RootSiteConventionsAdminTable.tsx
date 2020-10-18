import React, { useMemo } from 'react';
import ReactTable, { RowInfo } from 'react-table';
import { useHistory } from 'react-router-dom';
import moment from 'moment-timezone';

import useReactTableWithTheWorks from '../Tables/useReactTableWithTheWorks';
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
  const timespan = useMemo(() => timespanFromConvention(value), [value]);

  const datesDescription = useMemo(() => {
    if (timespan.isFinite()) {
      const sameYear = timespan.start.year() === timespan.finish.year();
      const sameMonth = sameYear && timespan.start.month() === timespan.finish.month();
      const sameDay = sameMonth && timespan.start.day() === timespan.finish.day();

      if (sameDay) {
        return timespan.start.format('MMMM D, YYYY');
      }

      const startFormat = sameYear ? 'MMMM D' : 'MMMM D, YYYY';
      const finishFormat = sameMonth ? 'D, YYYY' : 'MMMM D, YYYY';
      return `${timespan.start.format(startFormat)} - ${timespan.finish.format(finishFormat)}`;
    }

    return timespan.humanizeInTimezone(
      value.timezone_name ?? 'Etc/UTC',
      'MMMM D, YYYY',
      'MMMM D, YYYY',
    );
  }, [timespan, value.timezone_name]);

  const now = moment();

  if (timespan.includesTime(now)) {
    return (
      <>
        <i className="fa fa-circle" aria-label="Ongoing convention" />{' '}
        <strong>{datesDescription}</strong>
      </>
    );
  }

  if (timespan.isFinite() && timespan.start.isAfter(now)) {
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

const getPossibleColumns = () => [
  {
    Header: 'Name',
    id: 'name',
    accessor: 'name',
    Filter: FreeTextFilter,
  },
  {
    Header: 'Organization name',
    id: 'organization_name',
    accessor: (convention: ConventionType) => convention.organization?.name,
    Filter: FreeTextFilter,
  },
  {
    Header: 'Dates',
    id: 'starts_at',
    accessor: (convention: ConventionType) => convention,
    Cell: ConventionDatesCell,
    filterable: false,
  },
];

function RootSiteConventionsAdminTable() {
  const newConventionModal = useModal();
  const history = useHistory();
  const [reactTableProps, { tableHeaderProps }] = useReactTableWithTheWorks({
    decodeFilterValue,
    defaultVisibleColumns: ['name', 'organization_name', 'starts_at'],
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

      <ReactTable
        {...reactTableProps}
        className="-striped -highlight"
        getTrProps={(state: any, rowInfo: RowInfo) => ({
          style: { cursor: 'pointer' },
          onClick: () => {
            history.push(`/conventions/${rowInfo.original.id}`);
          },
        })}
        getTheadFilterThProps={() => ({ className: 'text-left', style: { overflow: 'visible' } })}
      />

      <NewConventionModal visible={newConventionModal.visible} close={newConventionModal.close} />
    </div>
  );
}

export default RootSiteConventionsAdminTable;
