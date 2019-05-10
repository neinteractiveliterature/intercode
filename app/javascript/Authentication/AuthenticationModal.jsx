import React, { useContext } from 'react';
import Modal from 'react-bootstrap4-modal';

import SignInForm from './SignInForm';
import AuthenticationModalContext from './AuthenticationModalContext';

function AuthenticationModal() {
  const { visible, currentView } = useContext(AuthenticationModalContext);

  const renderView = () => {
    if (currentView === 'signIn') {
      return <SignInForm />;
    }

    return <></>;
  };

  return (
    <Modal visible={visible}>
      {renderView()}
    </Modal>
  );
}

export default AuthenticationModal;
