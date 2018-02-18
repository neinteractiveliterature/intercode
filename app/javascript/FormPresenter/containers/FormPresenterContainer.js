import { connect } from 'react-redux';
import actions from '../actions';
import FormPresenter from '../components/FormPresenter';

const mapStateToProps = state => ({
  currentSectionId: state.currentSectionId,
  errors: state.errors,
  form: state.form,
  convention: state.convention,
  response: state.response,
  interactedItems: state.interactedItems,
  isSubmittingResponse: state.isSubmittingResponse,
  isUpdatingResponse: state.isUpdatingResponse,
  afterSubmitUrl: state.apiConfiguration.afterSubmitUrl,
});

const mapDispatchToProps = dispatch => ({
  responseValueChanged: (field, value) => dispatch(actions.responseValueChanged(field, value)),
  updateResponse: () => dispatch(actions.updateResponse()),
  previousSection: () => dispatch(actions.previousSection()),
  nextSection: () => dispatch(actions.nextSection()),
  submitForm: () => dispatch(actions.submitForm()),
  interactedWithItem: itemIdentifier => dispatch(actions.interactedWithItem(itemIdentifier)),
});

const FormPresenterContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormPresenter);

export default FormPresenterContainer;
