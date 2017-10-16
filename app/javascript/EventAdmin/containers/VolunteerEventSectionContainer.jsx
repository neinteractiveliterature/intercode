import { connect } from 'react-redux';
import actions from '../actions';
import VolunteerEventSection from '../components/VolunteerEventSection';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  editRun: (event, run) => dispatch(actions.editRun(event, run)),
});

const VolunteerEventSectionContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(VolunteerEventSection);

export default VolunteerEventSectionContainer;
