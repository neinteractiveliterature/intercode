import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { humanize, pluralize } from 'inflected';

import { FormItemEditorContext, FormEditorContext } from './FormEditorContexts';
import CommonQuestionFields from './ItemEditors/CommonQuestionFields';

function StandardItemMetadata() {
  const { formType } = useContext(FormEditorContext);
  const { standardItem } = useContext(FormItemEditorContext);

  return (
    <>
      <li>
        <i className="fa fa-wrench" />
        {' '}
        <strong>{standardItem.description || humanize(standardItem.identifier)}</strong>
      </li>
      <li>
        <small>
          Standard item for
          {' '}
          {pluralize(formType.description)}
        </small>
      </li>
      {standardItem.required && (
        <li>
          <small>
            Response always required
          </small>
        </li>
      )}
    </>
  );
}

function StaticTextMetadata() {
  return (
    <>
      <li>
        <i className="fa fa-paragraph" />
        {' '}
        <strong>Static text</strong>
      </li>
    </>
  );
}

function CustomItemMetadata() {
  const { formItem } = useContext(FormItemEditorContext);

  return (
    <>
      <li>
        <i className="fa fa-tag" />
        {' '}
        <strong>{formItem.identifier}</strong>
      </li>
      <li>
        <small>
          Custom
          {' '}
          {humanize(formItem.item_type).toLowerCase()}
          {' '}
          item
        </small>
      </li>
    </>
  );
}

function FormItemTools({ saveFormItem }) {
  const match = useRouteMatch();
  const { disabled, formItem, standardItem } = useContext(FormItemEditorContext);

  const renderItemMetadata = () => {
    if (standardItem) {
      return <StandardItemMetadata />;
    }

    if (formItem.item_type === 'static_text') {
      return <StaticTextMetadata />;
    }

    return <CustomItemMetadata />;
  };

  return (
    <>
      <div className="d-flex align-items-stretch mb-4">
        <NavLink
          className="btn btn-outline-secondary col mr-2"
          to={`/admin_forms/${match.params.id}/edit/section/${match.params.sectionId}`}
          exact
          disabled={disabled}
        >
          Cancel
        </NavLink>
        <button
          type="button"
          className="btn btn-primary col"
          onClick={saveFormItem}
          disabled={disabled}
        >
          Save
        </button>
      </div>

      <ul className="list-unstyled">
        {renderItemMetadata()}
      </ul>

      {formItem.item_type !== 'static_text' && (
        <CommonQuestionFields />
      )}
    </>
  );
}

FormItemTools.propTypes = {
  saveFormItem: PropTypes.func.isRequired,
};

export default FormItemTools;
