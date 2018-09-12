import React from 'react';
import PropTypes from 'prop-types';
import { ConfirmModal } from 'react-bootstrap4-modal';

const ConfirmContext = React.createContext(() => {});

export default class Confirm extends React.Component {
  static Trigger = ConfirmContext.Consumer;

  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      action: null,
      prompt: null,
      onError: null,
      displayError: null,
      error: null,
      actionInProgress: false,
    };

    this.startConfirm.setPrompt = prompt => this.setState({ prompt });
  }

  startConfirm = ({
    action, prompt, onError, displayError,
  }) => {
    this.setState({
      action,
      prompt,
      onError,
      displayError,
      error: null,
      actionInProgress: false,
    });
  }

  cancelClicked = () => {
    this.setState({
      action: null, prompt: null, onError: null, error: null, displayError: null,
    });
  }

  okClicked = async () => {
    this.setState({ actionInProgress: true });
    try {
      await this.state.action();
      this.setState({
        action: null, prompt: null, onError: null, error: null, displayError: null,
      });
    } catch (error) {
      if (this.state.onError) {
        this.state.onError(error);
      }

      if (this.state.displayError) {
        this.setState({ error });
      }

      if (!this.state.onError && !this.state.displayError) {
        throw error;
      }
    } finally {
      this.setState({ actionInProgress: false });
    }
  }

  render = () => (
    <ConfirmContext.Provider value={this.startConfirm}>
      {this.props.children}
      <ConfirmModal
        visible={this.state.action != null}
        onOK={this.okClicked}
        onCancel={this.cancelClicked}
        disableButtons={this.state.actionInProgress}
      >
        {this.state.prompt || <div />}
        {
          (this.state.displayError && this.state.error)
            ? this.state.displayError(this.state.error)
            : null
        }
      </ConfirmModal>
    </ConfirmContext.Provider>
  );
}
