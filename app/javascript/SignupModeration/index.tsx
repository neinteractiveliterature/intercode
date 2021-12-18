import { Routes, Route, Navigate } from 'react-router-dom';
import { BootstrapNavLink } from '../UIComponents/BootstrapNavLink';

import CreateSignup from './CreateSignup';
import SignupModerationQueue from './SignupModerationQueue';

function SignupModeration(): JSX.Element {
  return (
    <>
      <h1 className="mb-4">Signup moderation</h1>

      <ul className="nav nav-tabs mb-3" role="tablist">
        <BootstrapNavLink path="/signup_moderation/queue" icon="bi-list-check">
          Moderation queue
        </BootstrapNavLink>
        <BootstrapNavLink path="/signup_moderation/create_signups" icon="bi-plus-circle">
          Create signups
        </BootstrapNavLink>
      </ul>

      <Routes>
        <Route path="queue" element={<SignupModerationQueue />} />
        <Route path="create_signups" element={<CreateSignup />} />
        <Route path="" element={<Navigate to="/signup_moderation/queue" replace />} />
      </Routes>
    </>
  );
}

export default SignupModeration;
