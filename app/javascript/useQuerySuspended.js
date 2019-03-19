import { useQuery } from 'react-apollo-hooks';

export default function useQuerySuspended(query, options = {}) {
  return useQuery(query, { suspend: true, ...options });
}
