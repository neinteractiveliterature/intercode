import { useCallback } from 'react';
import { useToastOnNextPageLoad } from '@neinteractiveliterature/litform';

export default function useAfterSessionChange() {
  const toastOnNextPageLoad = useToastOnNextPageLoad();
  const afterSessionChange = useCallback(
    async (destPath, toastMessage?: Parameters<typeof toastOnNextPageLoad>[0]) => {
      let destUrl = new URL(destPath || window.location.href, window.location.href);

      if (destUrl.host === window.location.host && destUrl.pathname === '/users/sign_in') {
        // don't double sign-in
        destUrl = new URL('/', window.location.href);
      }

      destUrl.searchParams.delete('show_authentication');
      if (toastMessage) {
        toastOnNextPageLoad(toastMessage);
      }

      if (destUrl.toString() === window.location.href) {
        window.location.reload();
      } else if (destUrl.host === window.location.host) {
        window.location.href = destUrl.toString();
      } else {
        window.location.href = destUrl.toString();
      }
    },
    [toastOnNextPageLoad],
  );

  return afterSessionChange;
}
