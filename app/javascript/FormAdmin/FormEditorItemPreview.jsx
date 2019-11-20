import React, { useContext, useCallback } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useMutation } from 'react-apollo-hooks';

import { DeleteFormItem, MoveFormItem } from './mutations.gql';
import FormItemInput from '../FormPresenter/ItemInputs/FormItemInput';
import { FormEditorContext } from './FormEditorContexts';
import useSortable from '../useSortable';
import { serializeParsedFormItem, mutationUpdaterForFormSection } from './FormItemUtils';
import ButtonWithTooltip from '../UIComponents/ButtonWithTooltip';
import { useConfirm } from '../ModalDialogs/Confirm';
import ErrorDisplay from '../ErrorDisplay';

function describeFormItemForDelete(formItem, standardItem) {
  if (standardItem) {
    return `the “${standardItem.description}” item`;
  }

  if (formItem.item_type === 'static_text') {
    return 'this static text item';
  }

  return `the custom item “${formItem.identifier}”`;
}

function FormEditorItemPreview({ formItem, index }) {
  const confirm = useConfirm();
  const match = useRouteMatch();
  const {
    convention, currentSection, form, formType, renderedFormItemsById,
  } = useContext(FormEditorContext);
  const renderedFormItem = renderedFormItemsById.get(formItem.id);
  const [moveFormItem] = useMutation(MoveFormItem);
  const [deleteFormItem] = useMutation(DeleteFormItem, {
    update: mutationUpdaterForFormSection(form.id, currentSection.id, (section) => ({
      ...section,
      form_items: section.form_items.filter((item) => item.id !== formItem.id),
    })),
  });

  const moveItem = useCallback(
    (dragIndex, hoverIndex) => {
      const draggedItem = currentSection.form_items[dragIndex];
      const optimisticItems = currentSection.form_items.map(serializeParsedFormItem);
      optimisticItems.splice(dragIndex, 1);
      optimisticItems.splice(hoverIndex, 0, serializeParsedFormItem(draggedItem));

      const optimisticResponse = {
        moveFormItem: {
          __typename: 'Mutation',
          form_section: {
            ...currentSection,
            form_items: optimisticItems.map((item, itemIndex) => ({
              ...item,
              position: itemIndex + 1,
            })),
          },
        },
      };

      moveFormItem({
        variables: {
          id: draggedItem.id,
          formSectionId: currentSection.id,
          destinationIndex: hoverIndex,
        },
        optimisticResponse,
      });
    },
    [currentSection, moveFormItem],
  );

  const [ref, drag, { isDragging }] = useSortable(index, moveItem, 'formItem');

  const standardItem = ((formType || {}).standard_items || {})[formItem.identifier];

  return (
    <div ref={ref} className={classnames('d-flex align-items-start bg-white', { 'opacity-50': isDragging })}>
      <div className="mr-2 mt-2">
        <span className="sr-only">Drag to reorder</span>
        <i style={{ cursor: isDragging ? 'grabbing' : 'grab' }} className="fa fa-bars" ref={drag} />
      </div>
      <div className="form-editor-item flex-grow-1">
        <Link
          className="form-editor-item-overlay"
          to={`/admin_forms/${match.params.id}/edit/section/${match.params.sectionId}/item/${formItem.id}`}
        >
          {formItem.identifier && (
            <div className="form-editor-item-identifier">
              {standardItem
                ? (
                  <>
                    <i className="fa fa-wrench" />
                    {' '}
                    {standardItem.description}
                  </>
                )
                : (
                  <>
                    <i className="fa fa-tag" />
                    {' '}
                    {formItem.identifier}
                  </>
                )}
            </div>
          )}
          <div className="font-weight-bold">Click to edit</div>
        </Link>

        <FormItemInput
          convention={convention}
          formItem={renderedFormItem}
          onInteract={() => { }}
          value={formItem.default_value}
        />
      </div>
      <div className="ml-2 mt-2">
        {(standardItem && standardItem.required)
          ? (
            <ButtonWithTooltip
              buttonProps={{ className: 'btn btn-outline-danger btn-sm', disabled: true }}
              tooltipContent={`${standardItem.description} is required for ${formType.description}`}
            >
              <span className="sr-only">Delete item</span>
              <i className="fa fa-trash-o" />
            </ButtonWithTooltip>
          )
          : (
            <button
              className="btn btn-outline-danger btn-sm"
              type="button"
              onClick={() => confirm({
                prompt: `Are you sure you want to delete ${describeFormItemForDelete(formItem, standardItem)}?`,
                action: () => deleteFormItem({ variables: { id: formItem.id } }),
                renderError: (error) => <ErrorDisplay graphQLError={error} />,
              })}
            >
              <span className="sr-only">Delete item</span>
              <i className="fa fa-trash-o" />
            </button>
          )}
      </div>
    </div>
  );
}

FormEditorItemPreview.propTypes = {
  formItem: PropTypes.shape({
    id: PropTypes.number.isRequired,
    default_value: PropTypes.any,
    identifier: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default FormEditorItemPreview;
