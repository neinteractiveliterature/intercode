import React from 'react';
import PropTypes from 'prop-types';

import { breakValueIntoUnitQuantities } from '../TimespanItemUtils';
import pluralizeWithCount from '../../pluralizeWithCount';

class TimespanItemDisplay extends React.PureComponent {
  static propTypes = {
    value: PropTypes.number.isRequired,
  };

  render = () => breakValueIntoUnitQuantities(this.props.value)
    .map(({ unit, quantity }) => pluralizeWithCount(unit.name, quantity))
    .join(' ');
}

export default TimespanItemDisplay;
