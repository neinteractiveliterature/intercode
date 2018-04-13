import React from 'react';
import PropTypes from 'prop-types';

class InPlaceEditor extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.node,
    renderInput: PropTypes.func,
    className: PropTypes.string,
  };

  static defaultProps = {
    children: null,
    renderInput: null,
    className: null,
  }

  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      editingValue: '',
    };
  }

  editingValueChanged = (editingValue) => {
    this.setState({ editingValue });
  }

  beginEditing = (event) => {
    event.preventDefault();
    this.setState(
      { editing: true, editingValue: this.props.value },
      () => { if (this.input) { this.input.focus(); } },
    );
  }

  cancelEditing = (event) => {
    event.preventDefault();
    this.setState({ editing: false, editingValue: undefined });
  }

  commitEditing = (event) => {
    event.preventDefault();
    this.props.onChange(this.state.editingValue);
    this.setState({ editing: false, editingValue: undefined });
  }

  keyDownInInput = (event) => {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.cancelEditing(event);
        break;

      case 'Enter':
        event.preventDefault();
        this.commitEditing(event);
        break;

      default:
    }
  }

  renderInput = () => {
    const inputProps = {
      value: this.state.editingValue,
      onChange: this.editingValueChanged,
      onKeyDown: this.keyDownInInput,
      ref: (input) => { this.input = input; },
    };

    if (this.props.renderInput) {
      return this.props.renderInput(inputProps);
    }

    return (
      <input
        type="text"
        className="form-control form-control-sm mr-1"
        {...inputProps}
        onChange={(event) => { inputProps.onChange(event.target.value); }}
      />
    );
  }

  render = () => {
    if (this.state.editing) {
      return (
        <div className={this.props.className || 'form-inline align-items-start'}>
          {this.renderInput()}
          <button className="btn btn-secondary btn-sm mr-1" onClick={this.cancelEditing}>
            <i className="fa fa-times" />
          </button>
          <button className="btn btn-primary btn-sm" onClick={this.commitEditing}>
            <i className="fa fa-check" />
          </button>
        </div>
      );
    }

    return (
      <div className="d-flex">
        <div>{this.props.children || this.props.value}</div>
        <button className="btn btn-link btn-sm" onClick={this.beginEditing}>
          <i className="fa fa-pencil" />
        </button>
      </div>
    );
  }
}

export default InPlaceEditor;
