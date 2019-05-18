import React from 'react';

function OAuthApplications() {
  // cop-out?  maybe.

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
