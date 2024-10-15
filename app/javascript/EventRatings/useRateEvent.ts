import { useRevalidator } from 'react-router';
import { RateEventDocument } from './mutations.generated';
import { useApolloClient } from '@apollo/client';

export default function useRateEvent(): (eventId: string, rating: number) => Promise<void> {
  const client = useApolloClient();
  const revalidator = useRevalidator();
  const rateEvent = async (eventId: string, rating: number) => {
    await client.mutate({
      mutation: RateEventDocument,
      variables: { eventId, rating },
    });
    revalidator.revalidate();
  };

  return rateEvent;
}
