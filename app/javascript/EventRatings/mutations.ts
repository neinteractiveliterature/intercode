import { gql } from '@apollo/client';

export const RateEvent = gql`
  mutation RateEvent($eventId: Int!, $rating: Int!) {
    rateEvent(input: { event_id: $eventId, rating: $rating }) {
      event {
        id
        my_rating
      }
    }
  }
`;
