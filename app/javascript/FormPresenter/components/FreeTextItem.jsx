import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';
import RequiredIndicator from './RequiredIndicator';

class FreeTextItem extends React.Component {
  static propTypes = {
    formItem: PropTypes.shape({
      caption: PropTypes.string.isRequired,
    }).isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: null,
  };

  constructor(props) {
    super(props);
    enableUniqueIds(this);
  }

  valueDidChange = (event) => {
    this.props.onChange(event.target.value);
  }

  renderLabel = (formItem, domId) => (
    <label htmlFor={domId} className="form-item-label">
      <span
          // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: formItem.properties.caption }}
      />
      <RequiredIndicator formItem={formItem} />
    </label>
  )

  renderInput = (formItem, domId) => {
    if (formItem.lines === 1) {
      return (
        <input
          id={domId}
          type={formItem.properties.free_text_type || 'text'}
          className="form-control"
          value={this.props.value || ''}
          onChange={this.valueDidChange}
        />
      );
    }
    return (
      <textarea
        id={domId}
        rows={formItem.properties.lines}
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
