import { useRevalidator } from 'react-router';
import { useApolloClient } from '@apollo/client/react';
import { RateEventDocument } from './mutations.generated';

export default function useRateEvent(): (eventId: string, rating: number) => Promise<void> {
  const revalidator = useRevalidator();
  const client = useApolloClient();
  const rateEvent = async (eventId: string, rating: number) => {
    await client.mutate({
      mutation: RateEventDocument,
      variables: { eventId, rating },
    });
    revalidator.revalidate();
  };

  return rateEvent;
}
