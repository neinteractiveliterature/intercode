import { useState, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import SiteSearch from './SiteSearch';
import NavigationBarContext from './NavigationBarContext';
import searchStyles from 'styles/search.module.scss';
import { useTransitionState } from 'react-transition-state';

function SearchNavigationItem(): React.JSX.Element {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const { setHideBrand, setHideNavItems } = useContext(NavigationBarContext);
  const [transitionState, toggleTransition] = useTransitionState({ timeout: 400, initialEntered: !visible });

  const setVisibleWithHiding = useCallback(
    (newVisible: boolean) => {
      setVisible(newVisible);
      if (newVisible) {
        setHideBrand(true);
        setHideNavItems(true);
      }
      toggleTransition(!newVisible);
    },
    [setHideBrand, setHideNavItems, toggleTransition],
  );

  const visibilityChangeComplete = useCallback(
    (newVisible: boolean) => {
      if (!newVisible) {
        setHideBrand(false);
        setHideNavItems(false);
      }
    },
    [setHideBrand, setHideNavItems],
  );

  return (
    <div className="navbar-nav flex-grow-1 justify-content-end me-2" style={{ position: 'relative' }}>
      <SiteSearch
        setVisible={setVisibleWithHiding}
        visible={visible}
        visibilityChangeComplete={visibilityChangeComplete}
      />
      <button
        className={`btn btn-link nav-link text-end site-search-navigation-button ${searchStyles.siteSearchNavigationButton} ${transitionState.status}`}
        type="button"
        onClick={() => setVisibleWithHiding(true)}
      >
        <i className="bi-search" />
        <span className="visually-hidden">{t('navigation.search.buttonText')}</span>
      </button>
    </div>
  );
}

export default SearchNavigationItem;
