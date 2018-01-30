import { connect } from 'react-redux';
import actions from '../actions';
import FormPresenter from '../components/FormPresenter';

const mapStateToProps = state => ({
  currentSectionId: state.currentSectionId,
  errors: state.errors,
  form: state.form,
  convention: state.convention,
  response: state.response,
  isUpdatingResponse: state.isUpdatingResponse,
  afterSubmitUrl: state.apiConfiguration.afterSubmitUrl,
});

const mapDispatchToProps = dispatch => ({
  responseValueChanged: (field, value) => {
    dispatch(actions.responseValueChanged(field, value));
    dispatch(actions.updateResponse());
  },
  previousSection: () => dispatch(actions.previousSection()),
  nextSection: () => dispatch(actions.nextSection()),
  submitForm: () => dispatch(actions.submitForm()),
});

const FormPresenterContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormPresenter);

export default FormPresenterContainer;
