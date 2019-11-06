import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import CreatableSelect from 'react-select/creatable';

import BooleanInput from '../../BuiltInFormControls/BooleanInput';
import { formItemPropertyUpdater } from '../FormItemUtils';
import FormGroupWithLabel from '../../BuiltInFormControls/FormGroupWithLabel';
import FormTypes from '../form_types.json';
import useModal from '../../ModalDialogs/useModal';
import DefaultAnswerModal from './DefaultAnswerModal';

function CommonQuestionFields({
  convention, form, formItem, onChange, renderedFormItem,
}) {
  const formType = FormTypes[form.form_type] || {};
  const specialItems = formType.special_items || {};
  const defaultAnswerModal = useModal();

  const specialIdentifierOptions = useMemo(
    () => Object.entries(specialItems).map(([specialItemIdentifier, metadata]) => ({
      label: metadata.description || specialItemIdentifier,
      value: specialItemIdentifier,
    })),
    [specialItems],
  );

  const identifierOptions = useMemo(
    () => {
      if (specialIdentifierOptions.some((option) => option.value === formItem.identifier)) {
        return specialIdentifierOptions;
      }

      return [
        ...specialIdentifierOptions,
        { label: formItem.identifier, value: formItem.identifier },
      ];
    },
    [formItem.identifier, specialIdentifierOptions],
  );

  return (
    <div className="d-flex flex-column flex-lg-row align-items-center">
      <DefaultAnswerModal
        close={defaultAnswerModal.close}
        convention={convention}
        form={form}
        formItem={formItem}
        onChange={onChange}
        renderedFormItem={renderedFormItem}
        visible={defaultAnswerModal.visible}
      />
      <div className="flex-grow-1 mr-lg-4">
        <FormGroupWithLabel label="Identifier">
          {(id) => (
            <CreatableSelect
              inputId={id}
              value={identifierOptions.find((option) => option.value === formItem.identifier)}
              formatCreateLabel={(inputValue) => (
                <>
                  <i className="fa fa-tag" />
                  {' '}
                  {inputValue}
                </>
              )}
              formatOptionLabel={(option) => {
                if (specialItems[option.value]) {
                  return (
                    <>
                      <i className="fa fa-wrench" />
                      {' '}
                      {option.label}
                    </>
                  );
                }

                return (
                  <>
                    <i className="fa fa-tag" />
                    {' '}
                    {option.label}
                  </>
                );
              }}
              options={identifierOptions}
              onChange={({ value }) => onChange({ ...formItem, identifier: value })}
              styles={{
                menu: (provided) => ({ ...provided, zIndex: 25 }),
              }}
            />
          )}
        </FormGroupWithLabel>
      </div>
      <div className="mr-lg-4">
        <BooleanInput
          caption="Response required?"
          value={formItem.properties.required}
          onChange={formItemPropertyUpdater('required', onChange)}
        />
      </div>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={defaultAnswerModal.open}
      >
        Edit default answer
      </button>
    </div>
  );
}

CommonQuestionFields.propTypes = {
  convention: PropTypes.shape({}).isRequired,
  form: PropTypes.shape({
    form_type: PropTypes.string.isRequired,
  }).isRequired,
  formItem: PropTypes.shape({
    identifier: PropTypes.string.isRequired,
    properties: PropTypes.shape({
      required: PropTypes.bool,
    }).isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  renderedFormItem: PropTypes.shape({}).isRequired,
};

export default CommonQuestionFields;
