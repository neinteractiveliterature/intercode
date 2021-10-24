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
import FormItemInput from '../FormPresenter/ItemInputs/FormItemInput';
import useAsyncFunction from '../useAsyncFunction';
import { useUpdateFormItemMutation } from './mutations.generated';
import {
  PreviewFormItemQueryData,
  PreviewFormItemQueryDocument,
  PreviewFormItemQueryVariables,
} from './queries.generated';

function addGeneratedIdsToFormItem(formItem: TypedFormItem): FormEditorFormItem {
  return {
    ...formItem,
    properties: addGeneratedIds(formItem.properties),
    rendered_properties: addGeneratedIds(formItem.rendered_properties),
  } as FormEditorFormItem;
}

function FormItemEditorLayout(): JSX.Element {
  const match = useRouteMatch<{ itemId: string; id: string; sectionId: string }>();
  const history = useHistory();
  const { convention, currentSection, form, formType, formTypeIdentifier, formItemsById } =
    useContext(FormEditorContext);
  const apolloClient = useApolloClient();
  const initialFormItem = useMemo(
    () => currentSection?.form_items.find((item) => item.id === match.params.itemId),
    [currentSection, match.params.itemId],
  );
  const [previewFormItem, setPreviewFormItem] = useState(() => formItemsById.get(initialFormItem?.id ?? ''));
  const refreshRenderedFormItem = useCallback(
    async (newFormItem) => {
      if (!currentSection?.id) {
        return;
      }

      const response = await apolloClient.query<PreviewFormItemQueryData, PreviewFormItemQueryVariables>({
        query: PreviewFormItemQueryDocument,
        variables: { formId: form.id, formSectionId: currentSection.id, formItem: buildFormItemInput(newFormItem) },
        fetchPolicy: 'no-cache',
      });
      const responseFormItem = parseTypedFormItemObject(response.data.convention.form.form_section.preview_form_item);
      setPreviewFormItem(responseFormItem);
    },
    [apolloClient, currentSection?.id, form.id],
  );

  const [formItem, setFormItem] = useDebouncedState<FormEditorFormItem | undefined>(
    () => (initialFormItem ? addGeneratedIdsToFormItem(initialFormItem) : undefined),
    refreshRenderedFormItem,
    150,
  );

  const standardItem = findStandardItem(formType, initialFormItem?.identifier);

  const hasChanges = useMemo(
    () =>
      formItem && initialFormItem
        ? !isEqual(buildFormItemInput<unknown>(initialFormItem), buildFormItemInput<unknown>(formItem))
        : false,
    [formItem, initialFormItem],
  );

  const [updateFormItemMutate] = useUpdateFormItemMutation();
  const [updateFormItem, updateError, updateInProgress] = useAsyncFunction(updateFormItemMutate);

  const saveFormItem = async () => {
    if (!formItem) {
      throw new Error('No form item to save');
    }

    await updateFormItem({
      variables: {
        id: formItem.id,
        formItem: buildFormItemInput<unknown>(formItem),
      },
    });

    history.push(`/admin_forms/${match.params.id}/edit/section/${match.params.sectionId}`);
  };

  if (!formItem) {
    return <></>;
  }

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
              formTypeIdentifier={formTypeIdentifier}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onInteract={() => {}}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
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
      <div className="form-item-editor-content bg-white p-2 overflow-auto">
        <FormItemEditorContent />
      </div>
    </FormItemEditorContext.Provider>
  );
}

export default FormItemEditorLayout;
