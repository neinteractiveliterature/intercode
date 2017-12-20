import React from 'react';
import PropTypes from 'prop-types';

class InPlaceEditor extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.node,
  };

  static defaultProps = {
    children: null,
  }

  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      editingValue: '',
    };
  }

  inputChanged = (event) => {
    this.setState({ editingValue: event.target.value });
  }

  beginEditing = (event) => {
    event.preventDefault();
    this.setState(
      { editing: true, editingValue: this.props.value },
      () => { this.input.focus(); },
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

  render = () => {
    if (this.state.editing) {
      return (
        <div className="form-inline">
          <input
            type="text"
            value={this.state.editingValue}
            onChange={this.inputChanged}
            onKeyDown={this.keyDownInInput}
            className="form-control form-control-sm mr-1"
            ref={(input) => { this.input = input; }}
          />
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
