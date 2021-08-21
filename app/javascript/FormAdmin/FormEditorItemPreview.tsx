import { useContext, useCallback } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import classnames from 'classnames';
import { useConfirm, ButtonWithTooltip, ErrorDisplay } from '@neinteractiveliterature/litform';

import FormItemInput from '../FormPresenter/ItemInputs/FormItemInput';
import { FormEditorContext } from './FormEditorContexts';
import useSortable, { buildOptimisticArrayForMove } from '../useSortable';
import {
  mutationUpdaterForFormSection,
  TypedFormItem,
  serializeParsedFormItem,
  findStandardItem,
} from './FormItemUtils';
import { useMoveFormItemMutation, useDeleteFormItemMutation } from './mutations.generated';

function describeFormItemForDelete(formItem: TypedFormItem, standardItem: any) {
  if (standardItem) {
    return `the “${standardItem.description}” item`;
  }

  if (formItem.item_type === 'static_text') {
    return 'this static text item';
  }

  return `the custom item “${formItem.identifier}”`;
}

export type FormEditorItemPreviewProps = {
  formItem: TypedFormItem;
  index: number;
};

function FormEditorItemPreview({ formItem, index }: FormEditorItemPreviewProps) {
  const confirm = useConfirm();
  const match = useRouteMatch<{ id: string; sectionId: string }>();
  const { convention, currentSection, form, formType, formTypeIdentifier, formItemsById } =
    useContext(FormEditorContext);
  const renderedFormItem = formItemsById.get(formItem.id)!;
  const [moveFormItem] = useMoveFormItemMutation();
  const [deleteFormItem] = useDeleteFormItemMutation({
    update: mutationUpdaterForFormSection(form.id, currentSection!.id, (section) => ({
      ...section,
      form_items: section.form_items.filter((item) => item.id !== formItem.id),
    })),
  });

  const moveItem = useCallback(
    (dragIndex, hoverIndex) => {
      const optimisticItems = buildOptimisticArrayForMove(
        currentSection!.form_items.map(serializeParsedFormItem),
        dragIndex,
        hoverIndex,
      );

      moveFormItem({
        variables: {
          id: currentSection!.form_items[dragIndex].id,
          formSectionId: currentSection!.id,
          destinationIndex: hoverIndex,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          moveFormItem: {
            __typename: 'MoveFormItemPayload',
            form_section: {
              ...currentSection!,
              form_items: optimisticItems,
            },
          },
        },
      });
    },
    [currentSection, moveFormItem],
  );

  const [ref, drag, { isDragging }] = useSortable<HTMLDivElement>(index, moveItem, 'formItem');

  const standardItem = findStandardItem(formType, formItem.identifier);

  return (
    <div
      ref={ref}
      className={classnames('d-flex align-items-start bg-white', { 'opacity-50': isDragging })}
    >
      <div className="me-2 mt-2">
        <span className="visually-hidden">Drag to reorder</span>
        <i style={{ cursor: isDragging ? 'grabbing' : 'grab' }} className="bi-list" ref={drag} />
      </div>
      <div className="form-editor-item flex-grow-1">
        <Link
          className="form-editor-item-overlay"
          to={`/admin_forms/${match.params.id}/edit/section/${match.params.sectionId}/item/${formItem.id}`}
        >
          {formItem.identifier && (
            <div className="form-editor-item-identifier">
              {standardItem ? (
                <>
                  <i className="bi-wrench" /> {standardItem.description}
                </>
              ) : (
                <>
                  <i className="bi-tag-fill" /> {formItem.identifier}
                </>
              )}
            </div>
          )}
          <div className="fw-bold">Click to edit</div>
        </Link>

        <FormItemInput
          convention={convention}
          formItem={renderedFormItem}
          formTypeIdentifier={formTypeIdentifier}
          onInteract={() => {}}
          onChange={() => {}}
          value={formItem.default_value}
          valueInvalid={false}
        />
      </div>
      <div className="ms-2 mt-2">
        {standardItem && standardItem.required ? (
          <ButtonWithTooltip
            buttonProps={{ className: 'btn btn-outline-danger btn-sm', disabled: true }}
            tooltipContent={`${standardItem.description} is required for ${formType.description}`}
          >
            <span className="visually-hidden">Delete item</span>
            <i className="bi-trash" />
          </ButtonWithTooltip>
        ) : (
          <button
            className="btn btn-outline-danger btn-sm"
            type="button"
            onClick={() =>
              confirm({
                prompt: `Are you sure you want to delete ${describeFormItemForDelete(
                  formItem,
                  standardItem,
                )}?`,
                action: () => deleteFormItem({ variables: { id: formItem.id } }),
                renderError: (error) => <ErrorDisplay graphQLError={error} />,
              })
            }
          >
            <span className="visually-hidden">Delete item</span>
            <i className="bi-trash" />
          </button>
        )}
      </div>
    </div>
  );
}

export default FormEditorItemPreview;
