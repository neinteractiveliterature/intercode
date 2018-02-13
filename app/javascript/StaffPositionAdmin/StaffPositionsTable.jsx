import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Link, withRouter } from 'react-router-dom';
import { ConfirmModal } from 'react-bootstrap4-modal';
import ErrorDisplay from '../ErrorDisplay';
import StaffPositionPropType from './StaffPositionPropType';
import { staffPositionsQuery } from './queries';

const deleteStaffPositionMutation = gql`
mutation($input: DeleteStaffPositionInput!) {
  deleteStaffPosition(input: $input) {
    staff_position {
      id
    }
  }
}
`;

@withRouter
@graphql(deleteStaffPositionMutation, {
  props: ({ mutate }) => ({
    deleteStaffPosition: id => mutate({
      variables: { input: { id } },
      update: (proxy) => {
        const data = proxy.readQuery({ query: staffPositionsQuery });
        data.convention.staff_positions = data.convention.staff_positions.filter((
          staffPosition => staffPosition.id !== id
        ));
        proxy.writeQuery({ query: staffPositionsQuery, data });
      },
    }),
  }),
})
class StaffPositionsTable extends React.Component {
  static propTypes = {
    staffPositions: PropTypes.arrayOf(StaffPositionPropType).isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    deleteId: PropTypes.number,
    deleteStaffPosition: PropTypes.func.isRequired,
  };

  static defaultProps = {
    deleteId: null,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  deleteConfirmed = async () => {
    try {
      await this.props.deleteStaffPosition(this.props.deleteId);
      this.props.history.replace('/');
    } catch (error) {
      this.setState({ error });
    }
  }

  deleteCanceled = () => {
    this.props.history.replace('/');
  }

  renderRow = staffPosition => (
    <tr key={staffPosition.id}>
      <td>{staffPosition.name}</td>
      <td>{staffPosition.visible ? (<i className="fa fa-check" />) : null}</td>
      <td>{staffPosition.user_con_profiles.map(ucp => ucp.name_without_nickname).join(', ')}</td>
      <td>{staffPosition.email}</td>
      <td>
        <Link to={`/${staffPosition.id}/edit`} className="btn btn-secondary btn-sm mr-1">Edit</Link>
        <Link to={`/${staffPosition.id}/delete`} className="btn btn-danger btn-sm">Delete</Link>
      </td>
    </tr>
  )

  renderDeleteConfirmation = () => {
    let staffPositionName = null;
    if (this.props.deleteId != null) {
      const deleteStaffPosition = this.props.staffPositions.find((
        sp => sp.id === this.props.deleteId
      ));
      if (deleteStaffPosition != null) {
        staffPositionName = deleteStaffPosition.name;
      }
    }

    return (
      <ConfirmModal
        visible={this.props.deleteId != null}
        onOK={this.deleteConfirmed}
        onCancel={this.deleteCanceled}
      >
        Are you sure you want to delete the staff position {staffPositionName}?

        <ErrorDisplay graphQLError={this.state.error} />
      </ConfirmModal>
    );
  }

  render = () => {
    const sortedStaffPositions = [...this.props.staffPositions].sort((
      (a, b) => a.name.localeCompare(b.name, { sensitivity: 'base' })
    ));
    const staffPositionRows = sortedStaffPositions.map(this.renderRow);

    return (
      <div>
        <h1 className="mb-4">Staff positions</h1>

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Visible</th>
              <th>People</th>
              <th>Email</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {staffPositionRows}
          </tbody>
        </table>

        <Link to="/new" className="btn btn-primary">New Staff Position</Link>

        {this.renderDeleteConfirmation()}
      </div>
    );
  }
}

export default StaffPositionsTable;
