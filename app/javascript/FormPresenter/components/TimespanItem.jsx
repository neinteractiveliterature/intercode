import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';
import RequiredIndicator from './RequiredIndicator';

class TimespanItem extends React.Component {
  static propTypes = {
    formItem: PropTypes.shape({
      properties: PropTypes.shape({
        caption: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: null,
  };

  static units = [
    { name: 'hour(s)', length_seconds: 60 * 60 },
    { name: 'minute(s)', length_seconds: 60 },
  ];

  constructor(props) {
    super(props);
    enableUniqueIds(this);

    let initialUnit = TimespanItem.units[0];
    if (typeof this.props.value === 'number') {
      initialUnit = (
        TimespanItem.units.find(unit => this.props.value % unit.length_seconds === 0) ||
        TimespanItem.units[TimespanItem.units.length - 1]
      );
    }

    this.state = {
      unit: initialUnit.name,
    };
  }

  getCurrentUnit = () => TimespanItem.units.find(u => this.state.unit === u.name);

  inputDidChange = (event) => {
    const quantity = parseInt(event.target.value, 10);

    if (Number.isNaN(quantity)) {
      this.props.onChange(null);
    } else {
      this.props.onChange(quantity * this.getCurrentUnit().length_seconds);
    }
  }

  unitSelectorDidChange = (event) => {
    this.setState({ unit: event.target.value });
  }

  render = () => {
    const inputId = this.nextUniqueId();
    const options = TimespanItem.units.map(unit => (
      <option key={unit.name} value={unit.name}>{unit.name}</option>
    ));

    let inputValue;
    if (this.props.value === null) {
      inputValue = '';
    } else {
      inputValue = this.props.value / this.getCurrentUnit().length_seconds;
    }

    return (
      <div className="form-group">
        <label htmlFor={inputId} className="form-item-label">
          <span
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: this.props.formItem.properties.caption }}
          />
          <RequiredIndicator formItem={this.props.formItem} />
        </label>
        <div className="d-flex">
          <input
            id={inputId}
            type="number"
            min="1"
            className="form-control w-25"
            value={inputValue}
            onChange={this.inputDidChange}
          />
          <select
            className="form-control ml-2"
            value={this.state.unit}
            onChange={this.unitSelectorDidChange}
          >
            {options}
          </select>
        </div>
      </div>
    );
  };
}

export default TimespanItem;
