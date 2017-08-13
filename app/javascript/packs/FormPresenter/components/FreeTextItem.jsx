// @flow

import React from 'react';
import { enableUniqueIds } from 'react-html-id';

type Props = {
  formItem: {
    caption: string,
  },
  value?: string,
  onChange: (value) => undefined,
};

class FreeTextItem extends React.Component {
  static defaultProps = {
    value: null,
  };

  constructor(props: Props) {
    super(props);
    enableUniqueIds(this);
  }

  props: Props

  valueDidChange = (event: SyntheticInputEvent) => {
    this.props.onChange(event.target.value);
  }

  renderLabel = (formItem, domId) => (
    <label
      htmlFor={domId}
      className="form-item-label"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: formItem.caption }}
    />
  )

  renderInput = (formItem, domId) => {
    if (formItem.lines === 1) {
      return (
        <input
          id={domId}
          type={formItem.free_text_type || 'text'}
          className="form-control"
          value={this.props.value || ''}
          onChange={this.valueDidChange}
        />
      );
    }
    return (
      <textarea
        id={domId}
        rows={formItem.lines}
        className="form-control"
        value={this.props.value || ''}
        onChange={this.valueDidChange}
      />
    );
  }

  render = () => {
    const { formItem } = this.props;
    const domId = this.nextUniqueId();

    return (
      <div className="form-group">
        {this.renderLabel(formItem, domId)}
        {this.renderInput(formItem, domId)}
      </div>
    );
  };
}

export default FreeTextItem;
