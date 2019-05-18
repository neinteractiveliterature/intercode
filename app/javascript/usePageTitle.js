import { useEffect } from 'react';
import compact from 'lodash-es/compact';

export default function usePageTitle(title, convention) {
  useEffect(
    () => {
      if (title || convention) {
        const titleParts = [title, (convention || {}).name];
        document.title = compact(titleParts).join(' - ');
      }
    },
    [convention, title],
  );
}
