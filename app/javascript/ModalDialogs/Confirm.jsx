import React, {
  useState, useContext, useMemo, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { ConfirmModal } from 'react-bootstrap4-modal';

import useModal from './useModal';
import ErrorDisplay from '../ErrorDisplay';

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

  const contextValue = useMemo(
    () => {
      const augmentedConfirm = (...args) => modal.open(...args);
      augmentedConfirm.visible = modal.visible;
      return augmentedConfirm;
    },
    [modal],
  );

  const cancelClicked = useCallback(
    () => {
      if (modal.onCancel) {
        modal.onCancel();
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

export function useGraphQLConfirm() {
  const confirm = useConfirm();
  const defaultRenderError = useCallback(
    (error) => <ErrorDisplay graphQLError={error} />,
    [],
  );
  const augmentedConfirmWithDefaults = useMemo(
    () => {
      const confirmWithDefaults = (options, ...args) => confirm(
        { renderError: defaultRenderError, ...options },
        ...args,
      );
      confirmWithDefaults.visible = confirm.visible;
      return confirmWithDefaults;
    },
    [confirm, defaultRenderError],
  );
  return augmentedConfirmWithDefaults;
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
