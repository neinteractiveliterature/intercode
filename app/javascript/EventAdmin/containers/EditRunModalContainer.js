import { connect } from 'react-redux';
import actions from '../actions';
import EditRunModal from '../components/EditRunModal';

const mapStateToProps = state => ({
  ...state.editingRun,
});

const mapDispatchToProps = dispatch => ({
  onSaveStart: () => dispatch(actions.saveEditingRun.START()),
  onSaveSucceeded: run => dispatch(actions.saveEditingRun.SUCCEEDED(run)),
  onSaveFailed: error => dispatch(actions.saveEditingRun.FAILED(error)),
  onCancel: () => dispatch(actions.cancelEditingRun()),
  onDelete: () => dispatch(actions.deleteEditingRun()),
  fieldChanged: (field, value) => dispatch(actions.editingRunFieldChanged(field, value)),
});

const EditRunModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditRunModal);

export default EditRunModalContainer;
