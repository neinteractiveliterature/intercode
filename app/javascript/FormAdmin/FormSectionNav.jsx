import React, { useContext, useCallback } from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { useMutation } from 'react-apollo-hooks';
import classNames from 'classnames';

import { DeleteFormSection, MoveFormSection } from './mutations.gql';
import { FormEditorContext } from './FormEditorContexts';
import { FormEditorQuery } from './queries.gql';
import useSortable from '../useSortable';
import ErrorDisplay from '../ErrorDisplay';
import { useConfirm } from '../ModalDialogs/Confirm';
import { useDeleteMutation } from '../MutationUtils';
import { serializeParsedFormSection } from './FormItemUtils';

function FormSectionNavItem({ formSection, index, moveSection }) {
  const confirm = useConfirm();
  const match = useRouteMatch();
  const deleteFormSection = useDeleteMutation(DeleteFormSection, {
    query: FormEditorQuery,
    arrayPath: ['form', 'form_sections'],
    idVariablePath: ['id'],
  });

  const [ref, drag, { isDragging }] = useSortable(index, moveSection, 'formSection');

  return (
    <li key={formSection.id} className={classNames('nav-item', { 'opacity-50': isDragging })} ref={ref}>
      <div className="d-flex align-items-center">
        <div className="mr-2">
          <span className="sr-only">Drag to reorder</span>
          <i style={{ cursor: isDragging ? 'grabbing' : 'grab' }} className="fa fa-bars" ref={drag} />
        </div>
        <NavLink
          to={`/admin_forms/${match.params.id}/edit/section/${formSection.id}`}
          className="nav-link flex-grow-1"
          replace
        >
          {formSection.title}
        </NavLink>
        <div className="ml-2">
          <button
            className="btn btn-outline-danger btn-sm"
            type="button"
            onClick={() => confirm({
              prompt: 'Are you sure you want to delete this section and all items in it?',
              action: () => deleteFormSection({ variables: { id: formSection.id } }),
              renderError: (error) => <ErrorDisplay graphQLError={error} />,
            })}
          >
            <span className="sr-only">Delete item</span>
            <i className="fa fa-trash-o" />
          </button>
        </div>
      </div>
    </li>
  );
}

function FormSectionNav() {
  const { form } = useContext(FormEditorContext);
  const [moveFormSection] = useMutation(MoveFormSection);

  const moveSection = useCallback(
    (dragIndex, hoverIndex) => {
      const draggedSection = form.form_sections[dragIndex];
      const optimisticSections = form.form_sections.map(serializeParsedFormSection);
      optimisticSections.splice(dragIndex, 1);
      optimisticSections.splice(hoverIndex, 0, serializeParsedFormSection(draggedSection));

      const optimisticResponse = {
        moveFormSection: {
          __typename: 'Mutation',
          form: {
            ...form,
            form_sections: optimisticSections.map((section, sectionIndex) => ({
              ...section,
              position: sectionIndex + 1,
            })),
          },
        },
      };

      moveFormSection({
        variables: {
          id: draggedSection.id,
          destinationIndex: hoverIndex,
        },
        optimisticResponse,
      });
    },
    [form, moveFormSection],
  );

  return (
    <nav>
      <ul className="nav nav-pills flex-column">
        {form.form_sections.map((formSection, index) => (
          <FormSectionNavItem
            key={formSection.id}
            formSection={formSection}
            index={index}
            moveSection={moveSection}
          />
        ))}
      </ul>

      <div className="text-center">
        add section
      </div>
    </nav>
  );
}

export default FormSectionNav;
