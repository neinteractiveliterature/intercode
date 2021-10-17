import { useParams } from 'react-router-dom';

import { useConventionDisplayQuery } from './queries.generated';

export function useConventionQueryFromIdParam(): ReturnType<typeof useConventionDisplayQuery> {
  const { id } = useParams<{ id: string }>();
  return useConventionDisplayQuery({ variables: { id: Number.parseInt(id, 10) } });
}
