/* eslint-disable react/no-multi-comp */

import React from 'react';
import PropTypes from 'prop-types';

import ErrorDisplay from '../../ErrorDisplay';
import Form from '../../Models/Form';
import FormItemInput from '../ItemInputs/FormItemInput';
import { formResponseValueIsComplete } from '../../Models/FormItem';
import ItemInteractionTracker from '../ItemInteractionTracker';

class FormSection extends React.Component {
  static propTypes = {
    convention: PropTypes.shape({
      starts_at: PropTypes.string.isRequired,
      ends_at: PropTypes.string.isRequired,
      timezone_name: PropTypes.string.isRequired,
    }).isRequired,
    form: Form.propType.isRequired,
    section: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
    interactWithItem: PropTypes.func.isRequired,
    hasInteractedWithItem: PropTypes.func.isRequired,
    response: PropTypes.shape({}).isRequired,
    responseValuesChanged: PropTypes.func.isRequired,
    errors: PropTypes.shape({}).isRequired,
  }

  constructor(props) {
    super(props);
    this.itemRefs = {};
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.section.id !== this.props.section.id) {
      this.itemRefs = {};
    }
  }

  scrollToItem = (item) => {
    const itemRef = this.itemRefs[item.identifier];
    if (itemRef) {
      itemRef.scrollIntoView({ behavior: 'smooth' });
    }
  }

  responseValueChanged = (field, value) => {
    this.props.responseValuesChanged({ [field]: value });
  }

  render = () => {
    const {
      convention,
      form,
      section,
      interactWithItem,
      hasInteractedWithItem,
      response,
      errors,
    } = this.props;

    const items = form.getItemsInSection(section.id).map((item) => {
      const itemErrors = errors[item.identifier] || [];
      const errorsForDisplay = (itemErrors.length > 0 ? itemErrors.join(', ') : null);

      return (
        <div key={item.id} ref={(component) => { this.itemRefs[item.identifier] = component; }}>
          <FormItemInput
            formItem={item}
            convention={convention}
            valueInvalid={
              item.identifier
              && hasInteractedWithItem(item.identifier)
              && !formResponseValueIsComplete(item, response[item.identifier])
            }
            value={item.identifier ? response[item.identifier] : null}
            onChange={this.responseValueChanged}
            onInteract={interactWithItem}
          />
          <ErrorDisplay stringError={errorsForDisplay} />
        </div>
      );
    });

    return (
      <div>
        {items}
      </div>
    );
  }
}

const FormSectionInteractionWrapper = WrappedComponent => class Wrapper extends React.Component {
  getWrappedInstance = () => this.wrappedInstance

  render = () => (
    <ItemInteractionTracker.Interactor>
      {({ interactWithItem, hasInteractedWithItem }) => (
        <WrappedComponent
          interactWithItem={interactWithItem}
          hasInteractedWithItem={hasInteractedWithItem}
          ref={(instance) => { this.wrappedInstance = instance; }}
          {...this.props}
        />
      )}
    </ItemInteractionTracker.Interactor>
  )
};

export default FormSectionInteractionWrapper(FormSection);
export { FormSection as PureFormSection };
