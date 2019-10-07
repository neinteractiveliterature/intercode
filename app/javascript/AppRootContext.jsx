import React from 'react';

const AppRootContext = React.createContext({
  assumedIdentityFromProfile: null,
  cmsNavigationItems: [],
  conventionName: null,
  currentPendingOrder: null,
  currentUser: null,
  myProfile: null,
  rootSiteName: null,
  siteMode: null,
  signupMode: null,
  timezoneName: null,
});

export default AppRootContext;
