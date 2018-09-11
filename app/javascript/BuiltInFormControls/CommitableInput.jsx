import React from 'react';
import PropTypes from 'prop-types';

class CommitableInput extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      editingValue: '',
    };
  }

  beginEditing = () => {
    this.setState({ editing: true, editingValue: this.props.value });
  }

  cancelEditing = (event) => {
    event.preventDefault();
    this.setState({ editing: false, editingValue: undefined });
    if (this.input) {
      this.input.blur();
    }
  }

  commitEditing = (event) => {
    event.preventDefault();
    this.props.onChange(this.state.editingValue);
    this.setState({ editing: false, editingValue: undefined });
    if (this.input) {
      this.input.blur();
    }
  }

  blur = () => {
    if (this.state.editingValue === this.props.value) {
      this.setState({ editing: false, editingValue: undefined });
    }
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

  inputChange = (event) => {
    this.setState({ editingValue: event.target.value });
  }

  render = () => {
    const inputProps = {
      className: 'form-control',
      onChange: this.inputChange,
      ref: (element) => { this.input = element; },
    };

    if (this.state.editing) {
      return (
        <div className="input-group">
          <input
            {...inputProps}
            onBlur={this.blur}
            value={this.state.editingValue || ''}
            onKeyDown={this.keyDownInInput}
          />
          <div className="input-group-append">
            <button type="button" className="btn btn-outline-secondary" onClick={this.cancelEditing}>
              <i className="fa fa-times" />
            </button>
            <button type="button" className="btn btn-primary" onClick={this.commitEditing}>
              <i className="fa fa-check" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="input-group">
        <input
          {...inputProps}
          value={this.props.value || ''}
          onFocus={this.beginEditing}
        />
      </div>
    );
  }
}

export default CommitableInput;
