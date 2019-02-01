import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route, withRouter } from 'react-router-dom';
import { humanize, titleize } from 'inflected';
import moment from 'moment-timezone';

import AddAttendeeModal from './AddAttendeeModal';
import BooleanChoiceSetFilter from '../Tables/BooleanChoiceSetFilter';
import { buildFieldFilterCodecs, FilterCodecs } from '../Tables/FilterUtils';
import ChoiceSetFilter from '../Tables/ChoiceSetFilter';
import formatMoney from '../formatMoney';
import FormItemDisplay from '../FormPresenter/ItemDisplays/FormItemDisplay';
import FreeTextFilter from '../Tables/FreeTextFilter';
import { GraphQLReactTableConsumer } from '../Tables/GraphQLReactTableContext';
import ReactTableWithTheWorks from '../Tables/ReactTableWithTheWorks';
import TableHeader from '../Tables/TableHeader';
import { UserConProfilesTableUserConProfilesQuery } from './queries.gql';
import { deserializeForm } from '../FormPresenter/GraphQLFormDeserialization';

const { encodeFilterValue, decodeFilterValue } = buildFieldFilterCodecs({
  ticket: FilterCodecs.stringArray,
  privileges: FilterCodecs.stringArray,
  attending: FilterCodecs.boolean,
  is_team_member: FilterCodecs.boolean,
  payment_amount: FilterCodecs.float,
});

function formatTicketStatus(ticket) {
  if (!ticket) {
    return 'Unpaid';
  }

  const ticketTypeName = humanize(ticket.ticket_type.name);

  if (ticket.payment_amount && ticket.payment_amount.fractional > 0) {
    return `${ticketTypeName} ${formatMoney(ticket.payment_amount)}`;
  }

  return ticketTypeName;
}

@withRouter
class UserConProfilesTable extends React.Component {
  static propTypes = {
    defaultVisibleColumns: PropTypes.arrayOf(PropTypes.string),
    exportUrl: PropTypes.string.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
    }).isRequired,
  };

  getPossibleColumns = (data) => {
    const form = deserializeForm(data.convention.user_con_profile_form);

    const columns = [
      {
        Header: 'Name',
        id: 'name',
        accessor: userConProfile => userConProfile.name_inverted,
        Filter: ({ filter, onChange }) => (
          <FreeTextFilter filter={filter} onChange={onChange} />
        ),
      },
      {
        Header: 'First name',
        id: 'first_name',
        accessor: 'first_name',
        Filter: ({ filter, onChange }) => (
          <FreeTextFilter filter={filter} onChange={onChange} />
        ),
      },
      {
        Header: 'Last name',
        id: 'last_name',
        accessor: 'last_name',
        Filter: ({ filter, onChange }) => (
          <FreeTextFilter filter={filter} onChange={onChange} />
        ),
      },
      {
        Header: 'Email',
        id: 'email',
        accessor: 'email',
        Cell: ({ value }) => (
          <a href={`mailto:${value}`} onClick={(event) => { event.stopPropagation(); }}>
            {value}
          </a>
        ),
        Filter: ({ filter, onChange }) => (
          <FreeTextFilter filter={filter} onChange={onChange} />
        ),
      },
      {
        Header: humanize(data.convention.ticket_name || 'ticket'),
        id: 'ticket',
        accessor: 'ticket',
        width: 150,
        Cell: ({ value }) => formatTicketStatus(value),
        Filter: ({ filter, onChange }) => (
          <ChoiceSetFilter
            name="ticketType"
            choices={[
              { label: 'Unpaid', value: 'none' },
              ...(data.convention.ticket_types
                .map(ticketType => ({
                  label: humanize(ticketType.name),
                  value: ticketType.id.toString(),
                }))),
            ]}
            onChange={onChange}
            filter={filter}
          />
        ),
      },
      {
        Header: 'Payment amount',
        id: 'payment_amount',
        accessor: 'ticket',
        width: 150,
        Cell: ({ value }) => formatMoney((value || {}).payment_amount),
        Filter: ({ filter, onChange }) => (
          <FreeTextFilter filter={filter} onChange={onChange} />
        ),
      },
      {
        Header: 'Event team member?',
        id: 'is_team_member',
        accessor: userConProfile => userConProfile.team_members.length > 0,
        width: 150,
        sortable: false,
        Cell: ({ value }) => (value ? 'yes' : 'no'),
        Filter: ({ filter, onChange }) => (
          <BooleanChoiceSetFilter
            name="isTeamMember"
            filter={filter}
            onChange={onChange}
          />
        ),
      },
      {
        Header: 'Attending?',
        id: 'attending',
        accessor: 'ticket',
        width: 150,
        sortable: false,
        Cell: ({ value }) => (value ? 'yes' : 'no'),
        Filter: ({ filter, onChange }) => (
          <BooleanChoiceSetFilter
            name="attending"
            filter={filter}
            onChange={onChange}
          />
        ),
      },
      {
        Header: `${humanize(data.convention.ticket_name || 'ticket')} status changed`,
        id: 'ticket_updated_at',
        accessor: userConProfile => (userConProfile.ticket ? moment(userConProfile.ticket.updated_at) : null),
        filterable: false,
        Cell: ({ value }) => (value ? value.format('MMM D, YYYY H:mma') : null),
      },
      {
        Header: 'Privileges',
        id: 'privileges',
        accessor: 'privileges',
        Cell: ({ value }) => [...value].sort().map(priv => titleize(priv)).join(', '),
        Filter: ({ filter, onChange }) => (
          <ChoiceSetFilter
            name="privileges"
            choices={[
              ...(data.convention.privilege_names
                .map(privilegeName => ({
                  label: humanize(privilegeName),
                  value: privilegeName,
                }))),
            ]}
            onChange={onChange}
            filter={filter}
          />
        ),
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
      if (!identifier || identifier === 'first_name' || identifier === 'last_name' || columns.some(column => column.id === identifier)) {
        return;
      }

      columns.push({
        Header: formItem.admin_description || humanize(identifier),
        id: identifier,
        accessor: userConProfile => JSON.parse(userConProfile.form_response_attrs_json)[identifier],
        Cell: ({ value }) => <FormItemDisplay formItem={formItem} value={value} convention={data.convention} />,
        sortable: false,
        filterable: false,
      });
    });

    return columns;
  }

  render = () => (
    <div className="mb-4">
      <ReactTableWithTheWorks
        decodeFilterValue={decodeFilterValue}
        defaultVisibleColumns={this.props.defaultVisibleColumns}
        encodeFilterValue={encodeFilterValue}
        exportUrl={this.props.exportUrl}
        getData={({ data }) => data.convention.user_con_profiles_paginated.entries}
        getPages={({ data }) => data.convention.user_con_profiles_paginated.total_pages}
        getPossibleColumns={this.getPossibleColumns}
        query={UserConProfilesTableUserConProfilesQuery}
        storageKeyPrefix="userConProfiles"
        renderHeader={headerProps => (
          <TableHeader
            {...headerProps}
            renderLeftContent={() => (
              <GraphQLReactTableConsumer>
                {({ queryResult: { data } }) => (
                  data.currentAbility.can_create_user_con_profiles
                    ? (
                      <Link to="/new" className="btn btn-primary ml-2 mb-2">
                        <i className="fa fa-plus" />
                        {' '}
                        Add attendee
                      </Link>
                    )
                    : null
                )}
              </GraphQLReactTableConsumer>
            )}
          />
        )}
        renderFooter={() => (
          <GraphQLReactTableConsumer>
            {({ queryResult: { data } }) => (
              <Route path="/new">
                {({ match }) => (
                  <AddAttendeeModal
                    conventionName={data.convention.name}
                    visible={match != null}
                  />
                )}
              </Route>
            )}
          </GraphQLReactTableConsumer>
        )}

        className="-striped -highlight"
        getTrProps={(state, rowInfo) => ({
          style: { cursor: 'pointer' },
          onClick: () => {
            this.props.history.push(`${rowInfo.original.id}`);
          },
        })}
        getTheadFilterThProps={() => ({ className: 'text-left', style: { overflow: 'visible' } })}
      />
    </div>
  )
}

export default UserConProfilesTable;
