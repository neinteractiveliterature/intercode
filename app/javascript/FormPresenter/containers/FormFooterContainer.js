import { connect } from 'react-redux';
import actions from '../actions';
import FormFooter from '../components/FormFooter';

const mapStateToProps = state => ({
  currentSectionId: state.currentSectionId,
  isUpdatingResponse: state.isUpdatingResponse,
  afterSubmitUrl: state.apiConfiguration.afterSubmitUrl,
});

const mapDispatchToProps = dispatch => ({
  previousSection: () => dispatch(actions.previousSection()),
  nextSection: () => dispatch(actions.nextSection()),
  submitForm: () => dispatch(actions.submitForm()),
});

const FormFooterContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormFooter);

export default FormFooterContainer;
