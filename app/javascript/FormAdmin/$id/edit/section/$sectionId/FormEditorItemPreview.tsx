import { useContext } from 'react';
import { Link, useParams, useSubmit } from 'react-router-dom';
import classnames from 'classnames';
import { useConfirm, ButtonWithTooltip, ErrorDisplay } from '@neinteractiveliterature/litform';
import { useSortable } from '@dnd-kit/sortable';
import { FormEditorContext, FormEditorForm } from 'FormAdmin/FormEditorContexts';
import { findStandardItem, StandardItem, TypedFormItem } from 'FormAdmin/FormItemUtils';
import { getSortableStyle } from 'SortableUtils';
import FormItemInput from 'FormPresenter/ItemInputs/FormItemInput';
import styles from 'styles/form_editor.module.scss';

function describeFormItemForDelete(formItem: TypedFormItem, standardItem: StandardItem | undefined) {
  if (standardItem) {
    return `the “${standardItem.description}” item`;
  }

  if (formItem.item_type === 'static_text') {
    return 'this static text item';
  }

  return `the custom item “${formItem.identifier}”`;
}

export type FormEditorItemPreviewProps = {
  formSection: FormEditorForm['form_sections'][number];
  formItem: TypedFormItem;
};

function FormEditorItemPreview({ formSection, formItem }: FormEditorItemPreviewProps): JSX.Element {
  const confirm = useConfirm();
  const params = useParams<{ id: string; sectionId: string }>();
  const { convention, formType, formTypeIdentifier, formItemsById } = useContext(FormEditorContext);
  const renderedFormItem = formItemsById.get(formItem.id);
  const submit = useSubmit();

  const { setNodeRef, isDragging, attributes, listeners, transform, transition } = useSortable({
    id: formItem.id.toString(),
  });

  const standardItem = findStandardItem(formType, formItem.identifier);

  const style = getSortableStyle(transform, transition, isDragging);

  return (
    <div className={classnames('d-flex align-items-start bg-white', { 'opacity-50': isDragging })} style={style}>
      <div className="me-2 mt-2" {...attributes} {...listeners} ref={setNodeRef}>
        <span className="visually-hidden">Drag to reorder</span>
        <i className="cursor-grab bi-grip-vertical" />
      </div>
      <div className={`form-editor-item ${styles.formEditorItem} flex-grow-1`}>
        <Link
          className={`form-editor-item-overlay ${styles.formEditorItemOverlay}`}
          to={`/admin_forms/${params.id}/edit/section/${params.sectionId}/item/${formItem.id}`}
        >
          {formItem.identifier && (
            <div className={`form-editor-item-identifier ${styles.formEditorItemIdentifier}`}>
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

        {renderedFormItem && (
          <FormItemInput
            convention={convention}
            formItem={renderedFormItem}
            formTypeIdentifier={formTypeIdentifier}
            onInteract={() => {}}
            onChange={() => {}}
            value={formItem.default_value}
            valueInvalid={false}
          />
        )}
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
                prompt: `Are you sure you want to delete ${describeFormItemForDelete(formItem, standardItem)}?`,
                action: () =>
                  submit(
                    {},
                    {
                      method: 'DELETE',
                      action: `/admin_forms/${params.id}/edit/section/${formSection.id}/item/${formItem.id}?index`,
                    },
                  ),
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
