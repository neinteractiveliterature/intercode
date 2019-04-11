import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { ConfirmModal } from 'react-bootstrap4-modal';

import useModal from './useModal';

const ConfirmContext = React.createContext(() => {});

function Confirm({ children }) {
  const [actionInProgress, setActionInProgress] = useState(false);
  const modal = useModal();

  const okClicked = async () => {
    setActionInProgress(true);
    try {
      await modal.state.action();
      modal.close();
    } catch (error) {
      if (modal.state && modal.state.onError) {
        modal.state.onError(error);
      }

      if (modal.state && modal.state.renderError) {
        modal.setState({ ...modal.state, error });
      }

      if (!modal.state || (!modal.state.onError && !modal.state.renderError)) {
        throw error;
      }
    } finally {
      setActionInProgress(false);
    }
  };

  const augmentedConfirm = (...args) => modal.open(...args);
  augmentedConfirm.visible = modal.visible;

  return (
    <ConfirmContext.Provider value={augmentedConfirm}>
      {children}
      <ConfirmModal
        visible={modal.visible}
        onOK={okClicked}
        onCancel={modal.close}
        disableButtons={actionInProgress}
      >
        {(modal.state || {}).prompt || <div />}
        {
          (modal.state && modal.state.renderError && modal.state.error)
            ? modal.state.renderError(modal.state.error)
            : null
        }
      </ConfirmModal>
    </ConfirmContext.Provider>
  );
}

Confirm.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useConfirm() {
  const confirm = useContext(ConfirmContext);
  return confirm;
}

function ConfirmTrigger({ children }) {
  const confirm = useConfirm();
  return children(confirm);
}

ConfirmTrigger.propTypes = {
  children: PropTypes.func.isRequired,
};

Confirm.Trigger = ConfirmTrigger;

export default Confirm;
