import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import ReactTable from 'react-table';
import { useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
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

const SignupStateFilter = ({ filter, onChange }) => {
  const { t } = useTranslation();
  return (
    <ChoiceSetFilter
      name="state"
      choices={[
        { value: 'confirmed', label: t('signups.states.confirmed', 'Confirmed') },
        { value: 'waitlisted', label: t('signups.states.waitlisted', 'Waitlisted') },
        { value: 'withdrawn', label: t('signups.states.withdrawn', 'Withdrawn') },
      ]}
      onChange={onChange}
      filter={filter}
    />
  );
};

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
  const { t } = useTranslation();
  let badgeClass = 'badge-danger';
  let text = value;
  if (value === 'OK') {
    badgeClass = 'badge-success';
    text = t('tables.ageRestrictionsCheck.ok', 'OK');
  } else if (value === 'Unknown age') {
    badgeClass = 'badge-warning';
    text = t('tables.ageRestrictionsCheck.unknown', 'Unknown age');
  } else if (value === 'N/A') {
    badgeClass = 'badge-light';
    text = t('tables.ageRestrictionsCheck.notApplicable', 'N/A');
  }

  return <span className={`badge ${badgeClass}`}>{text}</span>;
};

AgeRestrictionsCheckCell.propTypes = {
  value: PropTypes.string.isRequired,
};

const BucketCell = ({ original }) => {
  const { t } = useTranslation();
  const data = useContext(QueryDataContext);
  return formatBucket(original, data.event, t);
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

const getPossibleColumns = (t) => [
  {
    Header: t('events.signupAdmin.sequenceHeader', 'Seq'),
    id: 'id',
    accessor: 'id',
    filterable: false,
    width: 65,
  },
  {
    Header: t('events.signupAdmin.stateHeader', 'State'),
    id: 'state',
    accessor: 'state',
    width: 130,
    Filter: SignupStateFilter,
    Cell: SignupStateCell,
  },
  {
    Header: t('events.signupAdmin.nameHeader', 'Name'),
    id: 'name',
    accessor: (signup) => signup.user_con_profile,
    Filter: FreeTextFilter,
    Cell: UserConProfileWithGravatarCell,
  },
  {
    Header: t('events.signupAdmin.bucketHeader', 'Bucket'),
    id: 'bucket',
    accessor: (signup) => signup.bucket_key,
    Cell: (props) => <BucketCell {...props} />,
    Filter: BucketFilter,
  },
  {
    Header: t('events.signupAdmin.ageCheckHeader', 'Age check'),
    id: 'age_restrictions_check',
    accessor: 'age_restrictions_check',
    width: 100,
    filterable: false,
    Cell: AgeRestrictionsCheckCell,
  },
  {
    Header: t('events.signupAdmin.ageHeader', 'Age'),
    id: 'age',
    width: 40,
    accessor: (signup) => ageAsOf(
      moment(signup.user_con_profile.birth_date),
      moment(signup.run.starts_at),
    ),
    filterable: false,
  },
  {
    Header: t('events.signupAdmin.emailHeader', 'Email'),
    id: 'email',
    accessor: (signup) => signup.user_con_profile.email,
    Cell: EmailCell,
    Filter: FreeTextFilter,
  },
];

function RunSignupsTable({
  defaultVisibleColumns, eventId, runId, runPath,
}) {
  const { t } = useTranslation();
  const history = useHistory();
  const { data, loading, error } = useQuery(SignupAdminEventQuery, { variables: { eventId } });
  const getPossibleColumnsFunc = useMemo(
    () => () => getPossibleColumns(t),
    [t],
  );

  const [reactTableProps, { tableHeaderProps, queryData }] = useReactTableWithTheWorks({
    decodeFilterValue,
    defaultVisibleColumns,
    encodeFilterValue,
    getData: ({ data: tableData }) => tableData.event.run.signups_paginated.entries,
    getPages: ({ data: tableData }) => tableData.event.run.signups_paginated.total_pages,
    getPossibleColumns: getPossibleColumnsFunc,
    query: RunSignupsTableSignupsQuery,
    storageKeyPrefix: 'adminSignups',
    variables: { eventId, runId },
  });

  usePageTitle(useValueUnless(
    () => t(
      'events.signupAdmin.indexPageTitle', 'Signups - {{ eventTitle }}',
      { eventTitle: data.event.title },
    ),
    error || loading,
  ));

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <QueryDataContext.Provider value={queryData}>
      <div className="mb-4">
        <TableHeader {...tableHeaderProps} exportUrl={`/csv_exports/run_signups?run_id=${runId}`} />
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
  runId: PropTypes.number.isRequired,
  runPath: PropTypes.string.isRequired,
};

export default RunSignupsTable;
