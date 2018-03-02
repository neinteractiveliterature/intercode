import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';
import classNames from 'classnames';
import FieldRequiredFeedback from './FieldRequiredFeedback';
import MarkdownInput from '../../BuiltInFormControls/MarkdownInput';
import RequiredIndicator from './RequiredIndicator';

class FreeTextItem extends React.Component {
  static propTypes = {
    formItem: PropTypes.shape({
      identifier: PropTypes.string.isRequired,
      properties: PropTypes.shape({
        caption: PropTypes.string.isRequired,
        format: PropTypes.string,
      }).isRequired,
    }).isRequired,
    value: PropTypes.string,
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
  }

  userDidInteract = () => {
    this.props.onInteract(this.props.formItem.identifier);
  }

  valueDidChange = (event) => {
    this.props.onChange(event.target.value);
    this.userDidInteract();
  }

  markdownDidChange = (newValue) => {
    this.props.onChange(newValue);
    this.userDidInteract();
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
    if (formItem.properties.format === 'markdown') {
      return (
        <MarkdownInput
          value={this.props.value || ''}
          onChange={this.markdownDidChange}
          onBlur={this.userDidInteract}
          lines={formItem.properties.lines}
          formControlClassName={classNames({ 'is-invalid': this.props.valueInvalid })}
        >
          <FieldRequiredFeedback valueInvalid={this.props.valueInvalid} />
        </MarkdownInput>
      );
    }
    if (formItem.properties.lines === 1) {
      return (
        <input
          id={domId}
          type={formItem.properties.free_text_type || 'text'}
          className={classNames('form-control', { 'is-invalid': this.props.valueInvalid })}
          value={this.props.value || ''}
          onChange={this.valueDidChange}
          onBlur={this.userDidInteract}
        />
      );
    }
    return (
      <textarea
        id={domId}
        rows={formItem.properties.lines}
        className={classNames('form-control', { 'is-invalid': this.props.valueInvalid })}
        value={this.props.value || ''}
        onChange={this.valueDidChange}
        onBlur={this.userDidInteract}
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
        <FieldRequiredFeedback valueInvalid={this.props.valueInvalid} />
      </div>
    );
  };
}

export default FreeTextItem;
