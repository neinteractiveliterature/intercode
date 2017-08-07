import { connect } from 'react-redux';
import actions from '../actions';
import FormPresenter from '../components/FormPresenter';

const mapStateToProps = state => ({
  currentSectionId: state.currentSectionId,
  form: state.form,
  convention: state.convention,
});

const mapDispatchToProps = dispatch => ({
  previousSection: () => dispatch(actions.previousSection()),
  nextSection: () => dispatch(actions.nextSection()),
});

const FormPresenterContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormPresenter);

export default FormPresenterContainer;
