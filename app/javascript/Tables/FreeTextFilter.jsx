import React from 'react';
import PropTypes from 'prop-types';

import CommitableInput from '../BuiltInFormControls/CommitableInput';

class FreeTextFilter extends React.PureComponent {
  static propTypes = {
    filter: PropTypes.shape({
      value: PropTypes.string,
    }),
  }

  static defaultProps = {
    filter: null,
  }

  render = () => {
    const { filter, ...otherProps } = this.props;

    return (
      <CommitableInput value={(filter || {}).value} {...otherProps} />
    );
  }
}

export default FreeTextFilter;
