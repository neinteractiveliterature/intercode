import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import FormTypes from './form_types.json';
import FormItemInput from '../FormPresenter/ItemInputs/FormItemInput';
import { FormEditorContext } from './FormEditorContexts';

function FormEditorItemPreview({ formItem, startEditing }) {
  const { convention, form, renderedFormItemsById } = useContext(FormEditorContext);
  const renderedFormItem = renderedFormItemsById.get(formItem.id);
  const formType = FormTypes[form.form_type];
  const specialItem = ((formType || {}).special_items || {})[formItem.identifier];

  const keyDown = (event) => {
    if (event.keyCode === 13 || event.keyCode === 32) {
      event.preventDefault();
      startEditing();
    }
  };

  return (
    <div className="form-editor-item">
      <div
        className="form-editor-item-overlay"
        onClick={startEditing}
        onKeyDown={keyDown}
        role="button"
        tabIndex={0}
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
      </div>

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
  startEditing: PropTypes.func.isRequired,
};

export default FormEditorItemPreview;
