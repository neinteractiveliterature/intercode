import React from 'react';
import PropTypes from 'prop-types';
import { ConfirmModal } from 'react-bootstrap4-modal';

const ConfirmContext = React.createContext(() => {});

export class ConfirmProvider extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      action: null,
      prompt: null,
    };
  }

  startConfirm = ({ action, prompt }) => {
    this.setState({ action, prompt });
  }

  cancelClicked = () => {
    this.setState({ action: null, prompt: null });
  }

  okClicked = async () => {
    await this.state.action();
    this.setState({ action: null, prompt: null });
  }

  render = () => (
    <ConfirmContext.Provider value={this.startConfirm}>
      {this.props.children}
      <ConfirmModal
        visible={this.state.action != null}
        onOK={this.okClicked}
        onCancel={this.cancelClicked}
      >
        {this.state.prompt || <div />}
      </ConfirmModal>
    </ConfirmContext.Provider>
  );
}

export const ConfirmConsumer = ConfirmContext.Consumer;
