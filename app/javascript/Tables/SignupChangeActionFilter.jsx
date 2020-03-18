import React, { useMemo } from 'react';
import { humanize } from 'inflected';
import PropTypes from 'prop-types';

import ChoiceSetFilter from './ChoiceSetFilter';
import EnumTypes from '../enumTypes.json';

const ACTIONS = EnumTypes.SignupChangeAction.enumValues.map((value) => value.name);

const SignupChangeActionFilter = ({ filter, onChange }) => {
  const choices = useMemo(
    () => ACTIONS.map((action) => ({ value: action, label: humanize(action) })),
    [],
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
