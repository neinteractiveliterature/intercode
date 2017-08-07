// @flow

import React from 'react';
import classNames from 'classnames';
import { enableUniqueIds } from 'react-html-id';

type Choice = {
  caption: string,
  value: string,
};

type Props = {
  formItem: {
    identifier: string,
    caption: string,
    style?: string,
    choices: Array<Choice>,
  },
};

class MultipleChoiceItem extends React.Component {
  constructor(props: Props) {
    super(props);
    enableUniqueIds(this);
  }

  props: Props
  nextUniqueId: () => string

  renderChoice = (choice: Choice) => {
    const domId: string = this.nextUniqueId();

    return (
      <div
        className={
          classNames(
            'form-check',
            { 'form-check-inline': this.props.formItem.style === 'radio_horizontal' },
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
          /> {choice.caption}
        </label>
      </div>
    );
  }

  render = () => {
    const choices = this.props.formItem.choices.map(
      choice => this.renderChoice(choice),
    );

    return (
      <fieldset className="form-group">
        <legend className="col-form-legend" dangerouslySetInnerHTML={{ __html: this.props.formItem.caption }} />
        {choices}
      </fieldset>
    );
  };
}

export default MultipleChoiceItem;
