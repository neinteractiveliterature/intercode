import React from 'react';

type AppRootContext = {
  assumedIdentityFromProfile?: any,
  cmsNavigationItems: any[],
  conventionAcceptingProposals: boolean | null,
  conventionCanceled: boolean | null,
  conventionDomain: string | null,
  conventionName: string | null,
  currentAbility: any,
  currentPendingOrder: any | null,
  currentUser: any | null,
  myProfile: any | null,
  rootSiteName: string | null,
  signupMode: string | null,
  siteMode: string | null,
  ticketsAvailableForPurchase: boolean | null,
  ticketMode: string | null,
  ticketName: string,
  ticketTypes: any[],
  timezoneName: string
};

const AppRootContext = React.createContext<AppRootContext>({
  assumedIdentityFromProfile: null,
  cmsNavigationItems: [],
  conventionAcceptingProposals: false,
  conventionCanceled: false,
  conventionName: null,
  conventionDomain: null,
  currentAbility: {},
  currentPendingOrder: null,
  currentUser: null,
  myProfile: null,
  rootSiteName: null,
  siteMode: null,
  signupMode: null,
  ticketsAvailableForPurchase: null,
  ticketMode: null,
  ticketName: 'ticket',
  ticketTypes: [],
  timezoneName: 'Etc/UTC',
});

export default AppRootContext;
