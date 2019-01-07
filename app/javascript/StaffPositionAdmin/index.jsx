import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import {
  BrowserRouter, Route, Switch, Redirect,
} from 'react-router-dom';

import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import GraphQLResultPropType from '../GraphQLResultPropType';
import EditStaffPosition from './EditStaffPosition';
import EditStaffPositionPermissions from './EditStaffPositionPermissions';
import NewStaffPosition from './NewStaffPosition';
import { StaffPositionsQuery } from './queries.gql';
import StaffPositionsTable from './StaffPositionsTable';

@graphql(StaffPositionsQuery)
@GraphQLQueryResultWrapper
class StaffPositionAdmin extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(StaffPositionsQuery).isRequired,
    basename: PropTypes.string.isRequired,
  }

  renderEditStaffPosition = ({ match: { params: { id } } }) => {
    const staffPosition = this.props.data.convention.staff_positions
      .find(sp => sp.id.toString(10) === id);

    return <EditStaffPosition initialStaffPosition={staffPosition} />;
  }

  renderStaffPositionsTable = () => (
    <StaffPositionsTable
      staffPositions={this.props.data.convention.staff_positions}
    />
  )

  renderEditPermissions = ({ match: { params: { id } } }) => {
    const staffPosition = this.props.data.convention.staff_positions
      .find(sp => sp.id.toString(10) === id);

    return (
      <EditStaffPositionPermissions
        staffPosition={staffPosition}
        eventCategories={this.props.data.convention.event_categories}
      />
    );
  }

  render = () => (
    <BrowserRouter basename={this.props.basename}>
      <Switch>
        <Route path="/new" component={NewStaffPosition} />
        <Route path="/:id/edit" render={this.renderEditStaffPosition} />
        <Route path="/:id/edit_permissions" render={this.renderEditPermissions} />
        <Route path="/:id/delete" render={this.renderStaffPositionsTable} />
        <Route path="/" render={this.renderStaffPositionsTable} />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  )
}

export default StaffPositionAdmin;
