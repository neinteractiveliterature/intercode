import { useEffect, useContext } from 'react';

import AppRootContext from './AppRootContext';
import { notEmpty } from '@neinteractiveliterature/litform';

export default function usePageTitle(title?: string | null): void {
  const { conventionName, rootSiteName } = useContext(AppRootContext);

  useEffect(() => {
    if (title != null) {
      const titleParts = [title === '' ? null : title, conventionName || rootSiteName];
      document.title = titleParts.filter(notEmpty).join(' - ');
    }
  }, [conventionName, title, rootSiteName]);
}
