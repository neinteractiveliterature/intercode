import React, { useContext } from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';

import { FormEditorContext } from './FormEditorContexts';

function FormSectionNav() {
  const match = useRouteMatch();
  const { form } = useContext(FormEditorContext);

  return (
    <nav>
      <ul className="nav nav-pills flex-column">
        {form.form_sections.map((formSection) => (
          <li key={formSection.id} className="nav-item">
            <NavLink
              to={`/admin_forms/${match.params.id}/edit/section/${formSection.id}`}
              className="nav-link"
              replace
            >
              {formSection.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default FormSectionNav;
