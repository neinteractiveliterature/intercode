import React, { lazy, Suspense, useContext } from 'react';
import Modal from 'react-bootstrap4-modal';

import AuthenticationModalContext from './AuthenticationModalContext';

const ForgotPasswordForm = lazy(() => import(/* webpackChunkName: "authentication-forms" */ './ForgotPasswordForm'));
const SignInForm = lazy(() => import(/* webpackChunkName: "authentication-forms" */ './SignInForm'));
const SignUpForm = lazy(() => import(/* webpackChunkName: "authentication-forms" */ './SignUpForm'));

function AuthenticationModal() {
  const { visible, currentView } = useContext(AuthenticationModalContext);

  const renderView = () => {
    switch (currentView) {
      case 'signIn': return <SignInForm />;
      case 'signUp': return <SignUpForm />;
      case 'forgotPassword': return <ForgotPasswordForm />;
      default: return <></>;
    }
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
