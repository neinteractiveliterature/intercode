import React, { useContext, useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from 'react-apollo-hooks';

import { CreateFormSection, MoveFormSection } from './mutations.gql';
import { FormEditorContext } from './FormEditorContexts';
import { FormEditorQuery } from './queries.gql';
import { useCreateMutation } from '../MutationUtils';
import { serializeParsedFormSection } from './FormItemUtils';
import FormSectionNavItem from './FormSectionNavItem';
import { buildOptimisticArrayForMove } from '../useSortable';
import useCollapse from '../NavigationBar/useCollapse';
import useUniqueId from '../useUniqueId';

function FormSectionNav() {
  const collapseRef = useRef();
  const {
    collapsed, collapseProps, toggleCollapsed,
  } = useCollapse(collapseRef);
  const { className: collapseClassName, ...otherCollapseProps } = collapseProps;
  const history = useHistory();
  const { form } = useContext(FormEditorContext);
  const [moveFormSection] = useMutation(MoveFormSection);
  const addFormSection = useCreateMutation(CreateFormSection, {
    query: FormEditorQuery,
    queryVariables: { id: form.id },
    arrayPath: ['form', 'form_sections'],
    newObjectPath: ['createFormSection', 'form_section'],
  });
  const navId = useUniqueId('section-nav-');

  const moveSection = useCallback(
    (dragIndex, hoverIndex) => {
      const optimisticSections = buildOptimisticArrayForMove(
        form.form_sections, dragIndex, hoverIndex,
      ).map(serializeParsedFormSection);

      moveFormSection({
        variables: {
          id: form.form_sections[dragIndex].id,
          destinationIndex: hoverIndex,
        },
        optimisticResponse: {
          moveFormSection: {
            __typename: 'Mutation',
            form: {
              ...form,
              form_sections: optimisticSections,
            },
          },
        },
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
    <>
      <button
        className="btn p-0 d-lg-none"
        type="button"
        onClick={toggleCollapsed}
        aria-expanded={!collapsed}
        aria-controls={navId}
      >
        <i className={`fa ${collapsed ? 'fa-caret-right' : 'fa-caret-down'}`} />
        {' '}
        Sections
      </button>
      <nav
        id={navId}
        className={`d-lg-block ${collapseClassName}`}
        ref={collapseRef}
        {...otherCollapseProps}
      >
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
    </>
  );
}

export default FormSectionNav;
