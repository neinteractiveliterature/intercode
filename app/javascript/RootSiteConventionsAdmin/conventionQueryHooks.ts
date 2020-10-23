import { useParams } from 'react-router-dom';

import { useConventionDisplayQueryQuery } from './queries.generated';

// eslint-disable-next-line import/prefer-default-export
export function useConventionQueryFromIdParam() {
  const { id } = useParams<{ id: string }>();
  return useConventionDisplayQueryQuery({ variables: { id: Number.parseInt(id, 10) } });
}
