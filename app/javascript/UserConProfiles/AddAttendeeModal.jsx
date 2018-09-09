import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { withRouter } from 'react-router-dom';

@withRouter
class AddAttendeeModal extends React.Component {
  static propTypes = {
    conventionName: PropTypes.string.isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    visible: PropTypes.bool.isRequired,
  }

  cancel = () => { this.props.history.replace('/'); }

  render = () => (
    <Modal visible={this.props.visible} dialogClassName="modal-lg">
      <div className="modal-header">
        Add attendee
      </div>
      <div className="modal-body">
        <p>
          Choose a user to add as an attendee for
          {' '}
          {this.props.conventionName}
          .  This person must
          already be a user in the site database in order to be added.
        </p>
      </div>
      <div className="modal-footer">
        <button
          className="btn btn-secondary"
          type="button"
          onClick={this.cancel}
        >
          Cancel
        </button>
        <button className="btn btn-primary" type="button">Add</button>
      </div>
    </Modal>
  )
}

export default AddAttendeeModal;
