import { connect } from 'react-redux';
import FormPresenter from '../components/FormPresenter';

const mapStateToProps = state => ({
  currentSectionId: state.currentSectionId,
});

const FormPresenterContainer = connect(mapStateToProps)(FormPresenter);

export default FormPresenterContainer;
