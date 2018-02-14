import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import GraphQLResultPropType from '../GraphQLResultPropType';
import EditTicketType from './EditTicketType';
import NewTicketType from './NewTicketType';
import TicketTypesList from './TicketTypesList';
import { ticketTypesQuery } from './queries';

@graphql(ticketTypesQuery)
@GraphQLQueryResultWrapper
class TicketTypeAdmin extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(ticketTypesQuery).isRequired,
    basename: PropTypes.string.isRequired,
  }

  renderNewTicketType = () => (
    <NewTicketType
      timezoneName={this.props.data.convention.timezone_name}
      ticketName={this.props.data.convention.ticket_name}
    />
  )

  renderEditTicketType = ({ match: { params: { id } } }) => {
    const ticketType = this.props.data.convention.ticket_types
      .find(tt => tt.id.toString(10) === id);

    return (
      <EditTicketType
        initialTicketType={ticketType}
        timezoneName={this.props.data.convention.timezone_name}
        ticketName={this.props.data.convention.ticket_name}
      />
    );
  }

  renderTicketTypesList = ({ match: { path, params: { id } } }) => {
    let deleteId = null;
    if (path === '/:id/delete') {
      deleteId = Number.parseInt(id, 10);
    }

    return (
      <TicketTypesList
        ticketTypes={this.props.data.convention.ticket_types}
        deleteId={deleteId}
        ticketName={this.props.data.convention.ticket_name}
        timezoneName={this.props.data.convention.timezone_name}
      />
    );
  }

  render = () => (
    <BrowserRouter basename={this.props.basename}>
      <Switch>
        <Route path="/new" render={this.renderNewTicketType} />
        <Route path="/:id/edit" render={this.renderEditTicketType} />
        <Route path="/:id/delete" render={this.renderTicketTypesList} />
        <Route path="/" render={this.renderTicketTypesList} />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  )
}

export default TicketTypeAdmin;
