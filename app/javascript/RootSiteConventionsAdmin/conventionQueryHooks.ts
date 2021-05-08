import { useParams } from 'react-router-dom';

import { useConventionDisplayQuery } from './queries.generated';

// eslint-disable-next-line import/prefer-default-export
export function useConventionQueryFromIdParam() {
  const { id } = useParams<{ id: string }>();
  return useConventionDisplayQuery({ variables: { id: Number.parseInt(id, 10) } });
}
