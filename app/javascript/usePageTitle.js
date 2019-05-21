import { useEffect, useContext } from 'react';
import compact from 'lodash-es/compact';

import AppRootContext from './AppRootContext';

export default function usePageTitle(title) {
  const { conventionName } = useContext(AppRootContext);

  useEffect(
    () => {
      if (title != null) {
        const titleParts = [title === '' ? null : title, conventionName];
        document.title = compact(titleParts).join(' - ');
      }
    },
    [conventionName, title],
  );
}
