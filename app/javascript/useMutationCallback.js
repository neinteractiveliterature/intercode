import { useCallback } from 'react';
import { useApolloClient } from 'react-apollo-hooks';

// Temporary workaround because react-apollo-hooks 0.4.4 doesn't wrap the useMutation return
// function with useCallback, which we need in order to use it as an effect dependency
//
// It looks like https://github.com/trojanowski/react-apollo-hooks/pull/93 will solve it once
// merged (although it is also a breaking change, grr)
export default function useMutationCallback(mutation, baseOptions) {
  const client = useApolloClient((baseOptions || {}).client);

  return useCallback(
    (options) => {
      const { client: overrideClient, ...otherBaseOptions } = (baseOptions || {});

      return client.mutate({
        mutation,
        ...(otherBaseOptions || {}),
        ...options,
      });
    },
    [client, mutation, baseOptions],
  );
}
