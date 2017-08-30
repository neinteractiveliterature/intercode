// @flow

import React from 'react';

type Props = {
  value: string,
  onChange: (string) => void,
  children?: React.Children
};

type State = {
  editing: boolean,
  editingValue: string,
};

class InPlaceEditor extends React.Component {
  static defaultProps = {
    children: null,
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      editing: false,
      editingValue: '',
    };
  }

  state: State
  props: Props
  input: HTMLElement

  inputChanged = (event: SyntheticInputEvent) => {
    this.setState({ editingValue: event.target.value });
  }

  beginEditing = () => {
    this.setState(
      { editing: true, editingValue: this.props.value },
      () => { this.input.focus(); },
    );
  }

  cancelEditing = () => {
    this.setState({ editing: false, editingValue: undefined });
  }

  commitEditing = () => {
    this.props.onChange(this.state.editingValue);
    this.setState({ editing: false, editingValue: undefined });
  }

  keyDownInInput = (event: KeyboardEvent) => {
    switch (event.keyCode) {
      case 27:
        event.preventDefault();
        this.cancelEditing();
        break;

      case 13:
        event.preventDefault();
        this.commitEditing();
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
