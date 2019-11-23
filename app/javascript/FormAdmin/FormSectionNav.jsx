import React, { useContext, useCallback } from 'react';
import { NavLink, useHistory, useRouteMatch } from 'react-router-dom';
import { useMutation } from 'react-apollo-hooks';
import classNames from 'classnames';

import { CreateFormSection, DeleteFormSection, MoveFormSection } from './mutations.gql';
import { FormEditorContext } from './FormEditorContexts';
import { FormEditorQuery } from './queries.gql';
import useSortable from '../useSortable';
import ErrorDisplay from '../ErrorDisplay';
import { useConfirm } from '../ModalDialogs/Confirm';
import { useDeleteMutation, useCreateMutation } from '../MutationUtils';
import { serializeParsedFormSection } from './FormItemUtils';

function FormSectionNavItem({ formSection, index, moveSection }) {
  const { form, currentSection } = useContext(FormEditorContext);
  const confirm = useConfirm();
  const history = useHistory();
  const match = useRouteMatch();
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
              action: deleteConfirmed,
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
  const history = useHistory();
  const { form } = useContext(FormEditorContext);
  const [moveFormSection] = useMutation(MoveFormSection);
  const addFormSection = useCreateMutation(CreateFormSection, {
    query: FormEditorQuery,
    queryVariables: { id: form.id },
    arrayPath: ['form', 'form_sections'],
    newObjectPath: ['createFormSection', 'form_section'],
  });

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

  const addSection = async () => {
    const { data: { createFormSection: { form_section: { id } } } } = await addFormSection({
      variables: { formId: form.id, formSection: { title: 'New section' } },
    });
    history.replace(`/admin_forms/${form.id}/edit/section/${id}`);
  };

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

      <div className="mt-4">
        <button className="btn btn-outline-primary w-100" type="button" onClick={addSection}>
          Add section
        </button>
      </div>
    </nav>
  );
}

export default FormSectionNav;
