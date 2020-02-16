import { useMutation } from '@apollo/react-hooks';
import { RateEvent } from './mutations.gql';

export default function useRateEvent() {
  const [rateEventMutate] = useMutation(RateEvent);

  const rateEvent = async (eventId, rating) => {
    await rateEventMutate({
      variables: { eventId, rating },
    });
  };

  return rateEvent;
}
