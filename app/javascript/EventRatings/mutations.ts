import { gql } from '@apollo/client';

export const RateEvent = gql`
  mutation RateEvent($eventId: ID!, $rating: Int!) {
    rateEvent(input: { eventId: $eventId, rating: $rating }) {
      event {
        id
        my_rating
      }
    }
  }
`;
