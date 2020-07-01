import React, {
  useState, useContext, useMemo, useCallback, ReactNode,
} from 'react';
import PropTypes from 'prop-types';
import { ConfirmModal } from 'react-bootstrap4-modal';

import useModal from './useModal';
import ErrorDisplay from '../ErrorDisplay';

export type ConfirmModalState = {
  action: () => any,
  prompt: ReactNode,
  error?: any,
  onCancel?: () => void,
  onError?: (error: any) => void,
  renderError?: (error: any) => ReactNode,
};

export type ConfirmFunction = {
  (state?: ConfirmModalState): void,
  visible: boolean,
};

function defaultConfirm() {}
defaultConfirm.visible = false;

const ConfirmContext = React.createContext<ConfirmFunction>(defaultConfirm);

function Confirm({ children }) {
  const [actionInProgress, setActionInProgress] = useState(false);
  const modal = useModal<ConfirmModalState>();

  const okClicked = async () => {
    setActionInProgress(true);
    try {
      await modal.state?.action();
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

  const contextValue = useMemo(
    () => {
      const augmentedConfirm = (state?: any) => modal.open(state);
      augmentedConfirm.visible = modal.visible;
      return augmentedConfirm;
    },
    [modal],
  );

  const cancelClicked = useCallback(
    () => {
      if (modal.state?.onCancel) {
        modal.state?.onCancel();
      }
      modal.close();
    },
    [modal],
  );

  return (
    <ConfirmContext.Provider value={contextValue}>
      {children}
      <ConfirmModal
        visible={modal.visible}
        onOK={okClicked}
        onCancel={cancelClicked}
        disableButtons={actionInProgress}
      >
        {modal.state?.prompt ?? <div />}
        {
          (modal.state?.renderError && modal.state?.error)
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

export function useGraphQLConfirm(): ConfirmFunction {
  const confirm = useConfirm();
  const defaultRenderError = useCallback(
    (error) => <ErrorDisplay graphQLError={error} />,
    [],
  );
  const augmentedConfirmWithDefaults = useMemo(
    () => {
      const confirmWithDefaults = (options: ConfirmModalState) => confirm(
        { renderError: defaultRenderError, ...options },
      );
      confirmWithDefaults.visible = confirm.visible;
      return confirmWithDefaults;
    },
    [confirm, defaultRenderError],
  );
  return augmentedConfirmWithDefaults;
}

export type ConfirmTriggerProps = {
  children: (confirm: ConfirmFunction) => ReactNode,
};

function ConfirmTrigger({ children }: ConfirmTriggerProps) {
  const confirm = useConfirm();
  return children(confirm);
}

Confirm.Trigger = ConfirmTrigger;

export default Confirm;
