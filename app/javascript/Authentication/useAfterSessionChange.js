import { useCallback } from 'react';
// import { useHistory } from 'react-router-dom';
// import { useApolloClient } from '@apollo/react-hooks';

// import AuthenticityTokensContext from '../AuthenticityTokensContext';
// import AuthenticationModalContext from './AuthenticationModalContext';

export default function useAfterSessionChange() {
  // const history = useHistory();
  // const apolloClient = useApolloClient();
  // const { refresh } = useContext(AuthenticityTokensContext);
  // const { close: closeModal, setUnauthenticatedError } = useContext(AuthenticationModalContext);

  const afterSessionChange = useCallback(
    async (destPath) => {
      let destUrl = new URL(
        destPath || window.location.href,
        window.location.href,
      );

      if (destUrl.host === window.location.host && destUrl.pathname === '/users/sign_in') {
        // don't double sign-in
        destUrl = new URL('/', window.location.href);
      }

      destUrl.searchParams.delete('show_authentication');
      if (destUrl.toString() === window.location.href) {
        window.location.reload();
        // await refresh();
        // await apolloClient.reFetchObservableQueries(true);
        // closeModal();
        // setUnauthenticatedError(false);
      } else if (destUrl.host === window.location.host) {
        window.location.href = destUrl.toString();
        // await refresh();
        // await apolloClient.clearStore();
        // history.push(`${destUrl.pathname}${destUrl.search}${destUrl.hash}`);
        // closeModal();
        // setUnauthenticatedError(false);
        // apolloClient.reFetchObservableQueries(true);
      } else {
        window.location.href = destUrl.toString();
      }
    },
    [],
  );

  return afterSessionChange;
}
