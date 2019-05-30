import React from 'react';
import PropTypes from 'prop-types';

import CommitableInput from '../BuiltInFormControls/CommitableInput';

function FreeTextFilter({ filter, ...otherProps }) {
  return (
    <CommitableInput value={(filter || {}).value} {...otherProps} />
  );
}

FreeTextFilter.propTypes = {
  filter: PropTypes.shape({
    value: PropTypes.string,
  }),
};

FreeTextFilter.defaultProps = {
  filter: null,
};

export default FreeTextFilter;
