import { useRateEventMutation } from './mutations.generated';

export default function useRateEvent(): (eventId: string, rating: number) => Promise<void> {
  const [rateEventMutate] = useRateEventMutation();

  const rateEvent = async (eventId: string, rating: number) => {
    await rateEventMutate({
      variables: { eventId, rating },
    });
  };

  return rateEvent;
}
