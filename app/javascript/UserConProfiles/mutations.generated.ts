/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { UserConProfileFieldsFragmentDoc, UserConProfileAdminTicketFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateUserConProfileMutationVariables = Types.Exact<{
  user_id: Types.Scalars['ID']['input'];
  user_con_profile: Types.UserConProfileInput;
}>;


export type CreateUserConProfileMutationData = { __typename: 'Mutation', createUserConProfile: { __typename: 'CreateUserConProfilePayload', user_con_profile: { __typename: 'UserConProfile', id: string } } };

export type UpdateUserConProfileMutationVariables = Types.Exact<{
  input: Types.UpdateUserConProfileInput;
}>;


export type UpdateUserConProfileMutationData = { __typename: 'Mutation', updateUserConProfile: { __typename: 'UpdateUserConProfilePayload', user_con_profile: { __typename: 'UserConProfile', id: string, name: string, form_response_attrs_json?: string | null, gravatar_enabled: boolean, gravatar_url: string } } };

export type DeleteUserConProfileMutationVariables = Types.Exact<{
  userConProfileId: Types.Scalars['ID']['input'];
}>;


export type DeleteUserConProfileMutationData = { __typename: 'Mutation', deleteUserConProfile: { __typename: 'DeleteUserConProfilePayload', user_con_profile: { __typename: 'UserConProfile', id: string } } };

export type CreateTicketMutationVariables = Types.Exact<{
  userConProfileId: Types.Scalars['ID']['input'];
  ticket: Types.TicketInput;
}>;


export type CreateTicketMutationData = { __typename: 'Mutation', createTicket: { __typename: 'CreateTicketPayload', ticket: { __typename: 'Ticket', id: string, created_at: string, updated_at: string, order_entry?: { __typename: 'OrderEntry', id: string, order: { __typename: 'Order', id: string, status: Types.OrderStatus, submitted_at?: string | null, charge_id?: string | null, payment_note?: string | null, paid_at?: string | null, user_con_profile: { __typename: 'UserConProfile', id: string, name_without_nickname: string }, total_price: { __typename: 'Money', fractional: number, currency_code: string }, payment_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null, coupon_applications: Array<{ __typename: 'CouponApplication', id: string, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', id: string, code: string, percent_discount?: string | null, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null, provides_product?: { __typename: 'Product', id: string, name: string } | null } }>, order_entries: Array<{ __typename: 'OrderEntry', id: string, quantity: number, describe_products: string, product: { __typename: 'Product', id: string, name: string }, product_variant?: { __typename: 'ProductVariant', id: string, name: string } | null, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }> }, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } } | null, ticket_type: { __typename: 'TicketType', id: string, description?: string | null, name: string }, provided_by_event?: { __typename: 'Event', id: string, title?: string | null } | null } } };

export type UpdateTicketMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  ticket: Types.TicketInput;
}>;


export type UpdateTicketMutationData = { __typename: 'Mutation', updateTicket: { __typename: 'UpdateTicketPayload', ticket: { __typename: 'Ticket', id: string, created_at: string, updated_at: string, order_entry?: { __typename: 'OrderEntry', id: string, order: { __typename: 'Order', id: string, status: Types.OrderStatus, submitted_at?: string | null, charge_id?: string | null, payment_note?: string | null, paid_at?: string | null, user_con_profile: { __typename: 'UserConProfile', id: string, name_without_nickname: string }, total_price: { __typename: 'Money', fractional: number, currency_code: string }, payment_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null, coupon_applications: Array<{ __typename: 'CouponApplication', id: string, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', id: string, code: string, percent_discount?: string | null, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null, provides_product?: { __typename: 'Product', id: string, name: string } | null } }>, order_entries: Array<{ __typename: 'OrderEntry', id: string, quantity: number, describe_products: string, product: { __typename: 'Product', id: string, name: string }, product_variant?: { __typename: 'ProductVariant', id: string, name: string } | null, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }> }, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } } | null, ticket_type: { __typename: 'TicketType', id: string, description?: string | null, name: string }, provided_by_event?: { __typename: 'Event', id: string, title?: string | null } | null } } };

export type DeleteTicketMutationVariables = Types.Exact<{
  ticketId: Types.Scalars['ID']['input'];
  refund: Types.Scalars['Boolean']['input'];
}>;


export type DeleteTicketMutationData = { __typename: 'Mutation', deleteTicket: { __typename: 'DeleteTicketPayload', ticket: { __typename: 'Ticket', id: string } } };

export type ConvertTicketToEventProvidedMutationVariables = Types.Exact<{
  eventId: Types.Scalars['ID']['input'];
  ticketTypeId: Types.Scalars['ID']['input'];
  userConProfileId: Types.Scalars['ID']['input'];
}>;


export type ConvertTicketToEventProvidedMutationData = { __typename: 'Mutation', convertTicketToEventProvided: { __typename: 'ConvertTicketToEventProvidedPayload', ticket: { __typename: 'Ticket', id: string, created_at: string, updated_at: string, order_entry?: { __typename: 'OrderEntry', id: string, order: { __typename: 'Order', id: string, status: Types.OrderStatus, submitted_at?: string | null, charge_id?: string | null, payment_note?: string | null, paid_at?: string | null, user_con_profile: { __typename: 'UserConProfile', id: string, name_without_nickname: string }, total_price: { __typename: 'Money', fractional: number, currency_code: string }, payment_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null, coupon_applications: Array<{ __typename: 'CouponApplication', id: string, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', id: string, code: string, percent_discount?: string | null, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null, provides_product?: { __typename: 'Product', id: string, name: string } | null } }>, order_entries: Array<{ __typename: 'OrderEntry', id: string, quantity: number, describe_products: string, product: { __typename: 'Product', id: string, name: string }, product_variant?: { __typename: 'ProductVariant', id: string, name: string } | null, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }> }, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } } | null, ticket_type: { __typename: 'TicketType', id: string, description?: string | null, name: string }, provided_by_event?: { __typename: 'Event', id: string, title?: string | null } | null } } };


export const CreateUserConProfileDocument = gql`
    mutation CreateUserConProfile($user_id: ID!, $user_con_profile: UserConProfileInput!) {
  createUserConProfile(
    input: {userId: $user_id, user_con_profile: $user_con_profile}
  ) {
    user_con_profile {
      id
    }
  }
}
    `;
export type CreateUserConProfileMutationFn = Apollo.MutationFunction<CreateUserConProfileMutationData, CreateUserConProfileMutationVariables>;

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
export function useCreateUserConProfileMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserConProfileMutationData, CreateUserConProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserConProfileMutationData, CreateUserConProfileMutationVariables>(CreateUserConProfileDocument, options);
      }
export type CreateUserConProfileMutationHookResult = ReturnType<typeof useCreateUserConProfileMutation>;
export type CreateUserConProfileMutationResult = Apollo.MutationResult<CreateUserConProfileMutationData>;
export type CreateUserConProfileMutationOptions = Apollo.BaseMutationOptions<CreateUserConProfileMutationData, CreateUserConProfileMutationVariables>;
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
export type UpdateUserConProfileMutationFn = Apollo.MutationFunction<UpdateUserConProfileMutationData, UpdateUserConProfileMutationVariables>;

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
export function useUpdateUserConProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserConProfileMutationData, UpdateUserConProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserConProfileMutationData, UpdateUserConProfileMutationVariables>(UpdateUserConProfileDocument, options);
      }
export type UpdateUserConProfileMutationHookResult = ReturnType<typeof useUpdateUserConProfileMutation>;
export type UpdateUserConProfileMutationResult = Apollo.MutationResult<UpdateUserConProfileMutationData>;
export type UpdateUserConProfileMutationOptions = Apollo.BaseMutationOptions<UpdateUserConProfileMutationData, UpdateUserConProfileMutationVariables>;
export const DeleteUserConProfileDocument = gql`
    mutation DeleteUserConProfile($userConProfileId: ID!) {
  deleteUserConProfile(input: {id: $userConProfileId}) {
    user_con_profile {
      id
    }
  }
}
    `;
export type DeleteUserConProfileMutationFn = Apollo.MutationFunction<DeleteUserConProfileMutationData, DeleteUserConProfileMutationVariables>;

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
export function useDeleteUserConProfileMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserConProfileMutationData, DeleteUserConProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserConProfileMutationData, DeleteUserConProfileMutationVariables>(DeleteUserConProfileDocument, options);
      }
export type DeleteUserConProfileMutationHookResult = ReturnType<typeof useDeleteUserConProfileMutation>;
export type DeleteUserConProfileMutationResult = Apollo.MutationResult<DeleteUserConProfileMutationData>;
export type DeleteUserConProfileMutationOptions = Apollo.BaseMutationOptions<DeleteUserConProfileMutationData, DeleteUserConProfileMutationVariables>;
export const CreateTicketDocument = gql`
    mutation CreateTicket($userConProfileId: ID!, $ticket: TicketInput!) {
  createTicket(input: {userConProfileId: $userConProfileId, ticket: $ticket}) {
    ticket {
      id
      ...UserConProfileAdminTicketFields
    }
  }
}
    ${UserConProfileAdminTicketFieldsFragmentDoc}`;
export type CreateTicketMutationFn = Apollo.MutationFunction<CreateTicketMutationData, CreateTicketMutationVariables>;

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
export function useCreateTicketMutation(baseOptions?: Apollo.MutationHookOptions<CreateTicketMutationData, CreateTicketMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTicketMutationData, CreateTicketMutationVariables>(CreateTicketDocument, options);
      }
export type CreateTicketMutationHookResult = ReturnType<typeof useCreateTicketMutation>;
export type CreateTicketMutationResult = Apollo.MutationResult<CreateTicketMutationData>;
export type CreateTicketMutationOptions = Apollo.BaseMutationOptions<CreateTicketMutationData, CreateTicketMutationVariables>;
export const UpdateTicketDocument = gql`
    mutation UpdateTicket($id: ID!, $ticket: TicketInput!) {
  updateTicket(input: {id: $id, ticket: $ticket}) {
    ticket {
      id
      ...UserConProfileAdminTicketFields
    }
  }
}
    ${UserConProfileAdminTicketFieldsFragmentDoc}`;
export type UpdateTicketMutationFn = Apollo.MutationFunction<UpdateTicketMutationData, UpdateTicketMutationVariables>;

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
export function useUpdateTicketMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTicketMutationData, UpdateTicketMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTicketMutationData, UpdateTicketMutationVariables>(UpdateTicketDocument, options);
      }
export type UpdateTicketMutationHookResult = ReturnType<typeof useUpdateTicketMutation>;
export type UpdateTicketMutationResult = Apollo.MutationResult<UpdateTicketMutationData>;
export type UpdateTicketMutationOptions = Apollo.BaseMutationOptions<UpdateTicketMutationData, UpdateTicketMutationVariables>;
export const DeleteTicketDocument = gql`
    mutation DeleteTicket($ticketId: ID!, $refund: Boolean!) {
  deleteTicket(input: {id: $ticketId, refund: $refund}) {
    ticket {
      id
    }
  }
}
    `;
export type DeleteTicketMutationFn = Apollo.MutationFunction<DeleteTicketMutationData, DeleteTicketMutationVariables>;

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
export function useDeleteTicketMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTicketMutationData, DeleteTicketMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTicketMutationData, DeleteTicketMutationVariables>(DeleteTicketDocument, options);
      }
export type DeleteTicketMutationHookResult = ReturnType<typeof useDeleteTicketMutation>;
export type DeleteTicketMutationResult = Apollo.MutationResult<DeleteTicketMutationData>;
export type DeleteTicketMutationOptions = Apollo.BaseMutationOptions<DeleteTicketMutationData, DeleteTicketMutationVariables>;
export const ConvertTicketToEventProvidedDocument = gql`
    mutation ConvertTicketToEventProvided($eventId: ID!, $ticketTypeId: ID!, $userConProfileId: ID!) {
  convertTicketToEventProvided(
    input: {eventId: $eventId, ticketTypeId: $ticketTypeId, userConProfileId: $userConProfileId}
  ) {
    ticket {
      id
      ...UserConProfileAdminTicketFields
    }
  }
}
    ${UserConProfileAdminTicketFieldsFragmentDoc}`;
export type ConvertTicketToEventProvidedMutationFn = Apollo.MutationFunction<ConvertTicketToEventProvidedMutationData, ConvertTicketToEventProvidedMutationVariables>;

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
export function useConvertTicketToEventProvidedMutation(baseOptions?: Apollo.MutationHookOptions<ConvertTicketToEventProvidedMutationData, ConvertTicketToEventProvidedMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ConvertTicketToEventProvidedMutationData, ConvertTicketToEventProvidedMutationVariables>(ConvertTicketToEventProvidedDocument, options);
      }
export type ConvertTicketToEventProvidedMutationHookResult = ReturnType<typeof useConvertTicketToEventProvidedMutation>;
export type ConvertTicketToEventProvidedMutationResult = Apollo.MutationResult<ConvertTicketToEventProvidedMutationData>;
export type ConvertTicketToEventProvidedMutationOptions = Apollo.BaseMutationOptions<ConvertTicketToEventProvidedMutationData, ConvertTicketToEventProvidedMutationVariables>;