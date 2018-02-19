import { connect } from 'react-redux';
import actions from '../actions';
import FormFooter from '../components/FormFooter';

const mapStateToProps = state => ({
  currentSectionId: state.currentSectionId,
});

const mapDispatchToProps = dispatch => ({
  previousSection: (form, currentSectionChanged) => {
    dispatch(actions.previousSection(form, currentSectionChanged));
  },
  nextSection: (form, currentSectionChanged) => {
    dispatch(actions.nextSection(form, currentSectionChanged));
  },
  onInteract: itemIdentifier => dispatch(actions.interactedWithItem(itemIdentifier)),
});

const FormFooterContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormFooter);

export default FormFooterContainer;
