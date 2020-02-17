import React, { useState, useCallback, useContext } from 'react';

import SiteSearch from './SiteSearch';
import NavigationBarContext from './NavigationBarContext';

function SearchNavigationItem() {
  const [visible, setVisible] = useState(false);
  const { setHideBrand, setHideNavItems } = useContext(NavigationBarContext);

  const setVisibleWithHiding = useCallback(
    (newVisible) => {
      setVisible(newVisible);
      setHideBrand(newVisible);
      setHideNavItems(newVisible);
    },
    [setHideBrand, setHideNavItems],
  );

  return (
    <div className="navbar-nav flex-grow-1 justify-content-end mr-2">
      {!visible && (
        <button
          className="btn btn-link nav-link text-right"
          type="button"
          onClick={() => setVisibleWithHiding(true)}
        >
          <i className="fa fa-search" />
          <span className="sr-only">Search</span>
        </button>
      )}
      <SiteSearch
        setVisible={setVisibleWithHiding}
        visible={visible}
        close={() => setVisibleWithHiding(false)}
      />
    </div>
  );
}

export default SearchNavigationItem;
