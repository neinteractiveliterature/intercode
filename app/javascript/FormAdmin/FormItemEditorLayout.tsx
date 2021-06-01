import { useContext, useMemo, useState, useCallback } from 'react';
import { useApolloClient, ApolloError } from '@apollo/client';
import { Prompt, useHistory, useRouteMatch } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import { useDebouncedState, ErrorDisplay } from '@neinteractiveliterature/litform';

import FormItemTools from './FormItemTools';
import FormItemEditorContent from './FormItemEditorContent';
import { FormEditorContext, FormItemEditorContext, FormEditorFormItem } from './FormEditorContexts';
import {
  buildFormItemInput,
  addGeneratedIds,
  parseTypedFormItemObject,
  TypedFormItem,
  findStandardItem,
} from './FormItemUtils';
import { PreviewFormItemQuery } from './queries';
import FormItemInput from '../FormPresenter/ItemInputs/FormItemInput';
import useAsyncFunction from '../useAsyncFunction';
import { useUpdateFormItemMutation } from './mutations.generated';

function addGeneratedIdsToFormItem(formItem: TypedFormItem): FormEditorFormItem {
  return {
    ...formItem,
    properties: addGeneratedIds(formItem.properties!),
    rendered_properties: addGeneratedIds(formItem.rendered_properties),
  } as FormEditorFormItem;
}

function FormItemEditorLayout() {
  const match = useRouteMatch<{ itemId: string; id: string; sectionId: string }>();
  const history = useHistory();
  const { convention, currentSection, formType, formItemsById } = useContext(FormEditorContext);
  const apolloClient = useApolloClient();
  const initialFormItem = useMemo(
    () => currentSection!.form_items.find((item) => item.id.toString() === match.params.itemId)!,
    [currentSection, match.params.itemId],
  );
  const [previewFormItem, setPreviewFormItem] = useState(() =>
    formItemsById.get(initialFormItem?.id ?? 0),
  );
  const refreshRenderedFormItem = useCallback(
    async (newFormItem) => {
      const response = await apolloClient.query({
        query: PreviewFormItemQuery,
        variables: { formSectionId: currentSection!.id, formItem: buildFormItemInput(newFormItem) },
        fetchPolicy: 'no-cache',
      });
      const responseFormItem = parseTypedFormItemObject(response.data.previewFormItem);
      setPreviewFormItem(responseFormItem);
    },
    [apolloClient, currentSection],
  );

  const [formItem, setFormItem] = useDebouncedState<FormEditorFormItem>(
    () => addGeneratedIdsToFormItem(initialFormItem),
    refreshRenderedFormItem,
    150,
  );

  const standardItem = findStandardItem(formType, initialFormItem?.identifier);

  const hasChanges = useMemo(
    () => !isEqual(buildFormItemInput(initialFormItem), buildFormItemInput(formItem)),
    [formItem, initialFormItem],
  );

  const [updateFormItemMutate] = useUpdateFormItemMutation();
  const [updateFormItem, updateError, updateInProgress] = useAsyncFunction(updateFormItemMutate);

  const saveFormItem = async () => {
    await updateFormItem({
      variables: {
        id: formItem.id,
        formItem: buildFormItemInput(formItem),
      },
    });

    history.push(`/admin_forms/${match.params.id}/edit/section/${match.params.sectionId}`);
  };

  return (
    <FormItemEditorContext.Provider
      value={{
        disabled: updateInProgress,
        formItem,
        setFormItem,
        standardItem,
        previewFormItem,
      }}
    >
      <Prompt message="Are you sure you want to discard changes to this item?" when={hasChanges} />
      <nav className="form-item-editor-tools bg-light p-2 border-right">
        <FormItemTools saveFormItem={saveFormItem} />
      </nav>
      <div className="form-item-editor-preview bg-info-light">
        <div className="bg-info text-white px-2 fw-bold">Preview</div>
        <div className="glow-inset-info p-2 overflow-auto">
          {previewFormItem && (
            <FormItemInput
              convention={convention}
              formItem={previewFormItem}
              onInteract={() => {}}
              onChange={() => {}}
              value={previewFormItem.default_value}
              valueInvalid={false}
            />
          )}
        </div>
      </div>
      <div className="form-item-editor-error">
        <ErrorDisplay graphQLError={updateError as ApolloError} />
      </div>
      <div className="form-item-editor-content p-2 overflow-auto">
        <FormItemEditorContent />
      </div>
    </FormItemEditorContext.Provider>
  );
}

export default FormItemEditorLayout;
