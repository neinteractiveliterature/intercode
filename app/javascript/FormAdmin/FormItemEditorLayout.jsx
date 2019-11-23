import React, {
  useContext, useMemo, useState, useCallback,
} from 'react';
import { useApolloClient, useMutation } from 'react-apollo-hooks';
import { Prompt, useHistory, useRouteMatch } from 'react-router-dom';
import isEqual from 'lodash-es/isEqual';

import FormItemTools from './FormItemTools';
import FormItemEditorContent from './FormItemEditorContent';
import { FormEditorContext, FormItemEditorContext } from './FormEditorContexts';
import { parseFormItemObject, buildFormItemInput, addGeneratedIds } from './FormItemUtils';
import { PreviewFormItemQuery } from './queries.gql';
import { UpdateFormItem } from './mutations.gql';
import useDebouncedState from '../useDebouncedState';
import FormItemInput from '../FormPresenter/ItemInputs/FormItemInput';
import useAsyncFunction from '../useAsyncFunction';
import ErrorDisplay from '../ErrorDisplay';

function FormItemEditorLayout() {
  const match = useRouteMatch();
  const history = useHistory();
  const {
    convention, currentSection, formType, renderedFormItemsById,
  } = useContext(FormEditorContext);
  const apolloClient = useApolloClient();
  const initialFormItem = useMemo(
    () => currentSection.form_items.find((item) => item.id.toString() === match.params.itemId),
    [currentSection, match.params.itemId],
  );
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
    () => ({
      ...initialFormItem,
      properties: addGeneratedIds(initialFormItem.properties),
    }),
    refreshRenderedFormItem,
    150,
  );

  const standardItem = (formType.standard_items || {})[initialFormItem.identifier];

  const hasChanges = useMemo(
    () => !isEqual(buildFormItemInput(initialFormItem), buildFormItemInput(formItem)),
    [formItem, initialFormItem],
  );

  const [updateFormItemMutate] = useMutation(UpdateFormItem);
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
        disabled: updateInProgress, formItem, setFormItem, standardItem, renderedFormItem,
      }}
    >
      <Prompt
        message="Are you sure you want to discard changes to this item?"
        when={hasChanges}
      />
      <div className="row m-0 flex-grow-1">
        <nav className="col-3 bg-light p-2">
          <FormItemTools saveFormItem={saveFormItem} />
        </nav>
        <div className="col px-0 border">
          <div className="d-flex flex-column overflow-hidden">
            <div className="bg-info-light mb-2 sticky-top">
              <div className="bg-info text-white px-2 font-weight-bold">Preview</div>
              <div className="glow-inset-info">
                <div className="p-2 overflow-auto" style={{ maxHeight: '40vh' }}>
                  <FormItemInput
                    convention={convention}
                    formItem={renderedFormItem}
                    onInteract={() => { }}
                    onChange={() => { }}
                    value={renderedFormItem.default_value}
                  />
                </div>
              </div>
            </div>
            <ErrorDisplay graphQLError={updateError} />
            <div className="p-2 overflow-auto">
              <FormItemEditorContent />
            </div>
          </div>
        </div>
      </div>
    </FormItemEditorContext.Provider>
  );
}

export default FormItemEditorLayout;
