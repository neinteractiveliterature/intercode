import React from 'react';

const NavigationBarContext = React.createContext({
  hideBrand: false,
  setHideBrand: () => {},
  hideNavItems: false,
  setHideNavItems: () => {},
});

export default NavigationBarContext;
