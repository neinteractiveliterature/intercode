import { TabList, TabBody, useTabsWithRouter } from '@neinteractiveliterature/litform';
import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import CreateSignup from './CreateSignup';
import SignupModerationQueue from './SignupModerationQueue';

function SignupModeration(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const fakeHistory = useMemo(() => ({ replace: navigate }), [navigate]);
  const tabProps = useTabsWithRouter(
    [
      {
        id: 'moderation-queue',
        name: 'Moderation queue',
        renderContent: () => <SignupModerationQueue />,
      },
      { id: 'create-signups', name: 'Create signups', renderContent: () => <CreateSignup /> },
    ],
    '/signup_moderation',
    location,
    fakeHistory,
  );

  return (
    <>
      <h1 className="mb-4">Signup moderation</h1>

      <TabList {...tabProps} />
      <div className="mt-2">
        <TabBody {...tabProps} />
      </div>
    </>
  );
}

export default SignupModeration;
