import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { withRouter } from 'react-router-dom';
import ReactTable from 'react-table';
import { useQuery } from 'react-apollo-hooks';

import { ageAsOf } from '../../TimeUtils';
import ChoiceSetFilter from '../../Tables/ChoiceSetFilter';
import EmailCell from '../../Tables/EmailCell';
import { encodeStringArray, decodeStringArray } from '../../Tables/FilterUtils';
import { formatBucket } from './SignupUtils';
import FreeTextFilter from '../../Tables/FreeTextFilter';
import { RunSignupsTableSignupsQuery, SignupAdminEventQuery } from './queries.gql';
import SignupStateCell from '../../Tables/SignupStateCell';
import TableHeader from '../../Tables/TableHeader';
import useReactTableWithTheWorks, { QueryDataContext } from '../../Tables/useReactTableWithTheWorks';
import ErrorDisplay from '../../ErrorDisplay';
import usePageTitle from '../../usePageTitle';
import useValueUnless from '../../useValueUnless';
import UserConProfileWithGravatarCell from '../../Tables/UserConProfileWithGravatarCell';
import PageLoadingIndicator from '../../PageLoadingIndicator';

function encodeFilterValue(field, value) {
  if (field === 'state' || field === 'bucket') {
    return encodeStringArray(value);
  }

  return value;
}

function decodeFilterValue(field, value) {
  if (field === 'state' || field === 'bucket') {
    return decodeStringArray(value);
  }

  return value;
}

const STATE_OPTIONS = [
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'waitlisted', label: 'Waitlisted' },
  { value: 'withdrawn', label: 'Withdrawn' },
];

const SignupStateFilter = ({ filter, onChange }) => (
  <ChoiceSetFilter
    name="state"
    choices={STATE_OPTIONS}
    onChange={onChange}
    filter={filter}
  />
);

SignupStateFilter.propTypes = {
  filter: PropTypes.shape({
    value: PropTypes.arrayOf(PropTypes.string),
  }),
  onChange: PropTypes.func.isRequired,
};

SignupStateFilter.defaultProps = {
  filter: null,
};

const AgeRestrictionsCheckCell = ({ value }) => {
  let badgeClass = 'badge-danger';
  if (value === 'OK') {
    badgeClass = 'badge-success';
  } else if (value === 'Unknown age') {
    badgeClass = 'badge-warning';
  } else if (value === 'N/A') {
    badgeClass = 'badge-light';
  }

  return <span className={`badge ${badgeClass}`}>{value}</span>;
};

AgeRestrictionsCheckCell.propTypes = {
  value: PropTypes.string.isRequired,
};

const BucketCell = ({ original }) => {
  const data = useContext(QueryDataContext);
  return formatBucket(original, data.event);
};

BucketCell.propTypes = {
  original: PropTypes.shape({}).isRequired,
};

const BucketFilter = ({ filter, onChange }) => {
  const data = useContext(QueryDataContext);
  const choices = useMemo(
    () => (
      (data || {}).event
        ? data.event.registration_policy.buckets
          .map((bucket) => ({ label: bucket.name, value: bucket.key }))
        : []
    ),
    [data],
  );

  return (
    <ChoiceSetFilter
      name="bucket"
      choices={choices}
      onChange={onChange}
      filter={filter}
    />
  );
};

BucketFilter.propTypes = {
  filter: PropTypes.shape({
    value: PropTypes.arrayOf(PropTypes.string),
  }),
  onChange: PropTypes.func.isRequired,
};

BucketFilter.defaultProps = {
  filter: null,
};

const getPossibleColumns = () => [
  {
    Header: 'Seq',
    id: 'id',
    accessor: 'id',
    filterable: false,
    width: 65,
  },
  {
    Header: 'State',
    id: 'state',
    accessor: 'state',
    width: 130,
    Filter: SignupStateFilter,
    Cell: SignupStateCell,
  },
  {
    Header: 'Name',
    id: 'name',
    accessor: (signup) => signup.user_con_profile,
    Filter: FreeTextFilter,
    Cell: UserConProfileWithGravatarCell,
  },
  {
    Header: 'Bucket',
    id: 'bucket',
    accessor: (signup) => signup.bucket_key,
    Cell: (props) => <BucketCell {...props} />,
    Filter: BucketFilter,
  },
  {
    Header: 'Age check',
    id: 'age_restrictions_check',
    accessor: 'age_restrictions_check',
    width: 100,
    filterable: false,
    Cell: AgeRestrictionsCheckCell,
  },
  {
    Header: 'Age',
    id: 'age',
    width: 40,
    accessor: (signup) => ageAsOf(
      moment(signup.user_con_profile.birth_date),
      moment(signup.run.starts_at),
    ),
    filterable: false,
  },
  {
    Header: 'Email',
    id: 'email',
    accessor: (signup) => signup.user_con_profile.email,
    Cell: EmailCell,
    Filter: FreeTextFilter,
  },
];

function RunSignupsTable({
  defaultVisibleColumns, eventId, exportUrl, runId, runPath, history,
}) {
  const { data, loading, error } = useQuery(SignupAdminEventQuery, { variables: { eventId } });

  const [reactTableProps, { tableHeaderProps, queryData }] = useReactTableWithTheWorks({
    decodeFilterValue,
    defaultVisibleColumns,
    encodeFilterValue,
    getData: ({ data: tableData }) => tableData.event.run.signups_paginated.entries,
    getPages: ({ data: tableData }) => tableData.event.run.signups_paginated.total_pages,
    getPossibleColumns,
    history,
    query: RunSignupsTableSignupsQuery,
    storageKeyPrefix: 'adminSignups',
    variables: { eventId, runId },
  });

  usePageTitle(useValueUnless(() => `Signups - ${data.event.title}`, error || loading));

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <QueryDataContext.Provider value={queryData}>
      <div className="mb-4">
        <TableHeader {...tableHeaderProps} exportUrl={exportUrl} />
        <ReactTable
          {...reactTableProps}

          className="-striped -highlight"
          getTrProps={(state, rowInfo) => ({
            style: { cursor: 'pointer' },
            onClick: () => {
              history.push(`${runPath}/admin_signups/${rowInfo.original.id}/edit`);
            },
          })}
          getTheadFilterThProps={() => ({ className: 'text-left', style: { overflow: 'visible' } })}
        />
      </div>
    </QueryDataContext.Provider>
  );
}

RunSignupsTable.propTypes = {
  defaultVisibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  eventId: PropTypes.number.isRequired,
  exportUrl: PropTypes.string.isRequired,
  runId: PropTypes.number.isRequired,
  runPath: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(RunSignupsTable);
