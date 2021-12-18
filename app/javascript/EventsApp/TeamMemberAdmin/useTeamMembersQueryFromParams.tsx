import { useParams } from 'react-router-dom';
import { useTeamMembersQuery } from './queries.generated';

export default function useTeamMembersQueryFromParams() {
  const eventId = useParams<{ eventId: string }>().eventId;
  return useTeamMembersQuery({ variables: { eventId: eventId ?? '' } });
}
