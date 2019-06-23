import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';

import useModal from './useModal';

const AlertContext = React.createContext(() => {});

export function AlertProvider({ children }) {
  const modal = useModal();

  return (
    <AlertContext.Provider value={modal}>
      {children}
      <Modal visible={modal.visible}>
        <div className="modal-body">
          {(modal.state || {}).message || <div />}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={modal.close}>
            OK
          </button>
        </div>
      </Modal>
    </AlertContext.Provider>
  );
}

AlertProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAlert() {
  const alertModal = useContext(AlertContext);
  return message => alertModal.open({ message });
}
