import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';
import classNames from 'classnames';

import FieldRequiredFeedback from './FieldRequiredFeedback';
import { getUnitForValue, UNITS } from '../TimespanItemUtils';
import RequiredIndicator from './RequiredIndicator';

class TimespanItemInput extends React.Component {
  static propTypes = {
    formItem: PropTypes.shape({
      identifier: PropTypes.string.isRequired,
      properties: PropTypes.shape({
        caption: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    value: PropTypes.number,
    valueInvalid: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onInteract: PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: null,
    valueInvalid: false,
  };

  constructor(props) {
    super(props);
    enableUniqueIds(this);

    this.state = {
      unit: getUnitForValue(this.props.value).name,
    };
  }

  getCurrentUnit = () => UNITS.find((u) => this.state.unit === u.name);

  userDidInteract = () => {
    this.props.onInteract(this.props.formItem.identifier);
  }

  inputDidChange = (event) => {
    const quantity = parseInt(event.target.value, 10);

    if (Number.isNaN(quantity)) {
      this.props.onChange(null);
    } else {
      this.props.onChange(quantity * this.getCurrentUnit().length_seconds);
    }

    this.userDidInteract();
  }

  unitSelectorDidChange = (event) => {
    this.setState({ unit: event.target.value });
  }

  render = () => {
    const inputId = this.nextUniqueId();
    const options = UNITS.map((unit) => (
      <option key={unit.name} value={unit.name}>
        {unit.name}
        (s)
      </option>
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
          <div className="w-25">
            <input
              id={inputId}
              type="number"
              min="1"
              className={classNames('form-control', { 'is-invalid': this.props.valueInvalid })}
              value={inputValue}
              onChange={this.inputDidChange}
              onBlur={this.userDidInteract}
            />
            <FieldRequiredFeedback valueInvalid={this.props.valueInvalid} />
          </div>
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

export default TimespanItemInput;
