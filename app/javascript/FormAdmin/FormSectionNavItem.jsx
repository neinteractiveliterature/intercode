import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useHistory, useRouteMatch } from 'react-router-dom';
import classNames from 'classnames';

import { DeleteFormSection } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import { FormEditorContext } from './FormEditorContexts';
import { FormEditorQuery } from './queries.gql';
import { useDeleteMutation } from '../MutationUtils';
import { useConfirm } from '../ModalDialogs/Confirm';
import useSortable from '../useSortable';

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

FormSectionNavItem.propTypes = {
  formSection: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  moveSection: PropTypes.func.isRequired,
};

export default FormSectionNavItem;
