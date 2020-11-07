/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { UserConProfileFieldsFragment, UserConProfileAdminTicketFieldsFragment } from './queries.generated';
import { gql } from '@apollo/client';
import { UserConProfileFieldsFragmentDoc, UserConProfileAdminTicketFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
export type CreateUserConProfileMutationVariables = Types.Exact<{
  user_id: Types.Scalars['Int'];
  user_con_profile: Types.UserConProfileInput;
}>;


export type CreateUserConProfileMutation = (
  { __typename: 'Mutation' }
  & { createUserConProfile?: Types.Maybe<(
    { __typename: 'CreateUserConProfilePayload' }
    & { user_con_profile: (
      { __typename: 'UserConProfile' }
      & Pick<Types.UserConProfile, 'id'>
    ) }
  )> }
);

export type UpdateUserConProfileMutationVariables = Types.Exact<{
  input: Types.UpdateUserConProfileInput;
}>;


export type UpdateUserConProfileMutation = (
  { __typename: 'Mutation' }
  & { updateUserConProfile?: Types.Maybe<(
    { __typename: 'UpdateUserConProfilePayload' }
    & { user_con_profile: (
      { __typename: 'UserConProfile' }
      & Pick<Types.UserConProfile, 'id'>
      & UserConProfileFieldsFragment
    ) }
  )> }
);

export type DeleteUserConProfileMutationVariables = Types.Exact<{
  userConProfileId: Types.Scalars['Int'];
}>;


export type DeleteUserConProfileMutation = (
  { __typename: 'Mutation' }
  & { deleteUserConProfile?: Types.Maybe<(
    { __typename: 'DeleteUserConProfilePayload' }
    & { user_con_profile: (
      { __typename: 'UserConProfile' }
      & Pick<Types.UserConProfile, 'id'>
    ) }
  )> }
);

export type CreateTicketMutationVariables = Types.Exact<{
  userConProfileId: Types.Scalars['Int'];
  ticket: Types.TicketInput;
}>;


export type CreateTicketMutation = (
  { __typename: 'Mutation' }
  & { createTicket?: Types.Maybe<(
    { __typename: 'CreateTicketPayload' }
    & { ticket: (
      { __typename: 'Ticket' }
      & Pick<Types.Ticket, 'id'>
      & UserConProfileAdminTicketFieldsFragment
    ) }
  )> }
);

export type UpdateTicketMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
  ticket: Types.TicketInput;
}>;


export type UpdateTicketMutation = (
  { __typename: 'Mutation' }
  & { updateTicket?: Types.Maybe<(
    { __typename: 'UpdateTicketPayload' }
    & { ticket: (
      { __typename: 'Ticket' }
      & Pick<Types.Ticket, 'id'>
      & UserConProfileAdminTicketFieldsFragment
    ) }
  )> }
);

export type DeleteTicketMutationVariables = Types.Exact<{
  ticketId: Types.Scalars['Int'];
  refund: Types.Scalars['Boolean'];
}>;


export type DeleteTicketMutation = (
  { __typename: 'Mutation' }
  & { deleteTicket?: Types.Maybe<(
    { __typename: 'DeleteTicketPayload' }
    & { ticket: (
      { __typename: 'Ticket' }
      & Pick<Types.Ticket, 'id'>
    ) }
  )> }
);

export type ConvertTicketToEventProvidedMutationVariables = Types.Exact<{
  eventId: Types.Scalars['Int'];
  ticketTypeId: Types.Scalars['Int'];
  userConProfileId: Types.Scalars['Int'];
}>;


export type ConvertTicketToEventProvidedMutation = (
  { __typename: 'Mutation' }
  & { convertTicketToEventProvided?: Types.Maybe<(
    { __typename: 'ConvertTicketToEventProvidedPayload' }
    & { ticket: (
      { __typename: 'Ticket' }
      & Pick<Types.Ticket, 'id'>
      & UserConProfileAdminTicketFieldsFragment
    ) }
  )> }
);


export const CreateUserConProfileDocument = gql`
    mutation CreateUserConProfile($user_id: Int!, $user_con_profile: UserConProfileInput!) {
  createUserConProfile(
    input: {user_id: $user_id, user_con_profile: $user_con_profile}
  ) {
    user_con_profile {
      id
    }
  }
}
    `;
export type CreateUserConProfileMutationFn = Apollo.MutationFunction<CreateUserConProfileMutation, CreateUserConProfileMutationVariables>;

/**
 * __useCreateUserConProfileMutation__
 *
 * To run a mutation, you first call `useCreateUserConProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserConProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserConProfileMutation, { data, loading, error }] = useCreateUserConProfileMutation({
 *   variables: {
 *      user_id: // value for 'user_id'
 *      user_con_profile: // value for 'user_con_profile'
 *   },
 * });
 */
export function useCreateUserConProfileMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserConProfileMutation, CreateUserConProfileMutationVariables>) {
        return Apollo.useMutation<CreateUserConProfileMutation, CreateUserConProfileMutationVariables>(CreateUserConProfileDocument, baseOptions);
      }
export type CreateUserConProfileMutationHookResult = ReturnType<typeof useCreateUserConProfileMutation>;
export type CreateUserConProfileMutationResult = Apollo.MutationResult<CreateUserConProfileMutation>;
export type CreateUserConProfileMutationOptions = Apollo.BaseMutationOptions<CreateUserConProfileMutation, CreateUserConProfileMutationVariables>;
export const UpdateUserConProfileDocument = gql`
    mutation UpdateUserConProfile($input: UpdateUserConProfileInput!) {
  updateUserConProfile(input: $input) {
    user_con_profile {
      id
      ...UserConProfileFields
    }
  }
}
    ${UserConProfileFieldsFragmentDoc}`;
export type UpdateUserConProfileMutationFn = Apollo.MutationFunction<UpdateUserConProfileMutation, UpdateUserConProfileMutationVariables>;

/**
 * __useUpdateUserConProfileMutation__
 *
 * To run a mutation, you first call `useUpdateUserConProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserConProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserConProfileMutation, { data, loading, error }] = useUpdateUserConProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserConProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserConProfileMutation, UpdateUserConProfileMutationVariables>) {
        return Apollo.useMutation<UpdateUserConProfileMutation, UpdateUserConProfileMutationVariables>(UpdateUserConProfileDocument, baseOptions);
      }
export type UpdateUserConProfileMutationHookResult = ReturnType<typeof useUpdateUserConProfileMutation>;
export type UpdateUserConProfileMutationResult = Apollo.MutationResult<UpdateUserConProfileMutation>;
export type UpdateUserConProfileMutationOptions = Apollo.BaseMutationOptions<UpdateUserConProfileMutation, UpdateUserConProfileMutationVariables>;
export const DeleteUserConProfileDocument = gql`
    mutation DeleteUserConProfile($userConProfileId: Int!) {
  deleteUserConProfile(input: {id: $userConProfileId}) {
    user_con_profile {
      id
    }
  }
}
    `;
export type DeleteUserConProfileMutationFn = Apollo.MutationFunction<DeleteUserConProfileMutation, DeleteUserConProfileMutationVariables>;

/**
 * __useDeleteUserConProfileMutation__
 *
 * To run a mutation, you first call `useDeleteUserConProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserConProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserConProfileMutation, { data, loading, error }] = useDeleteUserConProfileMutation({
 *   variables: {
 *      userConProfileId: // value for 'userConProfileId'
 *   },
 * });
 */
export function useDeleteUserConProfileMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserConProfileMutation, DeleteUserConProfileMutationVariables>) {
        return Apollo.useMutation<DeleteUserConProfileMutation, DeleteUserConProfileMutationVariables>(DeleteUserConProfileDocument, baseOptions);
      }
export type DeleteUserConProfileMutationHookResult = ReturnType<typeof useDeleteUserConProfileMutation>;
export type DeleteUserConProfileMutationResult = Apollo.MutationResult<DeleteUserConProfileMutation>;
export type DeleteUserConProfileMutationOptions = Apollo.BaseMutationOptions<DeleteUserConProfileMutation, DeleteUserConProfileMutationVariables>;
export const CreateTicketDocument = gql`
    mutation CreateTicket($userConProfileId: Int!, $ticket: TicketInput!) {
  createTicket(input: {user_con_profile_id: $userConProfileId, ticket: $ticket}) {
    ticket {
      id
      ...UserConProfileAdminTicketFields
    }
  }
}
    ${UserConProfileAdminTicketFieldsFragmentDoc}`;
export type CreateTicketMutationFn = Apollo.MutationFunction<CreateTicketMutation, CreateTicketMutationVariables>;

/**
 * __useCreateTicketMutation__
 *
 * To run a mutation, you first call `useCreateTicketMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTicketMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTicketMutation, { data, loading, error }] = useCreateTicketMutation({
 *   variables: {
 *      userConProfileId: // value for 'userConProfileId'
 *      ticket: // value for 'ticket'
 *   },
 * });
 */
export function useCreateTicketMutation(baseOptions?: Apollo.MutationHookOptions<CreateTicketMutation, CreateTicketMutationVariables>) {
        return Apollo.useMutation<CreateTicketMutation, CreateTicketMutationVariables>(CreateTicketDocument, baseOptions);
      }
export type CreateTicketMutationHookResult = ReturnType<typeof useCreateTicketMutation>;
export type CreateTicketMutationResult = Apollo.MutationResult<CreateTicketMutation>;
export type CreateTicketMutationOptions = Apollo.BaseMutationOptions<CreateTicketMutation, CreateTicketMutationVariables>;
export const UpdateTicketDocument = gql`
    mutation UpdateTicket($id: Int!, $ticket: TicketInput!) {
  updateTicket(input: {id: $id, ticket: $ticket}) {
    ticket {
      id
      ...UserConProfileAdminTicketFields
    }
  }
}
    ${UserConProfileAdminTicketFieldsFragmentDoc}`;
export type UpdateTicketMutationFn = Apollo.MutationFunction<UpdateTicketMutation, UpdateTicketMutationVariables>;

/**
 * __useUpdateTicketMutation__
 *
 * To run a mutation, you first call `useUpdateTicketMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTicketMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTicketMutation, { data, loading, error }] = useUpdateTicketMutation({
 *   variables: {
 *      id: // value for 'id'
 *      ticket: // value for 'ticket'
 *   },
 * });
 */
export function useUpdateTicketMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTicketMutation, UpdateTicketMutationVariables>) {
        return Apollo.useMutation<UpdateTicketMutation, UpdateTicketMutationVariables>(UpdateTicketDocument, baseOptions);
      }
export type UpdateTicketMutationHookResult = ReturnType<typeof useUpdateTicketMutation>;
export type UpdateTicketMutationResult = Apollo.MutationResult<UpdateTicketMutation>;
export type UpdateTicketMutationOptions = Apollo.BaseMutationOptions<UpdateTicketMutation, UpdateTicketMutationVariables>;
export const DeleteTicketDocument = gql`
    mutation DeleteTicket($ticketId: Int!, $refund: Boolean!) {
  deleteTicket(input: {id: $ticketId, refund: $refund}) {
    ticket {
      id
    }
  }
}
    `;
export type DeleteTicketMutationFn = Apollo.MutationFunction<DeleteTicketMutation, DeleteTicketMutationVariables>;

/**
 * __useDeleteTicketMutation__
 *
 * To run a mutation, you first call `useDeleteTicketMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTicketMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTicketMutation, { data, loading, error }] = useDeleteTicketMutation({
 *   variables: {
 *      ticketId: // value for 'ticketId'
 *      refund: // value for 'refund'
 *   },
 * });
 */
export function useDeleteTicketMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTicketMutation, DeleteTicketMutationVariables>) {
        return Apollo.useMutation<DeleteTicketMutation, DeleteTicketMutationVariables>(DeleteTicketDocument, baseOptions);
      }
export type DeleteTicketMutationHookResult = ReturnType<typeof useDeleteTicketMutation>;
export type DeleteTicketMutationResult = Apollo.MutationResult<DeleteTicketMutation>;
export type DeleteTicketMutationOptions = Apollo.BaseMutationOptions<DeleteTicketMutation, DeleteTicketMutationVariables>;
export const ConvertTicketToEventProvidedDocument = gql`
    mutation ConvertTicketToEventProvided($eventId: Int!, $ticketTypeId: Int!, $userConProfileId: Int!) {
  convertTicketToEventProvided(
    input: {event_id: $eventId, ticket_type_id: $ticketTypeId, user_con_profile_id: $userConProfileId}
  ) {
    ticket {
      id
      ...UserConProfileAdminTicketFields
    }
  }
}
    ${UserConProfileAdminTicketFieldsFragmentDoc}`;
export type ConvertTicketToEventProvidedMutationFn = Apollo.MutationFunction<ConvertTicketToEventProvidedMutation, ConvertTicketToEventProvidedMutationVariables>;

/**
 * __useConvertTicketToEventProvidedMutation__
 *
 * To run a mutation, you first call `useConvertTicketToEventProvidedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConvertTicketToEventProvidedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [convertTicketToEventProvidedMutation, { data, loading, error }] = useConvertTicketToEventProvidedMutation({
 *   variables: {
 *      eventId: // value for 'eventId'
 *      ticketTypeId: // value for 'ticketTypeId'
 *      userConProfileId: // value for 'userConProfileId'
 *   },
 * });
 */
export function useConvertTicketToEventProvidedMutation(baseOptions?: Apollo.MutationHookOptions<ConvertTicketToEventProvidedMutation, ConvertTicketToEventProvidedMutationVariables>) {
        return Apollo.useMutation<ConvertTicketToEventProvidedMutation, ConvertTicketToEventProvidedMutationVariables>(ConvertTicketToEventProvidedDocument, baseOptions);
      }
export type ConvertTicketToEventProvidedMutationHookResult = ReturnType<typeof useConvertTicketToEventProvidedMutation>;
export type ConvertTicketToEventProvidedMutationResult = Apollo.MutationResult<ConvertTicketToEventProvidedMutation>;
export type ConvertTicketToEventProvidedMutationOptions = Apollo.BaseMutationOptions<ConvertTicketToEventProvidedMutation, ConvertTicketToEventProvidedMutationVariables>;