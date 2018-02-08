import React from 'react';
import PropTypes from 'prop-types';

class StringFilter extends React.Component {
  static propTypes = {
    filter: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    value: PropTypes.string,
    filterValueDidChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: '',
  };

  onChange = (event) => {
    this.props.filterValueDidChange(this.props.filter.name, event.target.value);
  }

  render = () => (
    <input
      type="text"
      name={this.props.filter.name}
      className="form-control"
      value={this.props.value || ''}
      onChange={this.onChange}
    />
  )
}

export default StringFilter;
