import { FormEditorForm } from 'FormAdmin/FormEditorContexts';

export type FormSectionNavItemDragOverlayProps = {
  formSection: FormEditorForm['form_sections'][0];
};

function FormSectionNavItemDragOverlay({ formSection }: FormSectionNavItemDragOverlayProps): React.JSX.Element {
  return (
    <li className="nav-item">
      <div className="d-flex align-items-center">
        <div className="me-2">
          <span className="visually-hidden">Drag to reorder</span>
          <i className="bi-grip-vertical" />
        </div>
        {formSection.title}
        <div className="ms-2">
          <button className="btn btn-outline-danger btn-sm" type="button">
            <span className="visually-hidden">Delete item</span>
            <i className="bi-trash" />
          </button>
        </div>
      </div>
    </li>
  );
}

export default FormSectionNavItemDragOverlay;
