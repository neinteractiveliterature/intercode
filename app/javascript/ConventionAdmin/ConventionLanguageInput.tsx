import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { MultipleChoiceInput } from '@neinteractiveliterature/litform';

export type ConventionLanguageInputProps = {
  value: string | null | undefined;
  onChange: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  disabled?: boolean;
};

function ConventionLanguageInput({ value, onChange, disabled }: ConventionLanguageInputProps): React.JSX.Element {
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

export default ConventionLanguageInput;
