import React from 'react';
import usePageTitle from '../usePageTitle';

function OAuthApplications() {
  // cop-out?  maybe.

  usePageTitle('OAuth2 applications');

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
