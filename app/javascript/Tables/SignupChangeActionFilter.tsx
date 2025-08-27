import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Column } from '@tanstack/react-table';

import ChoiceSetFilter from './ChoiceSetFilter';
import EnumTypes from '../enumTypes.json';
import { describeAction } from './SignupChangeCell';
import { SignupChangeAction } from '../graphqlTypes.generated';

const ACTIONS = EnumTypes.SignupChangeAction.enumValues.map((value) => value.name as SignupChangeAction);

function SignupChangeActionFilter<TData extends Record<string, unknown>, TValue>({
  column,
}: {
  column: Column<TData, TValue>;
}): React.JSX.Element {
  const { t } = useTranslation();
  const choices = useMemo(() => ACTIONS.map((action) => ({ value: action, label: describeAction(action, t) })), [t]);

  return <ChoiceSetFilter column={column} choices={choices} multiple />;
}

export default SignupChangeActionFilter;
