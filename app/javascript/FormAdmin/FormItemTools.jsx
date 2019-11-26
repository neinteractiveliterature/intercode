import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { humanize, pluralize } from 'inflected';

import { FormItemEditorContext, FormEditorContext } from './FormEditorContexts';
import CommonQuestionFields from './ItemEditors/CommonQuestionFields';
import useCollapse from '../NavigationBar/useCollapse';
import useUniqueId from '../useUniqueId';

function StandardItemMetadata() {
  const { formType } = useContext(FormEditorContext);
  const { standardItem } = useContext(FormItemEditorContext);

  return (
    <>
      <div className="mr-2">
        <i className="fa fa-wrench" />
        {' '}
        <strong>{standardItem.description || humanize(standardItem.identifier)}</strong>
      </div>
      <div className="mr-2">
        <small>
          Standard item for
          {' '}
          {pluralize(formType.description)}
        </small>
      </div>
      {standardItem.required && (
        <div className="mr-2">
          <small>
            Response always required
          </small>
        </div>
      )}
    </>
  );
}

function StaticTextMetadata() {
  return (
    <>
      <div>
        <i className="fa fa-paragraph" />
        {' '}
        <strong>Static text</strong>
      </div>
    </>
  );
}

function CustomItemMetadata() {
  const { formItem } = useContext(FormItemEditorContext);

  return (
    <>
      <div className="mr-2">
        <i className="fa fa-tag" />
        {' '}
        <strong>{formItem.identifier}</strong>
      </div>
      <div>
        <small>
          Custom
          {' '}
          {humanize(formItem.item_type).toLowerCase()}
          {' '}
          item
        </small>
      </div>
    </>
  );
}

function FormItemTools({ saveFormItem }) {
  const match = useRouteMatch();
  const { disabled, formItem, standardItem } = useContext(FormItemEditorContext);
  const collapseRef = useCollapse();
  const { collapsed, collapseProps, toggleCollapsed } = useCollapse(collapseRef);
  const { className: collapseClassName, ...otherCollapseProps } = collapseProps;
  const collapseId = useUniqueId('collapse-');

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
      <div className="d-flex flex-row flex-wrap flex-lg-column mb-2">
        {renderItemMetadata()}
      </div>

      {formItem.item_type !== 'static_text' && (
        <>
          <button
            className="p-0 d-lg-none"
            type="button"
            onClick={toggleCollapsed}
            aria-expanded={!collapsed}
            aria-controls={collapseId}
          >
            <i className={`fa ${collapsed ? 'fa-caret-right' : 'fa-caret-down'}`} />
            {' '}
            Tools
          </button>
          <div
            id={collapseId}
            className={`${collapseClassName} d-lg-block`}
            ref={collapseRef}
            {...otherCollapseProps}
          >
            <CommonQuestionFields />
          </div>
        </>
      )}

      <div className="d-flex align-items-stretch mt-2 mt-lg-4">
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
    </>
  );
}

FormItemTools.propTypes = {
  saveFormItem: PropTypes.func.isRequired,
};

export default FormItemTools;
