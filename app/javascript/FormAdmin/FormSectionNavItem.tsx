import { useContext } from 'react';
import { NavLink, useHistory, useRouteMatch } from 'react-router-dom';
import { useConfirm, ErrorDisplay, useDeleteMutationWithReferenceArrayUpdater } from '@neinteractiveliterature/litform';

import { useSortable } from '@dnd-kit/sortable';
import { FormEditorContext, FormEditorForm } from './FormEditorContexts';
import { getSortableStyle } from '../SortableUtils';
import { useDeleteFormSectionMutation } from './mutations.generated';

export type FormSectionNavItemProps = {
  formSection: FormEditorForm['form_sections'][0];
};

function FormSectionNavItem({ formSection }: FormSectionNavItemProps): JSX.Element {
  const { form, currentSection, convention } = useContext(FormEditorContext);
  const confirm = useConfirm();
  const history = useHistory();
  const match = useRouteMatch<{ id: string }>();
  const [deleteFormSection] = useDeleteMutationWithReferenceArrayUpdater(
    useDeleteFormSectionMutation,
    convention.form,
    'form_sections',
    (section) => ({ id: section.id }),
  );

  const deleteConfirmed = async () => {
    const unparsedFormSection = convention.form.form_sections.find((section) => section.id === formSection.id);
    if (!unparsedFormSection) {
      throw new Error("Couldn't find form section in original GraphQL server response!");
    }
    await deleteFormSection(unparsedFormSection);
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
