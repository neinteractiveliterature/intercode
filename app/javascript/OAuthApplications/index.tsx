import React from 'react';
import usePageTitle from '../usePageTitle';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';

function OAuthApplications() {
  const authorizationWarning = useAuthorizationRequired('can_manage_oauth_applications');

  // cop-out?  maybe.

  usePageTitle('OAuth2 applications');

  if (authorizationWarning) return authorizationWarning;

  return (
    <iframe
      className="border rounded-lg w-100"
      style={{ height: '90vh' }}
      title="Doorkeeper applications admin"
      src="/oauth/applications"
    />
  );
}

export default OAuthApplications;
