import React from 'react';
import { SignupMode, SiteMode, TicketMode } from './graphqlTypes.generated';

type AppRootContext = {
  assumedIdentityFromProfile?: any,
  cmsNavigationItems: any[],
  conventionAcceptingProposals?: boolean | null,
  conventionCanceled?: boolean | null,
  conventionDomain?: string | null,
  conventionName?: string | null,
  currentAbility: any,
  currentPendingOrder?: any | null,
  currentUser?: any | null,
  myProfile?: any | null,
  rootSiteName?: string | null,
  signupMode?: SignupMode,
  siteMode?: SiteMode,
  ticketsAvailableForPurchase?: boolean | null,
  ticketMode?: TicketMode | null,
  ticketName?: string,
  ticketTypes?: any[],
  timezoneName: string
};

const AppRootContext = React.createContext<AppRootContext>({
  assumedIdentityFromProfile: null,
  cmsNavigationItems: [],
  conventionAcceptingProposals: null,
  conventionCanceled: false,
  conventionName: null,
  conventionDomain: null,
  currentAbility: {},
  currentPendingOrder: null,
  currentUser: null,
  myProfile: null,
  rootSiteName: null,
  siteMode: undefined,
  signupMode: undefined,
  ticketsAvailableForPurchase: null,
  ticketMode: null,
  ticketName: 'ticket',
  ticketTypes: [],
  timezoneName: 'Etc/UTC',
});

export default AppRootContext;
