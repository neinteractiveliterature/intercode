import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link, Route, withRouter } from 'react-router-dom';
import { humanize } from 'inflected';
import moment from 'moment-timezone';
import ReactTable from 'react-table';

import AddAttendeeModal from './AddAttendeeModal';
import BooleanCell from '../Tables/BooleanCell';
import BooleanChoiceSetFilter from '../Tables/BooleanChoiceSetFilter';
import { buildFieldFilterCodecs, FilterCodecs } from '../Tables/FilterUtils';
import ChoiceSetFilter from '../Tables/ChoiceSetFilter';
import EmailCell from '../Tables/EmailCell';
import formatMoney from '../formatMoney';
import FormItemDisplay from '../FormPresenter/ItemDisplays/FormItemDisplay';
import FreeTextFilter from '../Tables/FreeTextFilter';
import useReactTableWithTheWorks, { QueryDataContext } from '../Tables/useReactTableWithTheWorks';
import TableHeader from '../Tables/TableHeader';
import { UserConProfilesTableUserConProfilesQuery } from './queries.gql';
import { deserializeForm } from '../FormPresenter/GraphQLFormDeserialization';
import UserConProfileWithGravatarCell from '../Tables/UserConProfileWithGravatarCell';

const { encodeFilterValue, decodeFilterValue } = buildFieldFilterCodecs({
  ticket: FilterCodecs.stringArray,
  ticket_type: FilterCodecs.stringArray,
  privileges: FilterCodecs.stringArray,
  attending: FilterCodecs.boolean,
  is_team_member: FilterCodecs.boolean,
  payment_amount: FilterCodecs.float,
});

function TicketStatusCell({ value }) {
  if (!value) {
    return 'Unpaid';
  }

  return humanize(value.ticket_type.name);
}

TicketStatusCell.propTypes = {
  value: PropTypes.shape({
    ticket_type: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  }),
};

TicketStatusCell.defaultProps = {
  value: null,
};

function TicketPaymentAmountCell({ value }) {
  return formatMoney((value || {}).payment_amount);
}

TicketPaymentAmountCell.propTypes = {
  value: PropTypes.shape({
    payment_amount: PropTypes.shape({}),
  }),
};

TicketPaymentAmountCell.defaultProps = {
  value: null,
};

function TicketStatusWithPaymentAmountCell({ value }) {
  return (
    <>
      <TicketStatusCell value={value} />
      {' '}
      <TicketPaymentAmountCell value={value} />
    </>
  );
}

TicketStatusWithPaymentAmountCell.propTypes = {
  value: PropTypes.shape({}),
};

TicketStatusWithPaymentAmountCell.defaultProps = {
  value: null,
};

const TicketTypeFilter = ({ filter, onChange }) => {
  const data = useContext(QueryDataContext);
  const choices = useMemo(
    () => (data
      ? [
        { label: 'Unpaid', value: 'none' },
        ...(data.convention.ticket_types
          .map((ticketType) => ({
            label: humanize(ticketType.name),
            value: ticketType.id.toString(),
          }))),
      ]
      : []
    ),
    [data],
  );

  return (
    <ChoiceSetFilter
      name="ticketType"
      choices={choices}
      onChange={onChange}
      filter={filter}
      multiple
    />
  );
};

TicketTypeFilter.propTypes = {
  filter: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
};

TicketTypeFilter.defaultProps = {
  filter: null,
};

const privilegeNames = {
  site_admin: 'Global admin',
};

const PrivilegesCell = ({ value }) => [...value].map((priv) => privilegeNames[priv]).sort().join(', ');

PrivilegesCell.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
};

PrivilegesCell.defaultProps = {
  value: null,
};

const PrivilegesFilter = ({ filter, onChange }) => (
  <ChoiceSetFilter
    name="privileges"
    choices={[{ label: 'Global admin', value: 'site_admin' }]}
    onChange={onChange}
    filter={filter}
    multiple
  />
);

PrivilegesFilter.propTypes = {
  filter: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
};

PrivilegesFilter.defaultProps = {
  filter: null,
};

const getPossibleColumns = (data) => {
  const form = deserializeForm(data.convention.user_con_profile_form);

  const columns = [
    {
      Header: 'ID',
      id: 'id',
      accessor: 'id',
      filterable: false,
      sortable: false,
      width: 70,
    },
    {
      Header: 'User ID',
      id: 'user_id',
      accessor: (userConProfile) => userConProfile.user_id,
      filterable: false,
      sortable: false,
      width: 70,
    },
    {
      Header: 'Name',
      id: 'name',
      Filter: FreeTextFilter,
      Cell: UserConProfileWithGravatarCell,
    },
    {
      Header: 'First name',
      id: 'first_name',
      accessor: 'first_name',
      Filter: FreeTextFilter,
    },
    {
      Header: 'Last name',
      id: 'last_name',
      accessor: 'last_name',
      Filter: FreeTextFilter,
    },
    {
      Header: 'Email',
      id: 'email',
      accessor: 'email',
      Cell: EmailCell,
      Filter: FreeTextFilter,
    },
    ...(
      data.convention.ticket_mode === 'disabled'
        ? []
        : [
          {
            Header: humanize(data.convention.ticket_name || 'ticket'),
            id: 'ticket',
            accessor: 'ticket',
            width: 150,
            Cell: TicketStatusWithPaymentAmountCell,
            Filter: TicketTypeFilter,
          },
          {
            Header: `${humanize(data.convention.ticket_name || 'ticket')} type`,
            id: 'ticket_type',
            accessor: 'ticket',
            width: 150,
            Cell: TicketStatusCell,
            Filter: TicketTypeFilter,
          },
          {
            Header: 'Payment amount',
            id: 'payment_amount',
            accessor: 'ticket',
            width: 150,
            Cell: TicketPaymentAmountCell,
            Filter: FreeTextFilter,
          },
        ]
    ),
    {
      Header: 'Event team member?',
      id: 'is_team_member',
      accessor: (userConProfile) => userConProfile.team_members.length > 0,
      width: 150,
      sortable: false,
      Cell: BooleanCell,
      Filter: BooleanChoiceSetFilter,
    },
    {
      Header: 'Attending?',
      id: 'attending',
      accessor: 'ticket',
      width: 150,
      sortable: false,
      Cell: BooleanCell,
      Filter: BooleanChoiceSetFilter,
    },
    ...(
      data.convention.ticket_mode === 'disabled'
        ? []
        : [
          {
            Header: `${humanize(data.convention.ticket_name || 'ticket')} status changed`,
            id: 'ticket_updated_at',
            accessor: (userConProfile) => (
              userConProfile.ticket ? moment(userConProfile.ticket.updated_at) : null
            ),
            filterable: false,
            Cell: ({ value }) => (value ? value.format('MMM D, YYYY H:mma') : null),
          },
        ]
    ),
    {
      Header: 'Privileges',
      id: 'privileges',
      accessor: 'privileges',
      Cell: PrivilegesCell,
      Filter: PrivilegesFilter,
    },
    {
      Header: 'Order summary',
      id: 'order_summary',
      accessor: 'order_summary',
      filterable: false,
      sortable: false,
    },
  ];

  form.getAllItems().forEach((formItem) => {
    const { identifier } = formItem;
    if (!identifier || identifier === 'first_name' || identifier === 'last_name' || columns.some((column) => column.id === identifier)) {
      return;
    }

    const FormItemCell = ({ value }) => (
      <FormItemDisplay formItem={formItem} value={value} convention={data.convention} />
    );

    FormItemCell.propTypes = {
      value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
    };

    FormItemCell.defaultProps = {
      value: null,
    };

    columns.push({
      Header: formItem.admin_description || humanize(identifier),
      id: identifier,
      accessor: (userConProfile) => JSON.parse(userConProfile.form_response_attrs_json)[identifier],
      Cell: FormItemCell,
      sortable: false,
      filterable: false,
    });
  });

  return columns;
};

function UserConProfilesTable({ defaultVisibleColumns, exportUrl, history }) {
  const [reactTableProps, { tableHeaderProps, queryData }] = useReactTableWithTheWorks({
    decodeFilterValue,
    defaultVisibleColumns,
    encodeFilterValue,
    getData: ({ data }) => data.convention.user_con_profiles_paginated.entries,
    getPages: ({ data }) => data.convention.user_con_profiles_paginated.total_pages,
    getPossibleColumns,
    history,
    query: UserConProfilesTableUserConProfilesQuery,
    storageKeyPrefix: 'userConProfiles',
  });

  return (
    <QueryDataContext.Provider value={queryData}>
      <div className="mb-4">
        <TableHeader
          {...tableHeaderProps}
          exportUrl={exportUrl}
          renderLeftContent={() => (
            queryData && (queryData.currentAbility || {}).can_create_user_con_profiles
              ? (
                <Link to="/user_con_profiles/new" className="btn btn-primary ml-2 mb-2">
                  <i className="fa fa-plus" />
                  {' '}
                  Add attendee
                </Link>
              )
              : null
          )}
        />

        <ReactTable
          {...reactTableProps}

          className="-striped -highlight"
          getTrProps={(state, rowInfo) => ({
            style: { cursor: 'pointer' },
            onClick: () => {
              history.push(`/user_con_profiles/${rowInfo.original.id}`);
            },
          })}
          getTheadFilterThProps={() => ({ className: 'text-left', style: { overflow: 'visible' } })}
        />

        <Route path="/user_con_profiles/new">
          {({ match }) => (
            <AddAttendeeModal
              conventionName={(queryData && (queryData.convention || {}).name) || ''}
              visible={match != null}
            />
          )}
        </Route>
      </div>
    </QueryDataContext.Provider>
  );
}

UserConProfilesTable.propTypes = {
  defaultVisibleColumns: PropTypes.arrayOf(PropTypes.string),
  exportUrl: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

UserConProfilesTable.defaultProps = {
  defaultVisibleColumns: null,
};

export default withRouter(UserConProfilesTable);
