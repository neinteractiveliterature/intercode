import React from 'react';

import { useTabs, TabList, TabBody } from '../UIComponents/Tabs';
import CreateSignup from './CreateSignup';

function SignupModeration() {
  const tabProps = useTabs([
    { id: 'moderation-queue', name: 'Moderation queue', renderContent: () => 'hi' },
    { id: 'create-signups', name: 'Create signups', renderContent: () => <CreateSignup /> },
  ]);

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
