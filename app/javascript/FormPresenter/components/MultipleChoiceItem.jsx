import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { enableUniqueIds } from 'react-html-id';
import CaptionLegend from './CaptionLegend';

class MultipleChoiceItem extends React.Component {
  static propTypes = {
    formItem: PropTypes.shape({
      identifier: PropTypes.string.isRequired,
      properties: PropTypes.shape({
        style: PropTypes.string,
        caption: PropTypes.string.isRequired,
        choices: PropTypes.arrayOf(PropTypes.shape({
          caption: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        }).isRequired).isRequired,
      }).isRequired,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  };

  static defaultProps = {
    value: null,
  };

  constructor(props) {
    super(props);
    enableUniqueIds(this);
  }

  inputDidChange = (event) => {
    this.props.onChange(event.target.value);
  }

  renderChoice = (choice) => {
    const domId = this.nextUniqueId();

    return (
      <div
        className={
          classNames(
            'form-check',
            { 'form-check-inline': this.props.formItem.properties.style === 'radio_horizontal' },
          )
        }
        key={choice.value}
      >
        <label className="form-check-label" htmlFor={domId}>
          <input
            id={domId}
            className="form-check-input"
            type="radio"
            name={this.props.formItem.identifier}
            value={choice.value}
            checked={this.props.value === choice.value.toString()}
            onChange={this.inputDidChange}
          /> {choice.caption}
        </label>
      </div>
    );
  }

  render = () => {
    const choices = this.props.formItem.properties.choices.map(choice => this.renderChoice(choice));

    return (
      <fieldset className="form-group">
        <CaptionLegend formItem={formItem} />
        {choices}
      </fieldset>
    );
  };
}

export default MultipleChoiceItem;
