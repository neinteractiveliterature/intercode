import { useParams } from 'react-router-dom';
import { useSignupAdminEventQuery } from './queries.generated';

export function useSignupAdminEventQueryFromParams() {
  const { eventId } = useParams();
  return useSignupAdminEventQuery({ variables: { eventId: eventId ?? '' } });
}
