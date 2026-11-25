import { useState, useCallback, useContext, useEffect, lazy, Suspense, ComponentType } from 'react';
import { useTranslation } from 'react-i18next';

import { checkAppEntrypointHeadersOnError } from '../checkAppEntrypointHeadersMatch';
import { afterContentShown } from '../contentShown';
import NavigationBarContext from './NavigationBarContext';
import type { SiteSearchProps } from './SiteSearch';
import searchStyles from 'styles/search.module.scss';
import { useTransitionState } from 'react-transition-state';

// The search box brings react-select with it, so it loads once the page is showing. If it can't be loaded, the page is
// still worth keeping without it.
const SiteSearch = lazy<ComponentType<SiteSearchProps>>(() =>
  checkAppEntrypointHeadersOnError<{ default: ComponentType<SiteSearchProps> }>(() => import('./SiteSearch')).catch(
    () => ({ default: () => null }),
  ),
);

function SearchNavigationItem(): React.JSX.Element {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const { setHideBrand, setHideNavItems } = useContext(NavigationBarContext);
  const [transitionState, toggleTransition] = useTransitionState({ timeout: 400, initialEntered: !visible });

  // Mounted without waiting for a click, since it also listens for its keyboard shortcut
  const [contentShown, setContentShown] = useState(false);
  useEffect(() => {
    let mounted = true;
    afterContentShown().then(() => {
      if (mounted) {
        setContentShown(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

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
      {(contentShown || visible) && (
        <Suspense fallback={null}>
          <SiteSearch
            setVisible={setVisibleWithHiding}
            visible={visible}
            visibilityChangeComplete={visibilityChangeComplete}
          />
        </Suspense>
      )}
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
