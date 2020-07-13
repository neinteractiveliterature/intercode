import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';

function ConventionLanguageInput({ value, onChange, disabled }) {
  const { t } = useTranslation();

  return (
    <MultipleChoiceInput
      caption={t('admin.convention.language.label')}
      choices={[
        {
          value: 'en',
          label: t('admin.convention.language.en'),
        },
        {
          value: 'es',
          label: t('admin.convention.language.es'),
        },
      ]}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  );
}

ConventionLanguageInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

ConventionLanguageInput.defaultProps = {
  value: undefined,
  disabled: undefined,
};

export default ConventionLanguageInput;
