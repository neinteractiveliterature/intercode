import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import GraphQLResultPropType from '../GraphQLResultPropType';
import EditStaffPosition from './EditStaffPosition';
import NewStaffPosition from './NewStaffPosition';
import StaffPositionsTable from './StaffPositionsTable';
import { staffPositionsQuery } from './queries';

@graphql(staffPositionsQuery)
@GraphQLQueryResultWrapper
class StaffPositionAdmin extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(staffPositionsQuery).isRequired,
    basename: PropTypes.string.isRequired,
  }

  renderEditStaffPosition = ({ match: { params: { id } } }) => {
    const staffPosition = this.props.data.convention.staff_positions
      .find(sp => sp.id.toString(10) === id);

    return <EditStaffPosition initialStaffPosition={staffPosition} />;
  }

  renderStaffPositionsTable = ({ match: { path, params: { id } } }) => {
    let deleteId = null;
    if (path === '/:id/delete') {
      deleteId = Number.parseInt(id, 10);
    }

    return (
      <StaffPositionsTable
        staffPositions={this.props.data.convention.staff_positions}
        deleteId={deleteId}
      />
    );
  }

  render = () => (
    <BrowserRouter basename={this.props.basename}>
      <Switch>
        <Route path="/new" component={NewStaffPosition} />
        <Route path="/:id/edit" render={this.renderEditStaffPosition} />
        <Route path="/:id/delete" render={this.renderStaffPositionsTable} />
        <Route path="/" render={this.renderStaffPositionsTable} />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  )
}

export default StaffPositionAdmin;
