import React from 'react';
import PropTypes from 'prop-types';
import { ConfirmModal } from 'react-bootstrap4-modal';

import ModalContainer from './ModalContainer';

const ConfirmContext = React.createContext(() => {});

export default class Confirm extends React.Component {
  static Trigger = ConfirmContext.Consumer;

  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      actionInProgress: false,
    };
  }

  okClicked = async (modalState, closeModal, setModalState) => {
    this.setState({ actionInProgress: true });
    try {
      await modalState.action();
      closeModal();
    } catch (error) {
      if (modalState.onError) {
        modalState.onError(error);
      }

      if (modalState.renderError) {
        setModalState({ ...modalState, error });
      }

      if (!modalState.onError && !modalState.renderError) {
        throw error;
      }
    } finally {
      this.setState({ actionInProgress: false });
    }
  }

  render = () => (
    <ModalContainer>
      {({
        modalVisible, modalState, openModal, closeModal, setModalState,
      }) => (
        <ConfirmContext.Provider value={openModal}>
          {this.props.children}
          <ConfirmModal
            visible={modalVisible}
            onOK={() => this.okClicked(modalState, closeModal, setModalState)}
            onCancel={closeModal}
            disableButtons={this.state.actionInProgress}
          >
            {(modalState || {}).prompt || <div />}
            {
              (modalState && modalState.renderError && modalState.error)
                ? modalState.renderError(modalState.error)
                : null
            }
          </ConfirmModal>
        </ConfirmContext.Provider>
      )}
    </ModalContainer>
  );
}
