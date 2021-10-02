import { useRateEventMutation } from './mutations.generated';

export default function useRateEvent(): (eventId: number, rating: number) => Promise<void> {
  const [rateEventMutate] = useRateEventMutation();

  const rateEvent = async (eventId: number, rating: number) => {
    await rateEventMutate({
      variables: { eventId, rating },
    });
  };

  return rateEvent;
}
