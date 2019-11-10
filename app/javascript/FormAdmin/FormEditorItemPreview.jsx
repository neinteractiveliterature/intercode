import React, { useContext } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import PropTypes from 'prop-types';

import FormTypes from './form_types.json';
import FormItemInput from '../FormPresenter/ItemInputs/FormItemInput';
import { FormEditorContext } from './FormEditorContexts';

function FormEditorItemPreview({ formItem }) {
  const match = useRouteMatch();
  const { convention, form, renderedFormItemsById } = useContext(FormEditorContext);
  const renderedFormItem = renderedFormItemsById.get(formItem.id);
  const formType = FormTypes[form.form_type];
  const specialItem = ((formType || {}).special_items || {})[formItem.identifier];

  return (
    <div className="form-editor-item">
      <Link
        className="form-editor-item-overlay"
        to={`/admin_forms/${match.params.id}/edit/section/${match.params.sectionId}/item/${formItem.id}`}
      >
        {formItem.identifier && (
          <div className="form-editor-item-identifier">
            {specialItem
              ? (
                <>
                  <i className="fa fa-wrench" />
                  {' '}
                  {specialItem.description}
                </>
              )
              : (
                <>
                  <i className="fa fa-tag" />
                  {' '}
                  {formItem.identifier}
                </>
              )}
          </div>
        )}
        <div className="font-weight-bold">Click to edit</div>
      </Link>

      <FormItemInput
        convention={convention}
        formItem={renderedFormItem}
        onInteract={() => { }}
        value={formItem.default_value}
      />
    </div>
  );
}

FormEditorItemPreview.propTypes = {
  formItem: PropTypes.shape({
    id: PropTypes.number.isRequired,
    default_value: PropTypes.any,
    identifier: PropTypes.string,
  }).isRequired,
};

export default FormEditorItemPreview;
