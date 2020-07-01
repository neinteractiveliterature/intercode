import React, { useContext, ReactNode } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';

import useModal from './useModal';

export type AlertState = {
  message?: ReactNode,
};

export type AlertFunction = (message?: ReactNode) => void;

const AlertContext = React.createContext<{ alert: AlertFunction }>({ alert: () => {} });

export function AlertProvider({ children }) {
  const modal = useModal<AlertState>();
  const alert = modal.open;

  return (
    <AlertContext.Provider value={{ alert }}>
      {children}
      <Modal visible={modal.visible}>
        <div className="modal-body">
          {modal.state?.message ?? <div />}
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
  const { alert } = useContext(AlertContext);
  return alert;
}
