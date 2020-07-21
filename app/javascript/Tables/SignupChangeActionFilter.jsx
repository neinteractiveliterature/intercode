import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import ChoiceSetFilter from './ChoiceSetFilter';
import EnumTypes from '../enumTypes.json';
import { describeAction } from './SignupChangeCell';

const ACTIONS = EnumTypes.SignupChangeAction.enumValues.map((value) => value.name);

const SignupChangeActionFilter = ({ filter, onChange }) => {
  const { t } = useTranslation();
  const choices = useMemo(
    () => ACTIONS.map((action) => ({ value: action, label: describeAction(action, t) })),
    [t],
  );

  return (
    <ChoiceSetFilter
      name="event_category"
      choices={choices}
      onChange={onChange}
      filter={filter}
      multiple
    />
  );
};

SignupChangeActionFilter.propTypes = {
  filter: PropTypes.shape({}),
  onChange: PropTypes.func.isRequired,
};

SignupChangeActionFilter.defaultProps = {
  filter: null,
};

export default SignupChangeActionFilter;
