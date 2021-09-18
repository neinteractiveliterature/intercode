import { useContext } from 'react';
import { NavLink, useHistory, useRouteMatch } from 'react-router-dom';
import { useConfirm, ErrorDisplay } from '@neinteractiveliterature/litform';

import { useSortable } from '@dnd-kit/sortable';
import { DeleteFormSection } from './mutations';
import { FormEditorContext, FormEditorForm } from './FormEditorContexts';
import { FormEditorQuery } from './queries';
import { useDeleteMutation } from '../MutationUtils';
import { getSortableStyle } from '../SortableUtils';

export type FormSectionNavItemProps = {
  formSection: FormEditorForm['form_sections'][0];
};

function FormSectionNavItem({ formSection }: FormSectionNavItemProps) {
  const { form, currentSection } = useContext(FormEditorContext);
  const confirm = useConfirm();
  const history = useHistory();
  const match = useRouteMatch<{ id: string }>();
  const deleteFormSection = useDeleteMutation(DeleteFormSection, {
    query: FormEditorQuery,
    queryVariables: { id: form.id },
    arrayPath: ['form', 'form_sections'],
    idVariablePath: ['id'],
  });

  const deleteConfirmed = async () => {
    await deleteFormSection({ variables: { id: formSection.id } });
    if (currentSection && formSection.id === currentSection.id) {
      history.replace(`/admin_forms/${form.id}/edit`);
    }
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
        <NavLink
          to={`/admin_forms/${match.params.id}/edit/section/${formSection.id}`}
          className="nav-link flex-grow-1"
          replace
        >
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
