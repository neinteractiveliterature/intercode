import { useContext } from 'react';
import classnames from 'classnames';
import { ButtonWithTooltip } from '@neinteractiveliterature/litform';
import { FormEditorContext } from 'FormAdmin/FormEditorContexts';
import FormItemInput from 'FormPresenter/ItemInputs/FormItemInput';
import { findStandardItem, TypedFormItem } from 'FormAdmin/FormItemUtils';
import styles from 'styles/form_editor.module.scss';

export type FormEditorItemPreviewDragOverlayProps = {
  formItem: TypedFormItem;
};

function FormEditorItemPreviewDragOverlay({ formItem }: FormEditorItemPreviewDragOverlayProps): React.JSX.Element {
  const { convention, formType, formTypeIdentifier, formItemsById } = useContext(FormEditorContext);
  const renderedFormItem = formItemsById.get(formItem.id);

  const standardItem = findStandardItem(formType, formItem.identifier);

  return (
    <div className={classnames('d-flex align-items-start bg-white')}>
      <div className="me-2 mt-2">
        <span className="visually-hidden">Drag to reorder</span>
        <i className="cursor-grab bi-grip-vertical" />
      </div>
      <div className={`form-editor-item ${styles.formEditorItem} flex-grow-1`}>
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
          <button className="btn btn-outline-danger btn-sm" type="button" onClick={() => {}}>
            <span className="visually-hidden">Delete item</span>
            <i className="bi-trash" />
          </button>
        )}
      </div>
    </div>
  );
}

export default FormEditorItemPreviewDragOverlay;
