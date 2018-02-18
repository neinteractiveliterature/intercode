import { connect } from 'react-redux';
import actions from '../actions';
import FormFooter from '../components/FormFooter';

const mapStateToProps = state => ({
  currentSectionId: state.currentSectionId,
  form: state.form,
  response: state.response,
  isSubmittingResponse: state.isSubmittingResponse,
  afterSubmitUrl: state.apiConfiguration.afterSubmitUrl,
});

const mapDispatchToProps = dispatch => ({
  previousSection: () => dispatch(actions.previousSection()),
  nextSection: () => dispatch(actions.nextSection()),
  submitForm: () => dispatch(actions.submitForm()),
  updateResponse: () => dispatch(actions.updateResponse()),
  onInteract: itemIdentifier => dispatch(actions.interactedWithItem(itemIdentifier)),
});

const FormFooterContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormFooter);

export default FormFooterContainer;
