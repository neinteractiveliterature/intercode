import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import CreatableSelect from 'react-select/creatable';

import BooleanInput from '../../BuiltInFormControls/BooleanInput';
import { formItemPropertyUpdater } from '../FormItemUtils';
import FormGroupWithLabel from '../../BuiltInFormControls/FormGroupWithLabel';
import FormTypes from '../form_types.json';

function CommonQuestionFields({ form, formItem, onChange }) {
  const formType = FormTypes[form.form_type] || {};
  const specialItems = formType.special_items || {};

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
    <>
      <FormGroupWithLabel label="Identifier">
        {(id) => (
          <CreatableSelect
            id={id}
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
      <BooleanInput
        caption="Response required?"
        value={formItem.properties.required}
        onChange={formItemPropertyUpdater('required', onChange)}
      />
    </>
  );
}

CommonQuestionFields.propTypes = {
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
};

export default CommonQuestionFields;
