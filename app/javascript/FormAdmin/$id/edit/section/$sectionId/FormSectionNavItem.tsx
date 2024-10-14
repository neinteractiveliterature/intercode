import { NavLink, useParams, useSubmit } from 'react-router';
import { useConfirm, ErrorDisplay } from '@neinteractiveliterature/litform';

import { useSortable } from '@dnd-kit/sortable';
import { FormEditorForm } from 'FormAdmin/FormEditorContexts';
import { getSortableStyle } from 'SortableUtils';

export type FormSectionNavItemProps = {
  formSection: FormEditorForm['form_sections'][0];
};

function FormSectionNavItem({ formSection }: FormSectionNavItemProps): JSX.Element {
  const confirm = useConfirm();
  const { id } = useParams();
  const submit = useSubmit();

  const deleteConfirmed = async () => {
    submit({}, { action: `/admin_forms/${id}/edit/section/${formSection.id}?index`, method: 'DELETE' });
  };

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: formSection.id.toString(),
  });
  const style = getSortableStyle(transform, transition, isDragging);

  return (
    <li key={formSection.id} className="nav-item" style={style}>
      <div className="d-flex align-items-center">
        <div className="me-2" {...attributes} {...listeners} ref={setNodeRef}>
          <span className="visually-hidden">Drag to reorder</span>
          <i style={{ cursor: 'grab' }} className="bi-grip-vertical" />
        </div>
        <NavLink to={`/admin_forms/${id}/edit/section/${formSection.id}`} className="nav-link flex-grow-1" replace>
          {formSection.title}
        </NavLink>
        <div className="ms-2">
          <button
            className="btn btn-outline-danger btn-sm"
            type="button"
            onClick={() =>
              confirm({
                prompt: 'Are you sure you want to delete this section and all items in it?',
                action: deleteConfirmed,
                renderError: (error) => <ErrorDisplay graphQLError={error} />,
              })
            }
          >
            <span className="visually-hidden">Delete item</span>
            <i className="bi-trash" />
          </button>
        </div>
      </div>
    </li>
  );
}

export default FormSectionNavItem;
