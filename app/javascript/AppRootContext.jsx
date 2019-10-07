import React from 'react';

const AppRootContext = React.createContext({
  assumedIdentityFromProfile: null,
  cmsNavigationItems: [],
  conventionAcceptingProposals: null,
  conventionName: null,
  currentAbility: {},
  currentPendingOrder: null,
  currentUser: null,
  myProfile: null,
  rootSiteName: null,
  siteMode: null,
  signupMode: null,
  ticketsAvailableForPurchase: null,
  ticketName: null,
  ticketTypes: null,
  timezoneName: null,
});

export default AppRootContext;
