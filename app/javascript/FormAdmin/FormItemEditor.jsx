import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useApolloClient } from 'react-apollo-hooks';
import debounce from 'lodash-es/debounce';

import FormTypes from './form_types.json';
import FormItemInput from '../FormPresenter/ItemInputs/FormItemInput';
import { PreviewFormItemQuery } from './queries.gql';
import StaticTextEditor from './ItemEditors/StaticTextEditor';
import { UpdateFormItem } from './mutations.gql';
import useAsyncFunction from '../useAsyncFunction';
import ErrorDisplay from '../ErrorDisplay';
import { buildFormItemInput, parseFormItemObject } from './FormItemUtils';
import useDebouncedState from '../useDebouncedState';
import FreeTextEditor from './ItemEditors/FreeTextEditor';

function FormItemEditor({
  close, convention, form, formSectionId, initialFormItem, initialRenderedFormItem,
}) {
  const apolloClient = useApolloClient();
  const [renderedFormItem, setRenderedFormItem] = useState(initialRenderedFormItem);
  const refreshRenderedFormItem = useCallback(
    async (newFormItem) => {
      const response = await apolloClient.query({
        query: PreviewFormItemQuery,
        variables: { formSectionId, formItem: buildFormItemInput(newFormItem) },
        fetchPolicy: 'no-cache',
      });
      const previewFormItem = parseFormItemObject(response.data.previewFormItem);
      setRenderedFormItem({ ...previewFormItem, properties: previewFormItem.rendered_properties });
    },
    [apolloClient, formSectionId],
  );

  const [formItem, setFormItem] = useDebouncedState(initialFormItem, refreshRenderedFormItem, 150);
  const formType = FormTypes[form.form_type];
  const specialItem = ((formType || {}).special_items || {})[formItem.identifier];
  const [updateFormItemMutate] = useMutation(UpdateFormItem);
  const [updateFormItem, updateError, updateInProgress] = useAsyncFunction(updateFormItemMutate);

  const disabled = updateInProgress;

  useEffect(
    () => {
      debounce(refreshRenderedFormItem, 300);
    },
    [formItem, refreshRenderedFormItem],
  );

  const renderEditor = () => {
    const commonProps = {
      form, formItem, onChange: setFormItem, disabled,
    };
    switch (formItem.item_type) {
      // case 'age_restrictions':
      //   return <AgeRestrictionsInput {...commonProps} />;
      // case 'date':
      //   return <DateItemInput {...commonProps} />;
      // case 'event_email':
      //   return <EventEmailInput {...commonProps} convention={convention} />;
      case 'free_text':
        return <FreeTextEditor {...commonProps} />;
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
        return null;
    }
  };

  const saveClicked = async () => {
    await updateFormItem({
      variables: {
        id: formItem.id,
        formItem: buildFormItemInput(formItem),
      },
    });

    close();
  };

  return (
    <div className="bg-info-light rounded glow-info p-2 mb-2">
      <div className="bg-white border border-info rounded mb-2">
        <div className="bg-info text-white px-2 font-weight-bold">Preview</div>
        <div className="p-2">
          <FormItemInput
            convention={convention}
            formItem={renderedFormItem}
            onInteract={() => { }}
          />
        </div>
      </div>
      {renderEditor()}
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
  formSectionId: PropTypes.number.isRequired,
  initialFormItem: PropTypes.shape({
    identifier: PropTypes.string,
  }).isRequired,
  initialRenderedFormItem: PropTypes.shape({}).isRequired,
};

export default FormItemEditor;
