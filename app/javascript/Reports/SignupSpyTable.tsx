import { Column } from 'react-table';

import useReactTableWithTheWorks, { QueryDataContext } from '../Tables/useReactTableWithTheWorks';
import RefreshButton from '../EventsApp/ScheduleGrid/RefreshButton';
import UserConProfileWithGravatarCell from '../Tables/UserConProfileWithGravatarCell';
import FreeTextFilter from '../Tables/FreeTextFilter';
import { buildFieldFilterCodecs, FilterCodecs } from '../Tables/FilterUtils';
import TimestampCell from '../Tables/TimestampCell';
import SignupChangeActionFilter from '../Tables/SignupChangeActionFilter';
import SignupChoiceCell from '../Tables/SignupChoiceCell';
import SignupChangeCell from '../Tables/SignupChangeCell';
import BucketChangeCell from '../Tables/BucketChangeCell';
import TableHeader from '../Tables/TableHeader';
import SignupChangesTableExportButton from '../Tables/SignupChangesTableExportButton';
import ReactTableWithTheWorks from '../Tables/ReactTableWithTheWorks';
import { SignupSpySignupChangesQueryData, SignupSpySignupChangesQueryDocument } from './queries.generated';

type SignupChangeType = SignupSpySignupChangesQueryData['convention']['signup_changes_paginated']['entries'][0];

const FILTER_CODECS = buildFieldFilterCodecs({
  action: FilterCodecs.stringArray,
});

const columns: Column<SignupChangeType>[] = [
  {
    Header: 'Name',
    id: 'name',
    accessor: (signupChange: SignupChangeType) => signupChange.user_con_profile,
    Cell: UserConProfileWithGravatarCell,
    Filter: FreeTextFilter,
    defaultCanFilter: true,
  },
  {
    Header: 'Event',
    id: 'event_title',
    accessor: (signupChange: SignupChangeType) => signupChange.run.event.title,
    Filter: FreeTextFilter,
    defaultCanFilter: true,
  },
  {
    Header: 'Change',
    id: 'action',
    accessor: (signupChange: SignupChangeType) => signupChange,
    Cell: ({ value }: { value: SignupChangeType }) => <SignupChangeCell value={value} />,
    Filter: SignupChangeActionFilter,
    defaultCanFilter: true,
  },
  {
    Header: 'Bucket',
    id: 'bucket_change',
    accessor: (signupChange: SignupChangeType) => signupChange,
    Cell: ({ value }: { value: SignupChangeType }) => <BucketChangeCell value={value} />,
  },
  {
    Header: 'Timestamp',
    id: 'created_at',
    accessor: 'created_at',
    width: 130,
    Cell: ({ value }: { value: SignupChangeType['created_at'] }) => <TimestampCell value={value} />,
    disableSortBy: false,
  },
  {
    Header: 'Choice',
    id: 'choice',
    width: 100,
    accessor: (signupChange: SignupChangeType) => signupChange.signup.choice,
    Cell: SignupChoiceCell,
  },
];

// eslint-disable-next-line i18next/no-literal-string
const defaultVisibleColumns = ['name', 'event_title', 'action', 'bucket_change', 'created_at', 'choice'];

const defaultState = {
  sortBy: [{ id: 'created_at', desc: true }],
};

function SignupSpyTable(): JSX.Element {
  const { columnSelectionProps, refetch, queryData, loading, tableHeaderProps, tableInstance } =
    useReactTableWithTheWorks({
      decodeFilterValue: FILTER_CODECS.decodeFilterValue,
      defaultState,
      defaultVisibleColumns,
      encodeFilterValue: FILTER_CODECS.encodeFilterValue,
      getData: ({ data }) => data.convention.signup_changes_paginated.entries,
      getPages: ({ data }) => data.convention.signup_changes_paginated.total_pages,
      getPossibleColumns: () => columns,
      query: SignupSpySignupChangesQueryDocument,
      storageKeyPrefix: 'signupSpy',
    });

  const { filters, sortBy } = tableHeaderProps;

  return (
    <QueryDataContext.Provider value={queryData ?? {}}>
      <div className="mb-4">
        <TableHeader
          {...tableHeaderProps}
          renderLeftContent={() => <RefreshButton refreshData={() => refetch()} />}
          exportButton={
            <SignupChangesTableExportButton
              exportUrl="/csv_exports/signup_changes"
              filters={filters}
              sortBy={sortBy}
              visibleColumnIds={columnSelectionProps.visibleColumnIds}
            />
          }
        />
        <ReactTableWithTheWorks tableInstance={tableInstance} loading={loading} />
      </div>
    </QueryDataContext.Provider>
  );
}

export default SignupSpyTable;
