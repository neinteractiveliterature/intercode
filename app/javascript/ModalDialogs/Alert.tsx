import React, { useContext, ReactNode } from 'react';
import Modal from 'react-bootstrap4-modal';
import { useTranslation } from 'react-i18next';

import useModal from './useModal';

export type AlertState = {
  message?: ReactNode;
};

export type AlertFunction = (message?: ReactNode) => void;

const AlertContext = React.createContext<{ alert: AlertFunction }>({ alert: () => {} });

export type AlertProviderProps = {
  children: ReactNode;
};

export function AlertProvider({ children }: AlertProviderProps) {
  const { t } = useTranslation();
  const modal = useModal<AlertState>();
  const alert = modal.open;

  return (
    <AlertContext.Provider value={{ alert }}>
      {children}
      <Modal visible={modal.visible}>
        <div className="modal-body">{modal.state?.message ?? <div />}</div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={modal.close}>
            {t('buttons.ok', 'OK')}
          </button>
        </div>
      </Modal>
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const { alert } = useContext(AlertContext);
  return alert;
}
