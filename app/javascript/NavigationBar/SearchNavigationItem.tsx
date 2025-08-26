import { useState, useCallback, useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useTranslation } from 'react-i18next';

import SiteSearch from './SiteSearch';
import NavigationBarContext from './NavigationBarContext';
import searchStyles from 'styles/search.module.scss';

function SearchNavigationItem(): React.JSX.Element {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const { setHideBrand, setHideNavItems } = useContext(NavigationBarContext);

  const setVisibleWithHiding = useCallback(
    (newVisible: boolean) => {
      setVisible(newVisible);
      if (newVisible) {
        setHideBrand(true);
        setHideNavItems(true);
      }
    },
    [setHideBrand, setHideNavItems],
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
      <CSSTransition
        timeout={400}
        in={!visible}
        classNames={{
          enterActive: searchStyles.siteSearchNavigationButtonEnterActive,
          enterDone: searchStyles.siteSearchNavigationButtonEnterDone,
          exitActive: searchStyles.siteSearchNavigationButtonExitActive,
          exitDone: searchStyles.siteSearchNavigationButtonExitDone,
        }}
      >
        <button
          className={`btn btn-link nav-link text-end site-search-navigation-button ${searchStyles.siteSearchNavigationButton}`}
          type="button"
          onClick={() => setVisibleWithHiding(true)}
        >
          <i className="bi-search" />
          <span className="visually-hidden">{t('navigation.search.buttonText')}</span>
        </button>
      </CSSTransition>
    </div>
  );
}

export default SearchNavigationItem;
