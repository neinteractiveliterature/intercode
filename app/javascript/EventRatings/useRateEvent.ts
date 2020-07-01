import { useRateEventMutation } from './mutations.generated';

export default function useRateEvent() {
  const [rateEventMutate] = useRateEventMutation();

  const rateEvent = async (eventId: number, rating: number) => {
    await rateEventMutate({
      variables: { eventId, rating },
    });
  };

  return rateEvent;
}
