/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { TeamMemberFieldsFragmentDoc } from './queries.generated';
import { TeamMemberFieldsWithoutPersonalInfoFragmentDoc } from './queries.generated';
import { TeamMemberTicketFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CreateTeamMemberMutationVariables = Types.Exact<{
  input: Types.CreateTeamMemberInput;
}>;


export type CreateTeamMemberMutationData = { __typename: 'Mutation', createTeamMember: { __typename: 'CreateTeamMemberPayload', team_member: { __typename: 'TeamMember', id: string, display_team_member: boolean, show_email: boolean, receive_con_email: boolean, receive_signup_email: Types.ReceiveSignupEmail, user_con_profile: { __typename: 'UserConProfile', id: string, name_without_nickname: string, name_inverted: string, email?: string | null | undefined, mobile_phone?: string | null | undefined, ticket?: { __typename: 'Ticket', id: string, user_con_profile: { __typename: 'UserConProfile', id: string }, ticket_type: { __typename: 'TicketType', id: string, name: string }, provided_by_event?: { __typename: 'Event', id: string, title?: string | null | undefined } | null | undefined } | null | undefined } } } };

export type DeleteTeamMemberMutationVariables = Types.Exact<{
  input: Types.DeleteTeamMemberInput;
}>;


export type DeleteTeamMemberMutationData = { __typename: 'Mutation', deleteTeamMember: { __typename: 'DeleteTeamMemberPayload', team_member: { __typename: 'TeamMember', id: string, display_team_member: boolean, show_email: boolean, receive_con_email: boolean, receive_signup_email: Types.ReceiveSignupEmail, user_con_profile: { __typename: 'UserConProfile', id: string, name_without_nickname: string, name_inverted: string, email?: string | null | undefined, ticket?: { __typename: 'Ticket', id: string, user_con_profile: { __typename: 'UserConProfile', id: string }, ticket_type: { __typename: 'TicketType', id: string, name: string }, provided_by_event?: { __typename: 'Event', id: string, title?: string | null | undefined } | null | undefined } | null | undefined } } } };

export type UpdateTeamMemberMutationVariables = Types.Exact<{
  input: Types.UpdateTeamMemberInput;
}>;


export type UpdateTeamMemberMutationData = { __typename: 'Mutation', updateTeamMember: { __typename: 'UpdateTeamMemberPayload', team_member: { __typename: 'TeamMember', id: string, display_team_member: boolean, show_email: boolean, receive_con_email: boolean, receive_signup_email: Types.ReceiveSignupEmail, user_con_profile: { __typename: 'UserConProfile', id: string, name_without_nickname: string, name_inverted: string, email?: string | null | undefined, ticket?: { __typename: 'Ticket', id: string, user_con_profile: { __typename: 'UserConProfile', id: string }, ticket_type: { __typename: 'TicketType', id: string, name: string }, provided_by_event?: { __typename: 'Event', id: string, title?: string | null | undefined } | null | undefined } | null | undefined } } } };

export type ProvideEventTicketMutationVariables = Types.Exact<{
  eventId: Types.Scalars['ID'];
  userConProfileId: Types.Scalars['ID'];
  ticketTypeId: Types.Scalars['ID'];
}>;


export type ProvideEventTicketMutationData = { __typename: 'Mutation', provideEventTicket: { __typename: 'ProvideEventTicketPayload', ticket: { __typename: 'Ticket', id: string, user_con_profile: { __typename: 'UserConProfile', id: string }, ticket_type: { __typename: 'TicketType', id: string, name: string }, provided_by_event?: { __typename: 'Event', id: string, title?: string | null | undefined } | null | undefined } } };


export const CreateTeamMemberDocument = gql`
    mutation CreateTeamMember($input: CreateTeamMemberInput!) {
  createTeamMember(input: $input) {
    team_member {
      id
      ...TeamMemberFields
    }
  }
}
    ${TeamMemberFieldsFragmentDoc}`;
export type CreateTeamMemberMutationFn = Apollo.MutationFunction<CreateTeamMemberMutationData, CreateTeamMemberMutationVariables>;

/**
 * __useCreateTeamMemberMutation__
 *
 * To run a mutation, you first call `useCreateTeamMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTeamMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTeamMemberMutation, { data, loading, error }] = useCreateTeamMemberMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTeamMemberMutation(baseOptions?: Apollo.MutationHookOptions<CreateTeamMemberMutationData, CreateTeamMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTeamMemberMutationData, CreateTeamMemberMutationVariables>(CreateTeamMemberDocument, options);
      }
export type CreateTeamMemberMutationHookResult = ReturnType<typeof useCreateTeamMemberMutation>;
export type CreateTeamMemberMutationResult = Apollo.MutationResult<CreateTeamMemberMutationData>;
export type CreateTeamMemberMutationOptions = Apollo.BaseMutationOptions<CreateTeamMemberMutationData, CreateTeamMemberMutationVariables>;
export const DeleteTeamMemberDocument = gql`
    mutation DeleteTeamMember($input: DeleteTeamMemberInput!) {
  deleteTeamMember(input: $input) {
    team_member {
      id
      ...TeamMemberFieldsWithoutPersonalInfo
    }
  }
}
    ${TeamMemberFieldsWithoutPersonalInfoFragmentDoc}`;
export type DeleteTeamMemberMutationFn = Apollo.MutationFunction<DeleteTeamMemberMutationData, DeleteTeamMemberMutationVariables>;

/**
 * __useDeleteTeamMemberMutation__
 *
 * To run a mutation, you first call `useDeleteTeamMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTeamMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTeamMemberMutation, { data, loading, error }] = useDeleteTeamMemberMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteTeamMemberMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTeamMemberMutationData, DeleteTeamMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTeamMemberMutationData, DeleteTeamMemberMutationVariables>(DeleteTeamMemberDocument, options);
      }
export type DeleteTeamMemberMutationHookResult = ReturnType<typeof useDeleteTeamMemberMutation>;
export type DeleteTeamMemberMutationResult = Apollo.MutationResult<DeleteTeamMemberMutationData>;
export type DeleteTeamMemberMutationOptions = Apollo.BaseMutationOptions<DeleteTeamMemberMutationData, DeleteTeamMemberMutationVariables>;
export const UpdateTeamMemberDocument = gql`
    mutation UpdateTeamMember($input: UpdateTeamMemberInput!) {
  updateTeamMember(input: $input) {
    team_member {
      id
      ...TeamMemberFieldsWithoutPersonalInfo
    }
  }
}
    ${TeamMemberFieldsWithoutPersonalInfoFragmentDoc}`;
export type UpdateTeamMemberMutationFn = Apollo.MutationFunction<UpdateTeamMemberMutationData, UpdateTeamMemberMutationVariables>;

/**
 * __useUpdateTeamMemberMutation__
 *
 * To run a mutation, you first call `useUpdateTeamMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTeamMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTeamMemberMutation, { data, loading, error }] = useUpdateTeamMemberMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTeamMemberMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTeamMemberMutationData, UpdateTeamMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTeamMemberMutationData, UpdateTeamMemberMutationVariables>(UpdateTeamMemberDocument, options);
      }
export type UpdateTeamMemberMutationHookResult = ReturnType<typeof useUpdateTeamMemberMutation>;
export type UpdateTeamMemberMutationResult = Apollo.MutationResult<UpdateTeamMemberMutationData>;
export type UpdateTeamMemberMutationOptions = Apollo.BaseMutationOptions<UpdateTeamMemberMutationData, UpdateTeamMemberMutationVariables>;
export const ProvideEventTicketDocument = gql`
    mutation ProvideEventTicket($eventId: ID!, $userConProfileId: ID!, $ticketTypeId: ID!) {
  provideEventTicket(
    input: {eventId: $eventId, userConProfileId: $userConProfileId, ticketTypeId: $ticketTypeId}
  ) {
    ticket {
      id
      ...TeamMemberTicketFields
    }
  }
}
    ${TeamMemberTicketFieldsFragmentDoc}`;
export type ProvideEventTicketMutationFn = Apollo.MutationFunction<ProvideEventTicketMutationData, ProvideEventTicketMutationVariables>;

/**
 * __useProvideEventTicketMutation__
 *
 * To run a mutation, you first call `useProvideEventTicketMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProvideEventTicketMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [provideEventTicketMutation, { data, loading, error }] = useProvideEventTicketMutation({
 *   variables: {
 *      eventId: // value for 'eventId'
 *      userConProfileId: // value for 'userConProfileId'
 *      ticketTypeId: // value for 'ticketTypeId'
 *   },
 * });
 */
export function useProvideEventTicketMutation(baseOptions?: Apollo.MutationHookOptions<ProvideEventTicketMutationData, ProvideEventTicketMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ProvideEventTicketMutationData, ProvideEventTicketMutationVariables>(ProvideEventTicketDocument, options);
      }
export type ProvideEventTicketMutationHookResult = ReturnType<typeof useProvideEventTicketMutation>;
export type ProvideEventTicketMutationResult = Apollo.MutationResult<ProvideEventTicketMutationData>;
export type ProvideEventTicketMutationOptions = Apollo.BaseMutationOptions<ProvideEventTicketMutationData, ProvideEventTicketMutationVariables>;