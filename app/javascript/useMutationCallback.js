import { useMutation } from 'react-apollo-hooks';

// TODO: replace all usage of this with plain useMutation now that it's using a callback
// there's a lot of legacy uses of this workaround hook
export default function useMutationCallback(mutation, baseOptions) {
  const [mutate] = useMutation(mutation, baseOptions);
  return mutate;
}
