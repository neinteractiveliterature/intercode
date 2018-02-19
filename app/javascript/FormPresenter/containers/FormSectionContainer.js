import { connect } from 'react-redux';
import actions from '../actions';
import FormSection from '../components/FormSection';

const mapStateToProps = state => ({
  interactedItems: state.interactedItems,
});

const mapDispatchToProps = dispatch => ({
  interactedWithItem: itemIdentifier => dispatch(actions.interactedWithItem(itemIdentifier)),
});

const FormSectionContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true },
)(FormSection);

export default FormSectionContainer;
