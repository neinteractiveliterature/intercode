import { useEffect, useContext } from 'react';
import compact from 'lodash/compact';

import AppRootContext from './AppRootContext';

export default function usePageTitle(title) {
  const { conventionName, rootSiteName } = useContext(AppRootContext);

  useEffect(
    () => {
      if (title != null) {
        const titleParts = [title === '' ? null : title, conventionName || rootSiteName];
        document.title = compact(titleParts).join(' - ');
      }
    },
    [conventionName, title, rootSiteName],
  );
}
