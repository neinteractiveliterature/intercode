/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { CommonFormFieldsFragment, CommonFormSectionFieldsFragment, CommonFormItemFieldsFragment } from '../Models/commonFormFragments.generated';
import { AdminOrderFieldsFragmentFragment, OrderEntryFieldsFragment, CartOrderFieldsFragment, CouponApplicationFieldsFragment } from '../Store/orderFields.generated';
import { AdminProductFieldsFragment } from '../Store/adminProductFields.generated';
import { gql } from '@apollo/client';
import { CommonFormFieldsFragmentDoc, CommonFormSectionFieldsFragmentDoc, CommonFormItemFieldsFragmentDoc } from '../Models/commonFormFragments.generated';
import { AdminOrderFieldsFragmentFragmentDoc, OrderEntryFieldsFragmentDoc, CartOrderFieldsFragmentDoc, CouponApplicationFieldsFragmentDoc } from '../Store/orderFields.generated';
import { AdminProductFieldsFragmentDoc } from '../Store/adminProductFields.generated';
import * as Apollo from '@apollo/client';
export type UserConProfileFormDataFragment = (
  { __typename?: 'Convention' }
  & Pick<Types.Convention, 'id' | 'starts_at' | 'ends_at' | 'timezone_name' | 'timezone_mode'>
  & { user_con_profile_form: (
    { __typename?: 'Form' }
    & Pick<Types.Form, 'id'>
    & CommonFormFieldsFragment
  ) }
);

export type UserConProfileFieldsFragment = (
  { __typename?: 'UserConProfile' }
  & Pick<Types.UserConProfile, 'id' | 'name' | 'privileges' | 'form_response_attrs_json' | 'gravatar_enabled' | 'gravatar_url'>
);

export type UserConProfileAdminTicketFieldsFragment = (
  { __typename?: 'Ticket' }
  & Pick<Types.Ticket, 'id' | 'created_at' | 'updated_at'>
  & { order_entry?: Types.Maybe<(
    { __typename?: 'OrderEntry' }
    & Pick<Types.OrderEntry, 'id'>
    & { order: (
      { __typename?: 'Order' }
      & Pick<Types.Order, 'id'>
      & AdminOrderFieldsFragmentFragment
    ), price_per_item: (
      { __typename?: 'Money' }
      & Pick<Types.Money, 'fractional' | 'currency_code'>
    ) }
  )>, ticket_type: (
    { __typename?: 'TicketType' }
    & Pick<Types.TicketType, 'id' | 'description' | 'name'>
  ), provided_by_event?: Types.Maybe<(
    { __typename?: 'Event' }
    & Pick<Types.Event, 'id' | 'title'>
  )> }
);

export type UserConProfileQueryQueryVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type UserConProfileQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & UserConProfileFormDataFragment
  )>, userConProfile: (
    { __typename?: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id'>
    & UserConProfileFieldsFragment
  ) }
);

export type UserConProfileAdminQueryQueryVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type UserConProfileAdminQueryQuery = (
  { __typename?: 'Query' }
  & { myProfile?: Types.Maybe<(
    { __typename?: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id'>
    & { ability?: Types.Maybe<(
      { __typename?: 'Ability' }
      & Pick<Types.Ability, 'can_read_signups' | 'can_update_user_con_profile' | 'can_delete_user_con_profile' | 'can_become_user_con_profile'>
    )> }
  )>, convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name' | 'starts_at' | 'ends_at' | 'timezone_name' | 'timezone_mode' | 'ticket_name' | 'ticket_mode'>
    & { user_con_profile_form: (
      { __typename?: 'Form' }
      & Pick<Types.Form, 'id'>
      & { form_sections: Array<(
        { __typename?: 'FormSection' }
        & Pick<Types.FormSection, 'id'>
        & { form_items: Array<(
          { __typename?: 'FormItem' }
          & Pick<Types.FormItem, 'id' | 'admin_description'>
        )> }
      )> }
      & CommonFormFieldsFragment
    ), ticket_types: Array<(
      { __typename?: 'TicketType' }
      & Pick<Types.TicketType, 'id' | 'description' | 'name' | 'publicly_available' | 'maximum_event_provided_tickets'>
      & { providing_products: Array<(
        { __typename?: 'Product' }
        & Pick<Types.Product, 'id'>
        & AdminProductFieldsFragment
      )> }
    )> }
  )>, userConProfile: (
    { __typename?: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id' | 'email' | 'user_id' | 'name' | 'name_without_nickname' | 'form_response_attrs_json' | 'gravatar_enabled' | 'gravatar_url'>
    & { ticket?: Types.Maybe<(
      { __typename?: 'Ticket' }
      & Pick<Types.Ticket, 'id'>
      & UserConProfileAdminTicketFieldsFragment
    )> }
  ) }
);

export type UserConProfilesTableUserConProfilesQueryQueryVariables = Types.Exact<{
  page?: Types.Maybe<Types.Scalars['Int']>;
  perPage?: Types.Maybe<Types.Scalars['Int']>;
  filters?: Types.Maybe<Types.UserConProfileFiltersInput>;
  sort?: Types.Maybe<Array<Types.SortInput>>;
}>;


export type UserConProfilesTableUserConProfilesQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name' | 'starts_at' | 'ends_at' | 'timezone_name' | 'timezone_mode' | 'ticket_name' | 'ticket_mode'>
    & { ticket_types: Array<(
      { __typename?: 'TicketType' }
      & Pick<Types.TicketType, 'id' | 'name'>
    )>, user_con_profile_form: (
      { __typename?: 'Form' }
      & Pick<Types.Form, 'id'>
      & { form_sections: Array<(
        { __typename?: 'FormSection' }
        & Pick<Types.FormSection, 'id'>
        & { form_items: Array<(
          { __typename?: 'FormItem' }
          & Pick<Types.FormItem, 'id' | 'admin_description'>
        )> }
      )> }
      & CommonFormFieldsFragment
    ), user_con_profiles_paginated: (
      { __typename?: 'UserConProfilesPagination' }
      & Pick<Types.UserConProfilesPagination, 'total_entries' | 'total_pages' | 'current_page' | 'per_page'>
      & { entries: Array<(
        { __typename?: 'UserConProfile' }
        & Pick<Types.UserConProfile, 'id' | 'name_inverted' | 'first_name' | 'last_name' | 'email' | 'privileges' | 'form_response_attrs_json' | 'order_summary' | 'gravatar_enabled' | 'gravatar_url' | 'user_id'>
        & { team_members: Array<(
          { __typename?: 'TeamMember' }
          & Pick<Types.TeamMember, 'id'>
        )>, ticket?: Types.Maybe<(
          { __typename?: 'Ticket' }
          & Pick<Types.Ticket, 'id' | 'updated_at'>
          & { order_entry?: Types.Maybe<(
            { __typename?: 'OrderEntry' }
            & Pick<Types.OrderEntry, 'id'>
            & { price_per_item: (
              { __typename?: 'Money' }
              & Pick<Types.Money, 'fractional' | 'currency_code'>
            ) }
          )>, ticket_type: (
            { __typename?: 'TicketType' }
            & Pick<Types.TicketType, 'id' | 'name'>
          ) }
        )> }
      )> }
    ) }
  )>, currentAbility: (
    { __typename?: 'Ability' }
    & Pick<Types.Ability, 'can_create_user_con_profiles'>
  ) }
);

export type ConvertToEventProvidedTicketQueryQueryVariables = Types.Exact<{
  eventId: Types.Scalars['Int'];
}>;


export type ConvertToEventProvidedTicketQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id' | 'ticket_name'>
    & { ticket_types: Array<(
      { __typename?: 'TicketType' }
      & Pick<Types.TicketType, 'id' | 'maximum_event_provided_tickets' | 'description' | 'name'>
    )> }
  )>, event: (
    { __typename?: 'Event' }
    & Pick<Types.Event, 'id' | 'title'>
    & { event_category: (
      { __typename?: 'EventCategory' }
      & Pick<Types.EventCategory, 'id' | 'can_provide_tickets'>
    ), provided_tickets: Array<(
      { __typename?: 'Ticket' }
      & Pick<Types.Ticket, 'id'>
      & { ticket_type: (
        { __typename?: 'TicketType' }
        & Pick<Types.TicketType, 'id'>
      ) }
    )> }
  ) }
);

export type AddAttendeeUsersQueryQueryVariables = Types.Exact<{
  name?: Types.Maybe<Types.Scalars['String']>;
}>;


export type AddAttendeeUsersQueryQuery = (
  { __typename?: 'Query' }
  & { users_paginated: (
    { __typename?: 'UsersPagination' }
    & { entries: Array<(
      { __typename?: 'User' }
      & Pick<Types.User, 'id' | 'name' | 'email' | 'first_name' | 'last_name'>
    )> }
  ) }
);

export type TicketAdminWithoutTicketAbilityQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type TicketAdminWithoutTicketAbilityQueryQuery = (
  { __typename?: 'Query' }
  & { currentAbility: (
    { __typename?: 'Ability' }
    & Pick<Types.Ability, 'can_create_tickets'>
  ) }
);

export type TicketAdminWithTicketAbilityQueryQueryVariables = Types.Exact<{
  ticketId: Types.Scalars['Int'];
}>;


export type TicketAdminWithTicketAbilityQueryQuery = (
  { __typename?: 'Query' }
  & { currentAbility: (
    { __typename?: 'Ability' }
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
  privileges
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
    ${AdminOrderFieldsFragmentFragmentDoc}`;
export const UserConProfileQueryDocument = gql`
    query UserConProfileQuery($id: Int!) {
  convention {
    ...UserConProfileFormData
    id
  }
  userConProfile(id: $id) {
    id
    ...UserConProfileFields
  }
}
    ${UserConProfileFormDataFragmentDoc}
${UserConProfileFieldsFragmentDoc}`;

/**
 * __useUserConProfileQueryQuery__
 *
 * To run a query within a React component, call `useUserConProfileQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserConProfileQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserConProfileQueryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserConProfileQueryQuery(baseOptions?: Apollo.QueryHookOptions<UserConProfileQueryQuery, UserConProfileQueryQueryVariables>) {
        return Apollo.useQuery<UserConProfileQueryQuery, UserConProfileQueryQueryVariables>(UserConProfileQueryDocument, baseOptions);
      }
export function useUserConProfileQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserConProfileQueryQuery, UserConProfileQueryQueryVariables>) {
          return Apollo.useLazyQuery<UserConProfileQueryQuery, UserConProfileQueryQueryVariables>(UserConProfileQueryDocument, baseOptions);
        }
export type UserConProfileQueryQueryHookResult = ReturnType<typeof useUserConProfileQueryQuery>;
export type UserConProfileQueryLazyQueryHookResult = ReturnType<typeof useUserConProfileQueryLazyQuery>;
export type UserConProfileQueryQueryResult = Apollo.QueryResult<UserConProfileQueryQuery, UserConProfileQueryQueryVariables>;
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
  convention {
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
      publicly_available
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
 * __useUserConProfileAdminQueryQuery__
 *
 * To run a query within a React component, call `useUserConProfileAdminQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserConProfileAdminQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserConProfileAdminQueryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserConProfileAdminQueryQuery(baseOptions?: Apollo.QueryHookOptions<UserConProfileAdminQueryQuery, UserConProfileAdminQueryQueryVariables>) {
        return Apollo.useQuery<UserConProfileAdminQueryQuery, UserConProfileAdminQueryQueryVariables>(UserConProfileAdminQueryDocument, baseOptions);
      }
export function useUserConProfileAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserConProfileAdminQueryQuery, UserConProfileAdminQueryQueryVariables>) {
          return Apollo.useLazyQuery<UserConProfileAdminQueryQuery, UserConProfileAdminQueryQueryVariables>(UserConProfileAdminQueryDocument, baseOptions);
        }
export type UserConProfileAdminQueryQueryHookResult = ReturnType<typeof useUserConProfileAdminQueryQuery>;
export type UserConProfileAdminQueryLazyQueryHookResult = ReturnType<typeof useUserConProfileAdminQueryLazyQuery>;
export type UserConProfileAdminQueryQueryResult = Apollo.QueryResult<UserConProfileAdminQueryQuery, UserConProfileAdminQueryQueryVariables>;
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
    user_con_profiles_paginated(page: $page, per_page: $perPage, filters: $filters, sort: $sort) {
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
        privileges
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
 * __useUserConProfilesTableUserConProfilesQueryQuery__
 *
 * To run a query within a React component, call `useUserConProfilesTableUserConProfilesQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserConProfilesTableUserConProfilesQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserConProfilesTableUserConProfilesQueryQuery({
 *   variables: {
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *      filters: // value for 'filters'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useUserConProfilesTableUserConProfilesQueryQuery(baseOptions?: Apollo.QueryHookOptions<UserConProfilesTableUserConProfilesQueryQuery, UserConProfilesTableUserConProfilesQueryQueryVariables>) {
        return Apollo.useQuery<UserConProfilesTableUserConProfilesQueryQuery, UserConProfilesTableUserConProfilesQueryQueryVariables>(UserConProfilesTableUserConProfilesQueryDocument, baseOptions);
      }
export function useUserConProfilesTableUserConProfilesQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserConProfilesTableUserConProfilesQueryQuery, UserConProfilesTableUserConProfilesQueryQueryVariables>) {
          return Apollo.useLazyQuery<UserConProfilesTableUserConProfilesQueryQuery, UserConProfilesTableUserConProfilesQueryQueryVariables>(UserConProfilesTableUserConProfilesQueryDocument, baseOptions);
        }
export type UserConProfilesTableUserConProfilesQueryQueryHookResult = ReturnType<typeof useUserConProfilesTableUserConProfilesQueryQuery>;
export type UserConProfilesTableUserConProfilesQueryLazyQueryHookResult = ReturnType<typeof useUserConProfilesTableUserConProfilesQueryLazyQuery>;
export type UserConProfilesTableUserConProfilesQueryQueryResult = Apollo.QueryResult<UserConProfilesTableUserConProfilesQueryQuery, UserConProfilesTableUserConProfilesQueryQueryVariables>;
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
      }
    }
  }
}
    `;

/**
 * __useConvertToEventProvidedTicketQueryQuery__
 *
 * To run a query within a React component, call `useConvertToEventProvidedTicketQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useConvertToEventProvidedTicketQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConvertToEventProvidedTicketQueryQuery({
 *   variables: {
 *      eventId: // value for 'eventId'
 *   },
 * });
 */
export function useConvertToEventProvidedTicketQueryQuery(baseOptions?: Apollo.QueryHookOptions<ConvertToEventProvidedTicketQueryQuery, ConvertToEventProvidedTicketQueryQueryVariables>) {
        return Apollo.useQuery<ConvertToEventProvidedTicketQueryQuery, ConvertToEventProvidedTicketQueryQueryVariables>(ConvertToEventProvidedTicketQueryDocument, baseOptions);
      }
export function useConvertToEventProvidedTicketQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConvertToEventProvidedTicketQueryQuery, ConvertToEventProvidedTicketQueryQueryVariables>) {
          return Apollo.useLazyQuery<ConvertToEventProvidedTicketQueryQuery, ConvertToEventProvidedTicketQueryQueryVariables>(ConvertToEventProvidedTicketQueryDocument, baseOptions);
        }
export type ConvertToEventProvidedTicketQueryQueryHookResult = ReturnType<typeof useConvertToEventProvidedTicketQueryQuery>;
export type ConvertToEventProvidedTicketQueryLazyQueryHookResult = ReturnType<typeof useConvertToEventProvidedTicketQueryLazyQuery>;
export type ConvertToEventProvidedTicketQueryQueryResult = Apollo.QueryResult<ConvertToEventProvidedTicketQueryQuery, ConvertToEventProvidedTicketQueryQueryVariables>;
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
 * __useAddAttendeeUsersQueryQuery__
 *
 * To run a query within a React component, call `useAddAttendeeUsersQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useAddAttendeeUsersQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAddAttendeeUsersQueryQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useAddAttendeeUsersQueryQuery(baseOptions?: Apollo.QueryHookOptions<AddAttendeeUsersQueryQuery, AddAttendeeUsersQueryQueryVariables>) {
        return Apollo.useQuery<AddAttendeeUsersQueryQuery, AddAttendeeUsersQueryQueryVariables>(AddAttendeeUsersQueryDocument, baseOptions);
      }
export function useAddAttendeeUsersQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AddAttendeeUsersQueryQuery, AddAttendeeUsersQueryQueryVariables>) {
          return Apollo.useLazyQuery<AddAttendeeUsersQueryQuery, AddAttendeeUsersQueryQueryVariables>(AddAttendeeUsersQueryDocument, baseOptions);
        }
export type AddAttendeeUsersQueryQueryHookResult = ReturnType<typeof useAddAttendeeUsersQueryQuery>;
export type AddAttendeeUsersQueryLazyQueryHookResult = ReturnType<typeof useAddAttendeeUsersQueryLazyQuery>;
export type AddAttendeeUsersQueryQueryResult = Apollo.QueryResult<AddAttendeeUsersQueryQuery, AddAttendeeUsersQueryQueryVariables>;
export const TicketAdminWithoutTicketAbilityQueryDocument = gql`
    query TicketAdminWithoutTicketAbilityQuery {
  currentAbility {
    can_create_tickets
  }
}
    `;

/**
 * __useTicketAdminWithoutTicketAbilityQueryQuery__
 *
 * To run a query within a React component, call `useTicketAdminWithoutTicketAbilityQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useTicketAdminWithoutTicketAbilityQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTicketAdminWithoutTicketAbilityQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useTicketAdminWithoutTicketAbilityQueryQuery(baseOptions?: Apollo.QueryHookOptions<TicketAdminWithoutTicketAbilityQueryQuery, TicketAdminWithoutTicketAbilityQueryQueryVariables>) {
        return Apollo.useQuery<TicketAdminWithoutTicketAbilityQueryQuery, TicketAdminWithoutTicketAbilityQueryQueryVariables>(TicketAdminWithoutTicketAbilityQueryDocument, baseOptions);
      }
export function useTicketAdminWithoutTicketAbilityQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TicketAdminWithoutTicketAbilityQueryQuery, TicketAdminWithoutTicketAbilityQueryQueryVariables>) {
          return Apollo.useLazyQuery<TicketAdminWithoutTicketAbilityQueryQuery, TicketAdminWithoutTicketAbilityQueryQueryVariables>(TicketAdminWithoutTicketAbilityQueryDocument, baseOptions);
        }
export type TicketAdminWithoutTicketAbilityQueryQueryHookResult = ReturnType<typeof useTicketAdminWithoutTicketAbilityQueryQuery>;
export type TicketAdminWithoutTicketAbilityQueryLazyQueryHookResult = ReturnType<typeof useTicketAdminWithoutTicketAbilityQueryLazyQuery>;
export type TicketAdminWithoutTicketAbilityQueryQueryResult = Apollo.QueryResult<TicketAdminWithoutTicketAbilityQueryQuery, TicketAdminWithoutTicketAbilityQueryQueryVariables>;
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
 * __useTicketAdminWithTicketAbilityQueryQuery__
 *
 * To run a query within a React component, call `useTicketAdminWithTicketAbilityQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useTicketAdminWithTicketAbilityQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTicketAdminWithTicketAbilityQueryQuery({
 *   variables: {
 *      ticketId: // value for 'ticketId'
 *   },
 * });
 */
export function useTicketAdminWithTicketAbilityQueryQuery(baseOptions?: Apollo.QueryHookOptions<TicketAdminWithTicketAbilityQueryQuery, TicketAdminWithTicketAbilityQueryQueryVariables>) {
        return Apollo.useQuery<TicketAdminWithTicketAbilityQueryQuery, TicketAdminWithTicketAbilityQueryQueryVariables>(TicketAdminWithTicketAbilityQueryDocument, baseOptions);
      }
export function useTicketAdminWithTicketAbilityQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TicketAdminWithTicketAbilityQueryQuery, TicketAdminWithTicketAbilityQueryQueryVariables>) {
          return Apollo.useLazyQuery<TicketAdminWithTicketAbilityQueryQuery, TicketAdminWithTicketAbilityQueryQueryVariables>(TicketAdminWithTicketAbilityQueryDocument, baseOptions);
        }
export type TicketAdminWithTicketAbilityQueryQueryHookResult = ReturnType<typeof useTicketAdminWithTicketAbilityQueryQuery>;
export type TicketAdminWithTicketAbilityQueryLazyQueryHookResult = ReturnType<typeof useTicketAdminWithTicketAbilityQueryLazyQuery>;
export type TicketAdminWithTicketAbilityQueryQueryResult = Apollo.QueryResult<TicketAdminWithTicketAbilityQueryQuery, TicketAdminWithTicketAbilityQueryQueryVariables>;