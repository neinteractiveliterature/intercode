import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class CommitableInput extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    renderInput: PropTypes.func,
    placeholder: PropTypes.string,
    label: PropTypes.string,
  };

  static defaultProps = {
    value: null,
    className: null,
    onCancel: null,
    disabled: false,
    renderInput: null,
    placeholder: null,
    label: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      editingValue: '',
      commitInProgress: false,
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
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  commitEditing = async (event) => {
    event.preventDefault();
    this.setState({ commitInProgress: true });
    try {
      await this.props.onChange(this.state.editingValue);
      this.setState({ editing: false, editingValue: undefined, commitInProgress: false });
      if (this.input) {
        this.input.blur();
      }
    } catch (error) {
      this.setState({ commitInProgress: false }, () => {
        if (this.input) {
          this.input.focus();
        }
      });
      throw error;
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
      className: classNames('form-control', this.props.className),
      onChange: this.inputChange,
      ref: (element) => { this.input = element; },
      placeholder: this.props.placeholder,
      'aria-label': this.props.label,
    };

    const renderInput = this.props.renderInput || ((props) => <input {...props} />);

    if (this.state.editing) {
      return (
        <div className="input-group">
          {renderInput({
            ...inputProps,
            onBlur: this.blur,
            value: this.state.editingValue || '',
            onKeyDown: this.keyDownInInput,
            disabled: this.state.commitInProgress,
          })}
          <div className="input-group-append">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={this.cancelEditing}
              disabled={this.props.disabled || this.state.commitInProgress}
            >
              <i className="fa fa-times" />
              <span className="sr-only">Cancel changes</span>
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.commitEditing}
              disabled={this.props.disabled || this.state.commitInProgress}
            >
              <i className="fa fa-check" />
              <span className="sr-only">Commit changes</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="input-group">
        {renderInput({
          ...inputProps,
          value: this.props.value || '',
          onFocus: this.beginEditing,
          disabled: this.props.disabled,
        })}
        <div className="input-group-append">
          {
            this.props.value
              ? (
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onMouseDown={() => { this.props.onChange(''); }}
                  disabled={this.props.disabled || !this.props.value}
                >
                  <i className="fa fa-times-rectangle">
                    <span className="sr-only">Clear</span>
                  </i>
                </button>
              )
              : null
          }
        </div>
      </div>
    );
  }
}

export default CommitableInput;
