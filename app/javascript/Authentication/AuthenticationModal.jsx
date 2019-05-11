import React, { lazy, Suspense, useContext } from 'react';
import Modal from 'react-bootstrap4-modal';

import AuthenticationModalContext from './AuthenticationModalContext';

const SignInForm = lazy(() => import(/* webpackChunkName: "authentication-forms" */ './SignInForm'));
const SignUpForm = lazy(() => import(/* webpackChunkName: "authentication-forms" */ './SignUpForm'));

function AuthenticationModal() {
  const { visible, currentView } = useContext(AuthenticationModalContext);

  const renderView = () => {
    if (currentView === 'signIn') {
      return <SignInForm />;
    }

    if (currentView === 'signUp') {
      return <SignUpForm />;
    }

    return <></>;
  };

  return (
    <Modal visible={visible} dialogClassName="modal-lg">
      <Suspense fallback={<></>}>
        {renderView()}
      </Suspense>
    </Modal>
  );
}

export default AuthenticationModal;
