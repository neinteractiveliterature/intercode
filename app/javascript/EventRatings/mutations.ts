import gql from 'graphql-tag';

// eslint-disable-next-line import/prefer-default-export
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
