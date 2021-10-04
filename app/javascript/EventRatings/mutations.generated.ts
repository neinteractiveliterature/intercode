/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type RateEventMutationVariables = Types.Exact<{
  eventId: Types.Scalars['Int'];
  rating: Types.Scalars['Int'];
}>;


export type RateEventMutationData = { __typename: 'Mutation', rateEvent: { __typename: 'RateEventPayload', event: { __typename: 'Event', my_rating?: number | null | undefined, id: string } } };


export const RateEventDocument = gql`
    mutation RateEvent($eventId: Int!, $rating: Int!) {
  rateEvent(input: {event_id: $eventId, rating: $rating}) {
    event {
      id: transitionalId
      my_rating
    }
  }
}
    `;
export type RateEventMutationFn = Apollo.MutationFunction<RateEventMutationData, RateEventMutationVariables>;

/**
 * __useRateEventMutation__
 *
 * To run a mutation, you first call `useRateEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRateEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rateEventMutation, { data, loading, error }] = useRateEventMutation({
 *   variables: {
 *      eventId: // value for 'eventId'
 *      rating: // value for 'rating'
 *   },
 * });
 */
export function useRateEventMutation(baseOptions?: Apollo.MutationHookOptions<RateEventMutationData, RateEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RateEventMutationData, RateEventMutationVariables>(RateEventDocument, options);
      }
export type RateEventMutationHookResult = ReturnType<typeof useRateEventMutation>;
export type RateEventMutationResult = Apollo.MutationResult<RateEventMutationData>;
export type RateEventMutationOptions = Apollo.BaseMutationOptions<RateEventMutationData, RateEventMutationVariables>;