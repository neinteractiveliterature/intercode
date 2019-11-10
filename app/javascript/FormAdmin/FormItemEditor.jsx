import React, {
  useState, useEffect, useCallback, useContext,
} from 'react';
import PropTypes from 'prop-types';
import { useMutation, useApolloClient } from 'react-apollo-hooks';
import debounce from 'lodash-es/debounce';

import FormItemInput from '../FormPresenter/ItemInputs/FormItemInput';
import { PreviewFormItemQuery } from './queries.gql';
import StaticTextEditor from './ItemEditors/StaticTextEditor';
import { UpdateFormItem } from './mutations.gql';
import useAsyncFunction from '../useAsyncFunction';
import ErrorDisplay from '../ErrorDisplay';
import { buildFormItemInput, parseFormItemObject } from './FormItemUtils';
import useDebouncedState from '../useDebouncedState';
import FreeTextEditor from './ItemEditors/FreeTextEditor';
import DateEditor from './ItemEditors/DateEditor';
import AgeRestrictionsEditor from './ItemEditors/AgeRestrictionsEditor';
import EventEmailEditor from './ItemEditors/EventEmailEditor';
import TimespanEditor from './ItemEditors/TimespanEditor';
import MultipleChoiceEditor from './ItemEditors/MultipleChoiceEditor';
import generateChoiceId from './generateChoiceId';
import TimeblockPreferenceEditor from './ItemEditors/TimeblockPreferenceEditor';
import RegistrationPolicyItemEditor from './ItemEditors/RegistrationPolicyItemEditor';
import { FormSectionEditorContext, FormEditorContext, FormItemEditorContext } from './FormEditorContexts';

function FormItemEditor({ close, initialFormItem }) {
  const { convention, renderedFormItemsById } = useContext(FormEditorContext);
  const { currentSection } = useContext(FormSectionEditorContext);
  const apolloClient = useApolloClient();
  const [renderedFormItem, setRenderedFormItem] = useState(
    () => renderedFormItemsById.get(initialFormItem.id) || initialFormItem,
  );
  const refreshRenderedFormItem = useCallback(
    async (newFormItem) => {
      const response = await apolloClient.query({
        query: PreviewFormItemQuery,
        variables: { formSectionId: currentSection.id, formItem: buildFormItemInput(newFormItem) },
        fetchPolicy: 'no-cache',
      });
      const previewFormItem = parseFormItemObject(response.data.previewFormItem);
      setRenderedFormItem({ ...previewFormItem, properties: previewFormItem.rendered_properties });
    },
    [apolloClient, currentSection.id],
  );

  const [formItem, setFormItem] = useDebouncedState(
    () => ['choices', 'presets', 'timeblocks', 'omit_timeblocks'].reduce((memo, property) => {
      if (memo.properties[property] != null) {
        return {
          ...memo,
          properties: {
            ...memo.properties,
            [property]: memo.properties[property].map((item) => ({
              ...item,
              generatedId: generateChoiceId(),
            })),
          },
        };
      }

      return memo;
    }, initialFormItem),
    refreshRenderedFormItem,
    150,
  );
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
    const commonProps = { disabled };

    switch (formItem.item_type) {
      case 'age_restrictions':
        return <AgeRestrictionsEditor {...commonProps} />;
      case 'date':
        return <DateEditor {...commonProps} />;
      case 'event_email':
        return <EventEmailEditor {...commonProps} />;
      case 'free_text':
        return <FreeTextEditor {...commonProps} />;
      case 'multiple_choice':
        return <MultipleChoiceEditor {...commonProps} />;
      case 'registration_policy':
        return <RegistrationPolicyItemEditor {...commonProps} />;
      case 'static_text':
        return <StaticTextEditor {...commonProps} />;
      case 'timeblock_preference':
        return <TimeblockPreferenceEditor {...commonProps} />;
      case 'timespan':
        return <TimespanEditor {...commonProps} />;
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
            onInteract={() => {}}
            onChange={() => {}}
            value={renderedFormItem.default_value}
          />
        </div>
      </div>
      <FormItemEditorContext.Provider value={{ formItem, setFormItem, renderedFormItem }}>
        {renderEditor()}
      </FormItemEditorContext.Provider>
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
  initialFormItem: PropTypes.shape({
    id: PropTypes.number,
    identifier: PropTypes.string,
    properties: PropTypes.shape({
      choices: PropTypes.array,
    }).isRequired,
  }).isRequired,
};

export default FormItemEditor;
