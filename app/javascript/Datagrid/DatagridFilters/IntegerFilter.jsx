import React from 'react';
import PropTypes from 'prop-types';

function castInteger(value) {
  if (typeof value === 'string') {
    const castValue = Number.parseInt(value, 10);
    if (Number.isNaN(castValue)) {
      return '';
    }

    return castValue;
  }

  return value;
}

class IntegerFilter extends React.Component {
  static propTypes = {
    filter: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    filterValueDidChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: null,
  };

  onChange = (event) => {
    this.props.filterValueDidChange(this.props.filter.name, event.target.value);
  }

  render = () => (
    <input
      type="number"
      name={this.props.filter.name}
      className="form-control"
      value={castInteger(this.props.value)}
      onChange={this.onChange}
    />
  )
}

export default IntegerFilter;
