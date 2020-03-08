import { useQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';

import { ConventionDisplayQuery } from './queries.gql';

export function useConventionQuery(id) {
  return useQuery(ConventionDisplayQuery, { variables: { id } });
}

export function useConventionQueryFromIdParam() {
  const { id } = useParams();
  return useConventionQuery(Number.parseInt(id, 10));
}
