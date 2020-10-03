import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Filter } from 'react-table';

import ChoiceSetFilter from './ChoiceSetFilter';
import EnumTypes from '../enumTypes.json';
import { describeAction } from './SignupChangeCell';
import { SignupChangeAction } from '../graphqlTypes.generated';

const ACTIONS = EnumTypes.SignupChangeAction.enumValues.map(
  (value) => value.name as SignupChangeAction,
);

export type SignupChangeActionFilterProps = {
  filter?: Filter;
  onChange: React.Dispatch<string[]>;
};

const SignupChangeActionFilter = ({ filter, onChange }: SignupChangeActionFilterProps) => {
  const { t } = useTranslation();
  const choices = useMemo(
    () => ACTIONS.map((action) => ({ value: action, label: describeAction(action, t) })),
    [t],
  );

  return <ChoiceSetFilter choices={choices} onChange={onChange} filter={filter} multiple />;
};

export default SignupChangeActionFilter;
