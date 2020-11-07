import * as React from 'react';

export type NavigationBarContextValue = {
  hideBrand: boolean;
  setHideBrand: React.Dispatch<boolean>;
  hideNavItems: boolean;
  setHideNavItems: React.Dispatch<boolean>;
};

const NavigationBarContext = React.createContext<NavigationBarContextValue>({
  hideBrand: false,
  setHideBrand: () => {},
  hideNavItems: false,
  setHideNavItems: () => {},
});

export default NavigationBarContext;
