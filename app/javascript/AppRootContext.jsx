import React from 'react';

const AppRootContext = React.createContext({
  conventionName: null,
  siteMode: null,
  signupMode: null,
  timezoneName: null,
});

export default AppRootContext;
