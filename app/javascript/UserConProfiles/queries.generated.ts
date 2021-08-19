/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { CommonFormFieldsFragment, CommonFormSectionFieldsFragment, CommonFormItemFieldsFragment } from '../Models/commonFormFragments.generated';
import { AdminOrderFieldsFragment, OrderEntryFieldsFragment, CartOrderFieldsFragment, CouponApplicationFieldsFragment } from '../Store/orderFields.generated';
import { AdminProductFieldsFragment } from '../Store/adminProductFields.generated';
import { gql } from '@apollo/client';
import { CommonFormFieldsFragmentDoc, CommonFormSectionFieldsFragmentDoc, CommonFormItemFieldsFragmentDoc } from '../Models/commonFormFragments.generated';
import { AdminOrderFieldsFragmentDoc, OrderEntryFieldsFragmentDoc, CartOrderFieldsFragmentDoc, CouponApplicationFieldsFragmentDoc } from '../Store/orderFields.generated';
import { AdminProductFieldsFragmentDoc } from '../Store/adminProductFields.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type UserConProfileFormDataFragment = (
  { __typename: 'Convention' }
  & Pick<Types.Convention, 'id' | 'starts_at' | 'ends_at' | 'timezone_name' | 'timezone_mode'>
  & { user_con_profile_form: (
    { __typename: 'Form' }
    & Pick<Types.Form, 'id'>
    & CommonFormFieldsFragment
  ) }
);

export type UserConProfileFieldsFragment = (
  { __typename: 'UserConProfile' }
  & Pick<Types.UserConProfile, 'id' | 'name' | 'form_response_attrs_json' | 'gravatar_enabled' | 'gravatar_url'>
);

export type UserConProfileAdminTicketFieldsFragment = (
  { __typename: 'Ticket' }
  & Pick<Types.Ticket, 'id' | 'created_at' | 'updated_at'>
  & { order_entry?: Types.Maybe<(
    { __typename: 'OrderEntry' }
    & Pick<Types.OrderEntry, 'id'>
    & { order: (
      { __typename: 'Order' }
      & Pick<Types.Order, 'id'>
      & AdminOrderFieldsFragment
    ), price_per_item: (
      { __typename: 'Money' }
      & Pick<Types.Money, 'fractional' | 'currency_code'>
    ) }
  )>, ticket_type: (
    { __typename: 'TicketType' }
    & Pick<Types.TicketType, 'id' | 'description' | 'name'>
  ), provided_by_event?: Types.Maybe<(
    { __typename: 'Event' }
    & Pick<Types.Event, 'id' | 'title'>
  )> }
);

export type UserConProfileQueryVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type UserConProfileQueryData = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & UserConProfileFormDataFragment
  )>, userConProfile: (
    { __typename: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id' | 'current_user_form_item_role'>
    & UserConProfileFieldsFragment
  ) }
);

export type UserConProfileAdminQueryVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type UserConProfileAdminQueryData = (
  { __typename: 'Query' }
  & { myProfile?: Types.Maybe<(
    { __typename: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id'>
    & { ability?: Types.Maybe<(
      { __typename: 'Ability' }
      & Pick<Types.Ability, 'can_read_signups' | 'can_update_user_con_profile' | 'can_delete_user_con_profile' | 'can_become_user_con_profile'>
    )> }
  )>, convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name' | 'starts_at' | 'ends_at' | 'timezone_name' | 'timezone_mode' | 'ticket_name' | 'ticket_mode'>
    & { user_con_profile_form: (
      { __typename: 'Form' }
      & Pick<Types.Form, 'id'>
      & { form_sections: Array<(
        { __typename: 'FormSection' }
        & Pick<Types.FormSection, 'id'>
        & { form_items: Array<(
          { __typename: 'FormItem' }
          & Pick<Types.FormItem, 'id' | 'admin_description'>
        )> }
      )> }
      & CommonFormFieldsFragment
    ), ticket_types: Array<(
      { __typename: 'TicketType' }
      & Pick<Types.TicketType, 'id' | 'description' | 'name' | 'maximum_event_provided_tickets'>
      & { providing_products: Array<(
        { __typename: 'Product' }
        & Pick<Types.Product, 'id'>
        & AdminProductFieldsFragment
      )> }
    )> }
  ), userConProfile: (
    { __typename: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id' | 'email' | 'user_id' | 'name' | 'name_without_nickname' | 'form_response_attrs_json' | 'gravatar_enabled' | 'gravatar_url'>
    & { ticket?: Types.Maybe<(
      { __typename: 'Ticket' }
      & Pick<Types.Ticket, 'id'>
      & UserConProfileAdminTicketFieldsFragment
    )> }
  ) }
);

export type UserConProfilesTableUserConProfilesQueryVariables = Types.Exact<{
  page?: Types.Maybe<Types.Scalars['Int']>;
  perPage?: Types.Maybe<Types.Scalars['Int']>;
  filters?: Types.Maybe<Types.UserConProfileFiltersInput>;
  sort?: Types.Maybe<Array<Types.SortInput> | Types.SortInput>;
}>;


export type UserConProfilesTableUserConProfilesQueryData = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name' | 'starts_at' | 'ends_at' | 'timezone_name' | 'timezone_mode' | 'ticket_name' | 'ticket_mode'>
    & { ticket_types: Array<(
      { __typename: 'TicketType' }
      & Pick<Types.TicketType, 'id' | 'name'>
    )>, user_con_profile_form: (
      { __typename: 'Form' }
      & Pick<Types.Form, 'id'>
      & { form_sections: Array<(
        { __typename: 'FormSection' }
        & Pick<Types.FormSection, 'id'>
        & { form_items: Array<(
          { __typename: 'FormItem' }
          & Pick<Types.FormItem, 'id' | 'admin_description'>
        )> }
      )> }
      & CommonFormFieldsFragment
    ), user_con_profiles_paginated: (
      { __typename: 'UserConProfilesPagination' }
      & Pick<Types.UserConProfilesPagination, 'total_entries' | 'total_pages' | 'current_page' | 'per_page'>
      & { entries: Array<(
        { __typename: 'UserConProfile' }
        & Pick<Types.UserConProfile, 'id' | 'name_inverted' | 'first_name' | 'last_name' | 'email' | 'site_admin' | 'form_response_attrs_json' | 'order_summary' | 'gravatar_enabled' | 'gravatar_url' | 'user_id'>
        & { team_members: Array<(
          { __typename: 'TeamMember' }
          & Pick<Types.TeamMember, 'id'>
        )>, ticket?: Types.Maybe<(
          { __typename: 'Ticket' }
          & Pick<Types.Ticket, 'id' | 'updated_at'>
          & { order_entry?: Types.Maybe<(
            { __typename: 'OrderEntry' }
            & Pick<Types.OrderEntry, 'id'>
            & { price_per_item: (
              { __typename: 'Money' }
              & Pick<Types.Money, 'fractional' | 'currency_code'>
            ) }
          )>, ticket_type: (
            { __typename: 'TicketType' }
            & Pick<Types.TicketType, 'id' | 'name'>
          ) }
        )> }
      )> }
    ) }
  )>, currentAbility: (
    { __typename: 'Ability' }
    & Pick<Types.Ability, 'can_create_user_con_profiles'>
  ) }
);

export type ConvertToEventProvidedTicketQueryVariables = Types.Exact<{
  eventId: Types.Scalars['Int'];
}>;


export type ConvertToEventProvidedTicketQueryData = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'ticket_name'>
    & { ticket_types: Array<(
      { __typename: 'TicketType' }
      & Pick<Types.TicketType, 'id' | 'maximum_event_provided_tickets' | 'description' | 'name'>
    )> }
  )>, event: (
    { __typename: 'Event' }
    & Pick<Types.Event, 'id' | 'title'>
    & { event_category: (
      { __typename: 'EventCategory' }
      & Pick<Types.EventCategory, 'id' | 'can_provide_tickets'>
    ), provided_tickets: Array<(
      { __typename: 'Ticket' }
      & Pick<Types.Ticket, 'id'>
      & { ticket_type: (
        { __typename: 'TicketType' }
        & Pick<Types.TicketType, 'id' | 'name'>
      ) }
    )> }
  ) }
);

export type AddAttendeeUsersQueryVariables = Types.Exact<{
  name?: Types.Maybe<Types.Scalars['String']>;
}>;


export type AddAttendeeUsersQueryData = (
  { __typename: 'Query' }
  & { users_paginated: (
    { __typename: 'UsersPagination' }
    & { entries: Array<(
      { __typename: 'User' }
      & Pick<Types.User, 'id' | 'name' | 'email' | 'first_name' | 'last_name'>
    )> }
  ) }
);

export type TicketAdminWithoutTicketAbilityQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type TicketAdminWithoutTicketAbilityQueryData = (
  { __typename: 'Query' }
  & { currentAbility: (
    { __typename: 'Ability' }
    & Pick<Types.Ability, 'can_create_tickets'>
  ) }
);

export type TicketAdminWithTicketAbilityQueryVariables = Types.Exact<{
  ticketId: Types.Scalars['Int'];
}>;


export type TicketAdminWithTicketAbilityQueryData = (
  { __typename: 'Query' }
  & { currentAbility: (
    { __typename: 'Ability' }
    & Pick<Types.Ability, 'can_create_tickets' | 'can_update_ticket' | 'can_delete_ticket'>
  ) }
);

export const UserConProfileFormDataFragmentDoc = gql`
    fragment UserConProfileFormData on Convention {
  id
  starts_at
  ends_at
  timezone_name
  timezone_mode
  user_con_profile_form {
    id
    ...CommonFormFields
  }
}
    ${CommonFormFieldsFragmentDoc}`;
export const UserConProfileFieldsFragmentDoc = gql`
    fragment UserConProfileFields on UserConProfile {
  id
  name
  form_response_attrs_json
  gravatar_enabled
  gravatar_url
}
    `;
export const UserConProfileAdminTicketFieldsFragmentDoc = gql`
    fragment UserConProfileAdminTicketFields on Ticket {
  id
  created_at
  updated_at
  order_entry {
    id
    order {
      id
      ...AdminOrderFieldsFragment
    }
    price_per_item {
      fractional
      currency_code
    }
  }
  ticket_type {
    id
    description
    name
  }
  provided_by_event {
    id
    title
  }
}
    ${AdminOrderFieldsFragmentDoc}`;
export const UserConProfileQueryDocument = gql`
    query UserConProfileQuery($id: Int!) {
  convention {
    ...UserConProfileFormData
    id
  }
  userConProfile(id: $id) {
    id
    current_user_form_item_role
    ...UserConProfileFields
  }
}
    ${UserConProfileFormDataFragmentDoc}
${UserConProfileFieldsFragmentDoc}`;

/**
 * __useUserConProfileQuery__
 *
 * To run a query within a React component, call `useUserConProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserConProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserConProfileQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserConProfileQuery(baseOptions: Apollo.QueryHookOptions<UserConProfileQueryData, UserConProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserConProfileQueryData, UserConProfileQueryVariables>(UserConProfileQueryDocument, options);
      }
export function useUserConProfileQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserConProfileQueryData, UserConProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserConProfileQueryData, UserConProfileQueryVariables>(UserConProfileQueryDocument, options);
        }
export type UserConProfileQueryHookResult = ReturnType<typeof useUserConProfileQuery>;
export type UserConProfileQueryLazyQueryHookResult = ReturnType<typeof useUserConProfileQueryLazyQuery>;
export type UserConProfileQueryQueryResult = Apollo.QueryResult<UserConProfileQueryData, UserConProfileQueryVariables>;
export const UserConProfileAdminQueryDocument = gql`
    query UserConProfileAdminQuery($id: Int!) {
  myProfile {
    id
    ability {
      can_read_signups
      can_update_user_con_profile(user_con_profile_id: $id)
      can_delete_user_con_profile(user_con_profile_id: $id)
      can_become_user_con_profile(user_con_profile_id: $id)
    }
  }
  convention: assertConvention {
    id
    name
    starts_at
    ends_at
    timezone_name
    timezone_mode
    ticket_name
    ticket_mode
    user_con_profile_form {
      id
      ...CommonFormFields
      form_sections {
        id
        form_items {
          id
          admin_description
        }
      }
    }
    ticket_types {
      id
      description
      name
      maximum_event_provided_tickets
      providing_products {
        id
        ...AdminProductFields
      }
    }
  }
  userConProfile(id: $id) {
    id
    email
    user_id
    name
    name_without_nickname
    form_response_attrs_json
    gravatar_enabled
    gravatar_url
    ticket {
      id
      ...UserConProfileAdminTicketFields
    }
  }
}
    ${CommonFormFieldsFragmentDoc}
${AdminProductFieldsFragmentDoc}
${UserConProfileAdminTicketFieldsFragmentDoc}`;

/**
 * __useUserConProfileAdminQuery__
 *
 * To run a query within a React component, call `useUserConProfileAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserConProfileAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserConProfileAdminQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserConProfileAdminQuery(baseOptions: Apollo.QueryHookOptions<UserConProfileAdminQueryData, UserConProfileAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserConProfileAdminQueryData, UserConProfileAdminQueryVariables>(UserConProfileAdminQueryDocument, options);
      }
export function useUserConProfileAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserConProfileAdminQueryData, UserConProfileAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserConProfileAdminQueryData, UserConProfileAdminQueryVariables>(UserConProfileAdminQueryDocument, options);
        }
export type UserConProfileAdminQueryHookResult = ReturnType<typeof useUserConProfileAdminQuery>;
export type UserConProfileAdminQueryLazyQueryHookResult = ReturnType<typeof useUserConProfileAdminQueryLazyQuery>;
export type UserConProfileAdminQueryQueryResult = Apollo.QueryResult<UserConProfileAdminQueryData, UserConProfileAdminQueryVariables>;
export const UserConProfilesTableUserConProfilesQueryDocument = gql`
    query UserConProfilesTableUserConProfilesQuery($page: Int, $perPage: Int, $filters: UserConProfileFiltersInput, $sort: [SortInput!]) {
  convention {
    id
    name
    starts_at
    ends_at
    timezone_name
    timezone_mode
    ticket_name
    ticket_mode
    ticket_types {
      id
      name
    }
    user_con_profile_form {
      id
      ...CommonFormFields
      form_sections {
        id
        form_items {
          id
          admin_description
        }
      }
    }
    user_con_profiles_paginated(
      page: $page
      per_page: $perPage
      filters: $filters
      sort: $sort
    ) {
      total_entries
      total_pages
      current_page
      per_page
      entries {
        id
        name_inverted
        first_name
        last_name
        email
        site_admin
        form_response_attrs_json
        order_summary
        gravatar_enabled
        gravatar_url
        user_id
        team_members {
          id
        }
        ticket {
          id
          updated_at
          order_entry {
            id
            price_per_item {
              fractional
              currency_code
            }
          }
          ticket_type {
            id
            name
          }
        }
      }
    }
  }
  currentAbility {
    can_create_user_con_profiles
  }
}
    ${CommonFormFieldsFragmentDoc}`;

/**
 * __useUserConProfilesTableUserConProfilesQuery__
 *
 * To run a query within a React component, call `useUserConProfilesTableUserConProfilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserConProfilesTableUserConProfilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserConProfilesTableUserConProfilesQuery({
 *   variables: {
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *      filters: // value for 'filters'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useUserConProfilesTableUserConProfilesQuery(baseOptions?: Apollo.QueryHookOptions<UserConProfilesTableUserConProfilesQueryData, UserConProfilesTableUserConProfilesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserConProfilesTableUserConProfilesQueryData, UserConProfilesTableUserConProfilesQueryVariables>(UserConProfilesTableUserConProfilesQueryDocument, options);
      }
export function useUserConProfilesTableUserConProfilesQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserConProfilesTableUserConProfilesQueryData, UserConProfilesTableUserConProfilesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserConProfilesTableUserConProfilesQueryData, UserConProfilesTableUserConProfilesQueryVariables>(UserConProfilesTableUserConProfilesQueryDocument, options);
        }
export type UserConProfilesTableUserConProfilesQueryHookResult = ReturnType<typeof useUserConProfilesTableUserConProfilesQuery>;
export type UserConProfilesTableUserConProfilesQueryLazyQueryHookResult = ReturnType<typeof useUserConProfilesTableUserConProfilesQueryLazyQuery>;
export type UserConProfilesTableUserConProfilesQueryQueryResult = Apollo.QueryResult<UserConProfilesTableUserConProfilesQueryData, UserConProfilesTableUserConProfilesQueryVariables>;
export const ConvertToEventProvidedTicketQueryDocument = gql`
    query ConvertToEventProvidedTicketQuery($eventId: Int!) {
  convention {
    id
    ticket_name
    ticket_types {
      id
      maximum_event_provided_tickets(event_id: $eventId)
      description
      name
    }
  }
  event(id: $eventId) {
    id
    title
    event_category {
      id
      can_provide_tickets
    }
    provided_tickets {
      id
      ticket_type {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useConvertToEventProvidedTicketQuery__
 *
 * To run a query within a React component, call `useConvertToEventProvidedTicketQuery` and pass it any options that fit your needs.
 * When your component renders, `useConvertToEventProvidedTicketQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConvertToEventProvidedTicketQuery({
 *   variables: {
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function useConvertToEventProvidedTicketQuery(baseOptions: Apollo.QueryHookOptions<ConvertToEventProvidedTicketQueryData, ConvertToEventProvidedTicketQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ConvertToEventProvidedTicketQueryData, ConvertToEventProvidedTicketQueryVariables>(ConvertToEventProvidedTicketQueryDocument, options);
      }
export function useConvertToEventProvidedTicketQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConvertToEventProvidedTicketQueryData, ConvertToEventProvidedTicketQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ConvertToEventProvidedTicketQueryData, ConvertToEventProvidedTicketQueryVariables>(ConvertToEventProvidedTicketQueryDocument, options);
        }
export type ConvertToEventProvidedTicketQueryHookResult = ReturnType<typeof useConvertToEventProvidedTicketQuery>;
export type ConvertToEventProvidedTicketQueryLazyQueryHookResult = ReturnType<typeof useConvertToEventProvidedTicketQueryLazyQuery>;
export type ConvertToEventProvidedTicketQueryQueryResult = Apollo.QueryResult<ConvertToEventProvidedTicketQueryData, ConvertToEventProvidedTicketQueryVariables>;
export const AddAttendeeUsersQueryDocument = gql`
    query AddAttendeeUsersQuery($name: String) {
  users_paginated(filters: {name: $name}, per_page: 50) {
    entries {
      id
      name
      email
      first_name
      last_name
    }
  }
}
    `;

/**
 * __useAddAttendeeUsersQuery__
 *
 * To run a query within a React component, call `useAddAttendeeUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useAddAttendeeUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAddAttendeeUsersQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useAddAttendeeUsersQuery(baseOptions?: Apollo.QueryHookOptions<AddAttendeeUsersQueryData, AddAttendeeUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AddAttendeeUsersQueryData, AddAttendeeUsersQueryVariables>(AddAttendeeUsersQueryDocument, options);
      }
export function useAddAttendeeUsersQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AddAttendeeUsersQueryData, AddAttendeeUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AddAttendeeUsersQueryData, AddAttendeeUsersQueryVariables>(AddAttendeeUsersQueryDocument, options);
        }
export type AddAttendeeUsersQueryHookResult = ReturnType<typeof useAddAttendeeUsersQuery>;
export type AddAttendeeUsersQueryLazyQueryHookResult = ReturnType<typeof useAddAttendeeUsersQueryLazyQuery>;
export type AddAttendeeUsersQueryQueryResult = Apollo.QueryResult<AddAttendeeUsersQueryData, AddAttendeeUsersQueryVariables>;
export const TicketAdminWithoutTicketAbilityQueryDocument = gql`
    query TicketAdminWithoutTicketAbilityQuery {
  currentAbility {
    can_create_tickets
  }
}
    `;

/**
 * __useTicketAdminWithoutTicketAbilityQuery__
 *
 * To run a query within a React component, call `useTicketAdminWithoutTicketAbilityQuery` and pass it any options that fit your needs.
 * When your component renders, `useTicketAdminWithoutTicketAbilityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTicketAdminWithoutTicketAbilityQuery({
 *   variables: {
 *   },
 * });
 */
export function useTicketAdminWithoutTicketAbilityQuery(baseOptions?: Apollo.QueryHookOptions<TicketAdminWithoutTicketAbilityQueryData, TicketAdminWithoutTicketAbilityQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TicketAdminWithoutTicketAbilityQueryData, TicketAdminWithoutTicketAbilityQueryVariables>(TicketAdminWithoutTicketAbilityQueryDocument, options);
      }
export function useTicketAdminWithoutTicketAbilityQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TicketAdminWithoutTicketAbilityQueryData, TicketAdminWithoutTicketAbilityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TicketAdminWithoutTicketAbilityQueryData, TicketAdminWithoutTicketAbilityQueryVariables>(TicketAdminWithoutTicketAbilityQueryDocument, options);
        }
export type TicketAdminWithoutTicketAbilityQueryHookResult = ReturnType<typeof useTicketAdminWithoutTicketAbilityQuery>;
export type TicketAdminWithoutTicketAbilityQueryLazyQueryHookResult = ReturnType<typeof useTicketAdminWithoutTicketAbilityQueryLazyQuery>;
export type TicketAdminWithoutTicketAbilityQueryQueryResult = Apollo.QueryResult<TicketAdminWithoutTicketAbilityQueryData, TicketAdminWithoutTicketAbilityQueryVariables>;
export const TicketAdminWithTicketAbilityQueryDocument = gql`
    query TicketAdminWithTicketAbilityQuery($ticketId: Int!) {
  currentAbility {
    can_create_tickets
    can_update_ticket(ticket_id: $ticketId)
    can_delete_ticket(ticket_id: $ticketId)
  }
}
    `;

/**
 * __useTicketAdminWithTicketAbilityQuery__
 *
 * To run a query within a React component, call `useTicketAdminWithTicketAbilityQuery` and pass it any options that fit your needs.
 * When your component renders, `useTicketAdminWithTicketAbilityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTicketAdminWithTicketAbilityQuery({
 *   variables: {
 *      ticketId: // value for 'ticketId'
 *   },
 * });
 */
export function useTicketAdminWithTicketAbilityQuery(baseOptions: Apollo.QueryHookOptions<TicketAdminWithTicketAbilityQueryData, TicketAdminWithTicketAbilityQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TicketAdminWithTicketAbilityQueryData, TicketAdminWithTicketAbilityQueryVariables>(TicketAdminWithTicketAbilityQueryDocument, options);
      }
export function useTicketAdminWithTicketAbilityQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TicketAdminWithTicketAbilityQueryData, TicketAdminWithTicketAbilityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TicketAdminWithTicketAbilityQueryData, TicketAdminWithTicketAbilityQueryVariables>(TicketAdminWithTicketAbilityQueryDocument, options);
        }
export type TicketAdminWithTicketAbilityQueryHookResult = ReturnType<typeof useTicketAdminWithTicketAbilityQuery>;
export type TicketAdminWithTicketAbilityQueryLazyQueryHookResult = ReturnType<typeof useTicketAdminWithTicketAbilityQueryLazyQuery>;
export type TicketAdminWithTicketAbilityQueryQueryResult = Apollo.QueryResult<TicketAdminWithTicketAbilityQueryData, TicketAdminWithTicketAbilityQueryVariables>;