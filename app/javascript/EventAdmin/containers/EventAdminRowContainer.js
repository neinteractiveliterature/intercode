import { connect } from 'react-redux';
import actions from '../actions';
import EventAdminRow from '../components/EventAdminRow';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  newRun: event => dispatch(actions.newRun(event)),
  editRun: (event, run) => dispatch(actions.editRun(event, run)),
});

const EventAdminRowContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EventAdminRow);

export default EventAdminRowContainer;
