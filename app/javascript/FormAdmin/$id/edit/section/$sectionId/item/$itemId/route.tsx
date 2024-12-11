import { useContext, useMemo, useState, useCallback } from 'react';
import { useApolloClient, ApolloError } from '@apollo/client';
import { ActionFunction, redirect, useFetcher, useParams } from 'react-router';
// TODO: uncomment this when re-adding Prompt support below
// import isEqual from 'lodash/isEqual';
import { useDebouncedState, ErrorDisplay } from '@neinteractiveliterature/litform';

import { useTranslation } from 'react-i18next';
import {
  addGeneratedIds,
  buildFormItemInput,
  findStandardItem,
  ParsedFormItem,
  parseTypedFormItemObject,
  TypedFormItem,
} from 'FormAdmin/FormItemUtils';
import { FormEditorContext, FormEditorFormItem, FormItemEditorContext } from 'FormAdmin/FormEditorContexts';
import { PreviewFormItemQueryDocument } from 'FormAdmin/queries.generated';
import FormItemTools from 'FormAdmin/FormItemTools';
import FormItemInput from 'FormPresenter/ItemInputs/FormItemInput';
import { client } from 'useIntercodeApolloClient';
import { DeleteFormItemDocument, UpdateFormItemDocument } from 'FormAdmin/mutations.generated';
import { FormItem } from 'graphqlTypes.generated';
import FormItemEditorContent from './FormItemEditorContent';
import styles from 'styles/form_editor.module.scss';

export async function action({ request, params: { id, sectionId, itemId } }) {
  try {
    if (request.method === 'PATCH') {
      const json = await request.json();
      await client.mutate({
        mutation: UpdateFormItemDocument,
        variables: {
          id: itemId,
          formItem: json,
        },
      });
      return redirect(`/admin_forms/${id}/edit/section/${sectionId}`);
    } else if (request.method === 'DELETE') {
      await client.mutate({
        mutation: DeleteFormItemDocument,
        variables: {
          id: itemId,
        },
        update: (cache) => {
          cache.modify<FormItem>({
            id: cache.identify({ __typename: 'FormItem', id: itemId }),
            fields: (field, { DELETE }) => DELETE,
          });
        },
      });
      return redirect(`/admin_forms/${id}/edit/section/${sectionId}`);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
}

function addGeneratedIdsToFormItem(formItem: TypedFormItem): FormEditorFormItem {
  return {
    ...formItem,
    properties: addGeneratedIds(formItem.properties),
    rendered_properties: addGeneratedIds(formItem.rendered_properties),
  } as FormEditorFormItem;
}

function FormItemEditorLayout(): JSX.Element {
  const { t } = useTranslation();
  const params = useParams<{ itemId: string; id: string; sectionId: string }>();
  const { convention, currentSection, form, formType, formTypeIdentifier, formItemsById } =
    useContext(FormEditorContext);
  const apolloClient = useApolloClient();
  const initialFormItem = useMemo(
    () => currentSection?.form_items.find((item) => item.id === params.itemId),
    [currentSection, params.itemId],
  );
  const [previewFormItem, setPreviewFormItem] = useState(() => formItemsById.get(initialFormItem?.id ?? ''));
  const refreshRenderedFormItem = useCallback(
    async (newFormItem: FormEditorFormItem) => {
      if (!currentSection?.id) {
        return;
      }

      const response = await apolloClient.query({
        query: PreviewFormItemQueryDocument,
        variables: {
          formId: form.id,
          formSectionId: currentSection.id,
          formItem: buildFormItemInput(newFormItem as ParsedFormItem<Record<string, unknown>, unknown>),
        },
        fetchPolicy: 'no-cache',
      });
      const responseFormItem = parseTypedFormItemObject(response.data.convention.form.form_section.preview_form_item);
      setPreviewFormItem(responseFormItem);
    },
    [apolloClient, currentSection?.id, form.id],
  );
  const updateFetcher = useFetcher();
  const updateError = updateFetcher.data instanceof Error ? updateFetcher.data : undefined;
  const updateInProgress = updateFetcher.state !== 'idle';

  const [formItem, setFormItem] = useDebouncedState<FormEditorFormItem | undefined>(
    () => (initialFormItem ? addGeneratedIdsToFormItem(initialFormItem) : undefined),
    refreshRenderedFormItem,
    150,
  );

  const standardItem = findStandardItem(formType, initialFormItem?.identifier);

  // TODO: uncomment this when re-adding the Prompt support below
  // const hasChanges = useMemo(
  //   () =>
  //     formItem && initialFormItem
  //       ? !isEqual(buildFormItemInput<unknown>(initialFormItem), buildFormItemInput<unknown>(formItem))
  //       : false,
  //   [formItem, initialFormItem],
  // );

  const saveFormItem = async () => {
    if (!formItem) {
      throw new Error('No form item to save');
    }

    updateFetcher.submit(buildFormItemInput<unknown>(formItem), { method: 'PATCH', encType: 'application/json' });
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
      {/* TODO: re-add this once https://github.com/remix-run/react-router/issues/8139 is fixed */}
      {/* <Prompt message="Are you sure you want to discard changes to this item?" when={hasChanges} /> */}
      <nav className={`form-item-editor-tools ${styles.formItemEditorTools} bg-light p-2 border-right`}>
        <FormItemTools saveFormItem={saveFormItem} />
      </nav>
      <div className={`form-item-editor-preview ${styles.formItemEditorPreview} bg-info-light`}>
        <div className="bg-info text-white px-2 fw-bold">{t('admin.forms.editFormItem.previewHeader')}</div>
        <div className="glow-inset-info p-2 overflow-auto">
          {previewFormItem && (
            <FormItemInput
              convention={convention}
              formItem={previewFormItem}
              formTypeIdentifier={formTypeIdentifier}
              onInteract={() => {}}
              onChange={() => {}}
              value={previewFormItem.default_value}
              valueInvalid={false}
            />
          )}
        </div>
      </div>
      <div className={`form-item-editor-error ${styles.formItemEditorError}`}>
        <ErrorDisplay graphQLError={updateError as ApolloError} />
      </div>
      <div className={`form-item-editor-content ${styles.formItemEditorContent} bg-white p-2 overflow-auto`}>
        <FormItemEditorContent />
      </div>
    </FormItemEditorContext.Provider>
  );
}

export default FormItemEditorLayout;
