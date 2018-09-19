import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Link, Route, withRouter } from 'react-router-dom';
import { humanize, titleize } from 'inflected';
import moment from 'moment-timezone';

import AddAttendeeModal from './AddAttendeeModal';
import ChoiceSetFilter from '../Tables/ChoiceSetFilter';
import Form from '../Models/Form';
import formatMoney from '../formatMoney';
import FormItemDisplay from '../FormPresenter/ItemDisplays/FormItemDisplay';
import FreeTextFilter from '../Tables/FreeTextFilter';
import { GraphQLReactTableConsumer } from '../Tables/GraphQLReactTableContext';
import ReactTableWithTheWorks from '../Tables/ReactTableWithTheWorks';
import TableHeader from '../Tables/TableHeader';

const userConProfilesQuery = gql`
query($page: Int, $perPage: Int, $filters: UserConProfileFiltersInput, $sort: [SortInput]) {
  convention {
    name
    privilege_names
    starts_at
    ends_at
    timezone_name
    ticket_name

    ticket_types {
      id
      name
    }

    user_con_profile_form {
      form_api_json
    }

    user_con_profiles_paginated(page: $page, per_page: $perPage, filters: $filters, sort: $sort) {
      total_entries
      total_pages
      current_page
      per_page

      entries {
        id
        name_inverted
        email
        privileges
        form_response_attrs_json

        ticket {
          id
          updated_at

          payment_amount {
            fractional
            currency_code
          }

          ticket_type {
            id
            name
          }
        }
      }
    }
  }

  myProfile {
    id
    ability {
      can_create_user_con_profiles
    }
  }
}
`;

function encodeFilterValue(field, value) {
  if (field === 'ticket' || field === 'privileges') {
    const encoded = value.join(',');
    if (encoded.length === 0) {
      return null;
    }
    return encoded;
  }

  return value;
}

function decodeFilterValue(field, value) {
  if (field === 'ticket' || field === 'privileges') {
    const decoded = value.split(',').filter(decodedValue => decodedValue.length > 0);
    if (decoded.length === 0) {
      return null;
    }
    return decoded;
  }

  return value;
}

function formatTicketStatus(ticket) {
  if (!ticket) {
    return 'Unpaid';
  }

  const ticketTypeName = humanize(ticket.ticket_type.name);

  if (ticket.payment_amount.fractional > 0) {
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
    const form = Form.fromApiResponse(JSON.parse(data.convention.user_con_profile_form.form_api_json));

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
    ];

    form.getAllItems().forEach((formItem) => {
      const identifier = formItem.get('identifier');
      if (!identifier || identifier === 'first_name' || identifier === 'last_name' || columns.some(column => column.id === identifier)) {
        return;
      }

      columns.push({
        Header: formItem.get('admin_description') || humanize(identifier),
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
        query={userConProfilesQuery}
        renderHeader={headerProps => (
          <TableHeader
            {...headerProps}
            renderLeftContent={() => (
              <GraphQLReactTableConsumer>
                {({ queryResult: { data } }) => (
                  data.myProfile.ability.can_create_user_con_profiles
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
