import { useParams } from 'react-router-dom';

import { useConventionDisplayQuery } from './queries.generated';

export function useConventionQueryFromIdParam(): ReturnType<typeof useConventionDisplayQuery> {
  const { id } = useParams<{ id: string }>();
  if (id == null) {
    throw new Error('id not found in URL params');
  }
  return useConventionDisplayQuery({ variables: { id } });
}
