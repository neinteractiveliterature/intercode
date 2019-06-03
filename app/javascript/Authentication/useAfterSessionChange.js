import { useCallback, useContext } from 'react';
import { useApolloClient } from 'react-apollo-hooks';

import AuthenticityTokensContext from '../AuthenticityTokensContext';
import AuthenticationModalContext from './AuthenticationModalContext';

export default function useAfterSessionChange(history) {
  const apolloClient = useApolloClient();
  const { refresh } = useContext(AuthenticityTokensContext);
  const { close: closeModal } = useContext(AuthenticationModalContext);

  const afterSessionChange = useCallback(
    async (destPath) => {
      const destUrl = new URL(
        destPath || window.location.href,
        window.location.href,
      );
      destUrl.searchParams.delete('show_authentication');
      if (destUrl.toString() === window.location.href) {
        await refresh();
        await apolloClient.clearStore();
        closeModal();
      } else if (destUrl.host === window.location.host) {
        await refresh();
        await apolloClient.clearStore();
        history.push(`${destUrl.pathname}${destUrl.search}${destUrl.hash}`);
        closeModal();
      } else {
        window.location.href = destUrl.toString();
      }
    },
    [apolloClient, closeModal, history, refresh],
  );

  return afterSessionChange;
}
