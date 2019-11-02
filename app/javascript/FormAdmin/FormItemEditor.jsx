import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo-hooks';

import FormTypes from './form_types.json';
import FormItemInput from '../FormPresenter/ItemInputs/FormItemInput';
import StaticTextEditor from './ItemEditors/StaticTextEditor';
import StaticTextMetadataEditor from './ItemMetadataEditors/StaticTextMetadataEditor';
import { UpdateFormItem } from './mutations.gql';
import useAsyncFunction from '../useAsyncFunction';
import ErrorDisplay from '../ErrorDisplay';

function FormItemEditor({
  close, convention, form, initialFormItem, renderedFormItem,
}) {
  const [formItem, setFormItem] = useState(initialFormItem);
  const formType = FormTypes[form.form_type];
  const specialItem = ((formType || {}).special_items || {})[formItem.identifier];
  const [updateFormItemMutate] = useMutation(UpdateFormItem);
  const [updateFormItem, updateError, updateInProgress] = useAsyncFunction(updateFormItemMutate);

  const disabled = updateInProgress;

  const renderEditorContent = () => {
    const commonProps = { formItem, onChange: setFormItem, disabled };
    switch (formItem.item_type) {
      // case 'age_restrictions':
      //   return <AgeRestrictionsInput {...commonProps} />;
      // case 'date':
      //   return <DateItemInput {...commonProps} />;
      // case 'event_email':
      //   return <EventEmailInput {...commonProps} convention={convention} />;
      // case 'free_text':
      //   return <FreeTextItemInput {...commonProps} />;
      // case 'multiple_choice':
      //   return <MultipleChoiceItemInput {...commonProps} />;
      // case 'registration_policy':
      //   return <RegistrationPolicyItemInput {...commonProps} />;
      case 'static_text':
        return <StaticTextEditor {...commonProps} />;
      // case 'timeblock_preference':
      //   return <TimeblockPreferenceItemInput {...commonProps} convention={convention} />;
      // case 'timespan':
      //   return <TimespanItemInput {...commonProps} />;
      default:
        return (
          <FormItemInput
            convention={convention}
            formItem={renderedFormItem}
            onInteract={() => { }}
          />
        );
    }
  };

  const renderMetadataEditor = () => {
    const commonProps = { formItem, onChange: setFormItem, disabled };
    switch (formItem.item_type) {
      // case 'age_restrictions':
      //   return <AgeRestrictionsInput {...commonProps} />;
      // case 'date':
      //   return <DateItemInput {...commonProps} />;
      // case 'event_email':
      //   return <EventEmailInput {...commonProps} convention={convention} />;
      // case 'free_text':
      //   return <FreeTextItemInput {...commonProps} />;
      // case 'multiple_choice':
      //   return <MultipleChoiceItemInput {...commonProps} />;
      // case 'registration_policy':
      //   return <RegistrationPolicyItemInput {...commonProps} />;
      case 'static_text':
        return <StaticTextMetadataEditor {...commonProps} />;
      // case 'timeblock_preference':
      //   return <TimeblockPreferenceItemInput {...commonProps} convention={convention} />;
      // case 'timespan':
      //   return <TimespanItemInput {...commonProps} />;
      default:
        return null;
    }
  };

  const saveClicked = async () => {
    await updateFormItem({
      variables: {
        id: formItem.id,
        formItem: {
          identifier: formItem.identifier,
          item_type: formItem.item_type,
          admin_description: formItem.admin_description,
          public_description: formItem.public_description,
          default_value: formItem.default_value ? JSON.stringify(formItem.default_value) : null,
          properties: JSON.stringify(formItem.properties),
        },
      },
    });

    close();
  };

  return (
    <div className="form-item-editor mb-2">
      <div className="bg-white rounded p-1">
        {renderEditorContent()}
      </div>
      {renderMetadataEditor()}
      <ErrorDisplay graphQLError={updateError} />
      <div className="mt-2 text-right">
        <button
          type="button"
          className="btn btn-secondary mr-2"
          onClick={close}
          disabled={disabled}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={saveClicked}
          disabled={disabled}
        >
          Save
        </button>
      </div>
    </div>
  );
}

FormItemEditor.propTypes = {
  close: PropTypes.func.isRequired,
  convention: PropTypes.shape({}).isRequired,
  form: PropTypes.shape({
    form_type: PropTypes.string.isRequired,
  }).isRequired,
  initialFormItem: PropTypes.shape({
    identifier: PropTypes.string,
  }).isRequired,
  renderedFormItem: PropTypes.shape({}).isRequired,
};

export default FormItemEditor;
