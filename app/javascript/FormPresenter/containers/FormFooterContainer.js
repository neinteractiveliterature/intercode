import { connect } from 'react-redux';
import actions from '../actions';
import FormFooter from '../components/FormFooter';

const mapStateToProps = state => ({
  currentSectionId: state.currentSectionId,
});

const mapDispatchToProps = dispatch => ({
  previousSection: form => dispatch(actions.previousSection(form)),
  nextSection: form => dispatch(actions.nextSection(form)),
  onInteract: itemIdentifier => dispatch(actions.interactedWithItem(itemIdentifier)),
});

const FormFooterContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormFooter);

export default FormFooterContainer;
