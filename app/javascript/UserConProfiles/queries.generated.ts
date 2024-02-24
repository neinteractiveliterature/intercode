/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CommonFormFieldsFragmentDoc } from '../Models/commonFormFragments.generated';
import { AdminOrderFieldsFragmentDoc, OrderEntryFieldsFragmentDoc, CartOrderFieldsFragmentDoc, CouponApplicationFieldsFragmentDoc } from '../Store/orderFields.generated';
import { AdminProductFieldsFragmentDoc } from '../Store/adminProductFields.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UserConProfileFormDataFragment = { __typename: 'Convention', id: string, starts_at?: string | null, ends_at?: string | null, timezone_name?: string | null, timezone_mode: Types.TimezoneMode, user_con_profile_form: { __typename: 'Form', id: string, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: string, title?: string | null, position: number, form_items: Array<{ __typename: 'FormItem', id: string, position: number, identifier?: string | null, item_type: string, rendered_properties: string, default_value?: string | null, visibility: Types.FormItemRole, writeability: Types.FormItemRole, expose_in?: Array<Types.FormItemExposeIn> | null }> }> } };

export type UserConProfileFieldsFragment = { __typename: 'UserConProfile', id: string, name: string, form_response_attrs_json?: string | null, gravatar_enabled: boolean, gravatar_url: string };

export type UserConProfileAdminTicketFieldsFragment = { __typename: 'Ticket', id: string, created_at: string, updated_at: string, order_entry?: { __typename: 'OrderEntry', id: string, order: { __typename: 'Order', id: string, status: Types.OrderStatus, submitted_at?: string | null, charge_id?: string | null, payment_note?: string | null, user_con_profile: { __typename: 'UserConProfile', id: string, name_without_nickname: string }, total_price: { __typename: 'Money', fractional: number, currency_code: string }, payment_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null, coupon_applications: Array<{ __typename: 'CouponApplication', id: string, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', id: string, code: string, percent_discount?: string | null, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null, provides_product?: { __typename: 'Product', id: string, name: string } | null } }>, order_entries: Array<{ __typename: 'OrderEntry', id: string, quantity: number, describe_products: string, product: { __typename: 'Product', id: string, name: string }, product_variant?: { __typename: 'ProductVariant', id: string, name: string } | null, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }> }, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } } | null, ticket_type: { __typename: 'TicketType', id: string, description?: string | null, name: string }, provided_by_event?: { __typename: 'Event', id: string, title?: string | null } | null };

export type UserConProfileQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type UserConProfileQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, starts_at?: string | null, ends_at?: string | null, timezone_name?: string | null, timezone_mode: Types.TimezoneMode, user_con_profile: { __typename: 'UserConProfile', id: string, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, name: string, form_response_attrs_json?: string | null, gravatar_enabled: boolean, gravatar_url: string }, user_con_profile_form: { __typename: 'Form', id: string, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: string, title?: string | null, position: number, form_items: Array<{ __typename: 'FormItem', id: string, position: number, identifier?: string | null, item_type: string, rendered_properties: string, default_value?: string | null, visibility: Types.FormItemRole, writeability: Types.FormItemRole, expose_in?: Array<Types.FormItemExposeIn> | null }> }> } } };

export type UserConProfileAdminQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type UserConProfileAdminQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, name: string, starts_at?: string | null, ends_at?: string | null, timezone_name?: string | null, timezone_mode: Types.TimezoneMode, ticket_name: string, ticket_mode: Types.TicketMode, my_profile?: { __typename: 'UserConProfile', id: string, ability?: { __typename: 'Ability', can_read_signups: boolean, can_update_user_con_profile: boolean, can_delete_user_con_profile: boolean, can_become_user_con_profile: boolean } | null } | null, user_con_profile: { __typename: 'UserConProfile', id: string, email?: string | null, user_id: string, name: string, name_without_nickname: string, form_response_attrs_json?: string | null, gravatar_enabled: boolean, gravatar_url: string, ticket?: { __typename: 'Ticket', id: string, created_at: string, updated_at: string, order_entry?: { __typename: 'OrderEntry', id: string, order: { __typename: 'Order', id: string, status: Types.OrderStatus, submitted_at?: string | null, charge_id?: string | null, payment_note?: string | null, user_con_profile: { __typename: 'UserConProfile', id: string, name_without_nickname: string }, total_price: { __typename: 'Money', fractional: number, currency_code: string }, payment_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null, coupon_applications: Array<{ __typename: 'CouponApplication', id: string, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', id: string, code: string, percent_discount?: string | null, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null, provides_product?: { __typename: 'Product', id: string, name: string } | null } }>, order_entries: Array<{ __typename: 'OrderEntry', id: string, quantity: number, describe_products: string, product: { __typename: 'Product', id: string, name: string }, product_variant?: { __typename: 'ProductVariant', id: string, name: string } | null, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }> }, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } } | null, ticket_type: { __typename: 'TicketType', id: string, description?: string | null, name: string }, provided_by_event?: { __typename: 'Event', id: string, title?: string | null } | null } | null }, user_con_profile_form: { __typename: 'Form', id: string, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: string, title?: string | null, position: number, form_items: Array<{ __typename: 'FormItem', id: string, admin_description?: string | null, position: number, identifier?: string | null, item_type: string, rendered_properties: string, default_value?: string | null, visibility: Types.FormItemRole, writeability: Types.FormItemRole, expose_in?: Array<Types.FormItemExposeIn> | null }> }> }, ticket_types: Array<{ __typename: 'TicketType', id: string, description?: string | null, name: string, maximum_event_provided_tickets: number, providing_products: Array<{ __typename: 'Product', id: string, name: string, description?: string | null, description_html?: string | null, available: boolean, payment_options: Array<string>, clickwrap_agreement?: string | null, clickwrap_agreement_html?: string | null, image?: { __typename: 'ActiveStorageAttachment', id: string, url: string } | null, pricing_structure: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'PayWhatYouWantValue', maximum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, minimum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, suggested_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: string | null, finish?: string | null, value: { __typename: 'Money', fractional: number, currency_code: string } }> } }, product_variants: Array<{ __typename: 'ProductVariant', id: string, name: string, description?: string | null, position?: number | null, image?: { __typename: 'ActiveStorageAttachment', id: string, url: string } | null, override_pricing_structure?: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'PayWhatYouWantValue', maximum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, minimum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, suggested_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: string | null, finish?: string | null, value: { __typename: 'Money', fractional: number, currency_code: string } }> } } | null }>, provides_ticket_type?: { __typename: 'TicketType', id: string, description?: string | null } | null }> }> } };

export type UserConProfilesTableUserConProfilesQueryVariables = Types.Exact<{
  page?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  perPage?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  filters?: Types.InputMaybe<Types.UserConProfileFiltersInput>;
  sort?: Types.InputMaybe<Array<Types.SortInput> | Types.SortInput>;
}>;


export type UserConProfilesTableUserConProfilesQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, name: string, starts_at?: string | null, ends_at?: string | null, timezone_name?: string | null, timezone_mode: Types.TimezoneMode, ticket_name: string, ticket_mode: Types.TicketMode, ticket_types: Array<{ __typename: 'TicketType', id: string, name: string }>, user_con_profile_form: { __typename: 'Form', id: string, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: string, title?: string | null, position: number, form_items: Array<{ __typename: 'FormItem', id: string, admin_description?: string | null, position: number, identifier?: string | null, item_type: string, rendered_properties: string, default_value?: string | null, visibility: Types.FormItemRole, writeability: Types.FormItemRole, expose_in?: Array<Types.FormItemExposeIn> | null }> }> }, user_con_profiles_paginated: { __typename: 'UserConProfilesPagination', total_entries: number, total_pages: number, current_page: number, per_page: number, entries: Array<{ __typename: 'UserConProfile', id: string, name_inverted: string, first_name: string, last_name: string, email?: string | null, site_admin: boolean, form_response_attrs_json?: string | null, order_summary: string, gravatar_enabled: boolean, gravatar_url: string, user_id: string, team_members: Array<{ __typename: 'TeamMember', id: string }>, ticket?: { __typename: 'Ticket', id: string, updated_at: string, order_entry?: { __typename: 'OrderEntry', id: string, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } } | null, ticket_type: { __typename: 'TicketType', id: string, name: string } } | null }> } }, currentAbility: { __typename: 'Ability', can_create_user_con_profiles: boolean } };

export type ConvertToEventProvidedTicketQueryVariables = Types.Exact<{
  eventId: Types.Scalars['ID']['input'];
}>;


export type ConvertToEventProvidedTicketQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, ticket_name: string, ticketNamePlural: string, event: { __typename: 'Event', id: string, title?: string | null, event_category: { __typename: 'EventCategory', id: string, can_provide_tickets: boolean }, provided_tickets: Array<{ __typename: 'Ticket', id: string, ticket_type: { __typename: 'TicketType', id: string, name: string } }> }, ticket_types: Array<{ __typename: 'TicketType', id: string, maximum_event_provided_tickets: number, description?: string | null, name: string }> } };

export type AddAttendeeUsersQueryVariables = Types.Exact<{
  name?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type AddAttendeeUsersQueryData = { __typename: 'Query', users_paginated: { __typename: 'UsersPagination', entries: Array<{ __typename: 'User', id: string, name?: string | null, email?: string | null, first_name?: string | null, last_name?: string | null }> } };

export type TicketAdminWithoutTicketAbilityQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type TicketAdminWithoutTicketAbilityQueryData = { __typename: 'Query', currentAbility: { __typename: 'Ability', can_create_tickets: boolean } };

export type TicketAdminWithTicketAbilityQueryVariables = Types.Exact<{
  ticketId: Types.Scalars['ID']['input'];
}>;


export type TicketAdminWithTicketAbilityQueryData = { __typename: 'Query', currentAbility: { __typename: 'Ability', can_create_tickets: boolean, can_update_ticket: boolean, can_delete_ticket: boolean } };

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
    query UserConProfileQuery($id: ID!) {
  convention: conventionByRequestHost {
    ...UserConProfileFormData
    id
    user_con_profile(id: $id) {
      id
      current_user_form_item_viewer_role
      current_user_form_item_writer_role
      ...UserConProfileFields
    }
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
export function useUserConProfileQuery(baseOptions: Apollo.QueryHookOptions<UserConProfileQueryData, UserConProfileQueryVariables> & ({ variables: UserConProfileQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserConProfileQueryData, UserConProfileQueryVariables>(UserConProfileQueryDocument, options);
      }
export function useUserConProfileQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserConProfileQueryData, UserConProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserConProfileQueryData, UserConProfileQueryVariables>(UserConProfileQueryDocument, options);
        }
export function useUserConProfileQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<UserConProfileQueryData, UserConProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UserConProfileQueryData, UserConProfileQueryVariables>(UserConProfileQueryDocument, options);
        }
export type UserConProfileQueryHookResult = ReturnType<typeof useUserConProfileQuery>;
export type UserConProfileQueryLazyQueryHookResult = ReturnType<typeof useUserConProfileQueryLazyQuery>;
export type UserConProfileQuerySuspenseQueryHookResult = ReturnType<typeof useUserConProfileQuerySuspenseQuery>;
export type UserConProfileQueryQueryResult = Apollo.QueryResult<UserConProfileQueryData, UserConProfileQueryVariables>;
export const UserConProfileAdminQueryDocument = gql`
    query UserConProfileAdminQuery($id: ID!) {
  convention: conventionByRequestHost {
    id
    name
    starts_at
    ends_at
    timezone_name
    timezone_mode
    ticket_name
    ticket_mode
    my_profile {
      id
      ability {
        can_read_signups
        can_update_user_con_profile(userConProfileId: $id)
        can_delete_user_con_profile(userConProfileId: $id)
        can_become_user_con_profile(userConProfileId: $id)
      }
    }
    user_con_profile(id: $id) {
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
}
    ${UserConProfileAdminTicketFieldsFragmentDoc}
${CommonFormFieldsFragmentDoc}
${AdminProductFieldsFragmentDoc}`;

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
export function useUserConProfileAdminQuery(baseOptions: Apollo.QueryHookOptions<UserConProfileAdminQueryData, UserConProfileAdminQueryVariables> & ({ variables: UserConProfileAdminQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserConProfileAdminQueryData, UserConProfileAdminQueryVariables>(UserConProfileAdminQueryDocument, options);
      }
export function useUserConProfileAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserConProfileAdminQueryData, UserConProfileAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserConProfileAdminQueryData, UserConProfileAdminQueryVariables>(UserConProfileAdminQueryDocument, options);
        }
export function useUserConProfileAdminQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<UserConProfileAdminQueryData, UserConProfileAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UserConProfileAdminQueryData, UserConProfileAdminQueryVariables>(UserConProfileAdminQueryDocument, options);
        }
export type UserConProfileAdminQueryHookResult = ReturnType<typeof useUserConProfileAdminQuery>;
export type UserConProfileAdminQueryLazyQueryHookResult = ReturnType<typeof useUserConProfileAdminQueryLazyQuery>;
export type UserConProfileAdminQuerySuspenseQueryHookResult = ReturnType<typeof useUserConProfileAdminQuerySuspenseQuery>;
export type UserConProfileAdminQueryQueryResult = Apollo.QueryResult<UserConProfileAdminQueryData, UserConProfileAdminQueryVariables>;
export const UserConProfilesTableUserConProfilesQueryDocument = gql`
    query UserConProfilesTableUserConProfilesQuery($page: Int, $perPage: Int, $filters: UserConProfileFiltersInput, $sort: [SortInput!]) {
  convention: conventionByRequestHost {
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
export function useUserConProfilesTableUserConProfilesQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<UserConProfilesTableUserConProfilesQueryData, UserConProfilesTableUserConProfilesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UserConProfilesTableUserConProfilesQueryData, UserConProfilesTableUserConProfilesQueryVariables>(UserConProfilesTableUserConProfilesQueryDocument, options);
        }
export type UserConProfilesTableUserConProfilesQueryHookResult = ReturnType<typeof useUserConProfilesTableUserConProfilesQuery>;
export type UserConProfilesTableUserConProfilesQueryLazyQueryHookResult = ReturnType<typeof useUserConProfilesTableUserConProfilesQueryLazyQuery>;
export type UserConProfilesTableUserConProfilesQuerySuspenseQueryHookResult = ReturnType<typeof useUserConProfilesTableUserConProfilesQuerySuspenseQuery>;
export type UserConProfilesTableUserConProfilesQueryQueryResult = Apollo.QueryResult<UserConProfilesTableUserConProfilesQueryData, UserConProfilesTableUserConProfilesQueryVariables>;
export const ConvertToEventProvidedTicketQueryDocument = gql`
    query ConvertToEventProvidedTicketQuery($eventId: ID!) {
  convention: conventionByRequestHost {
    id
    ticket_name
    ticketNamePlural
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
    ticket_types {
      id
      maximum_event_provided_tickets(eventId: $eventId)
      description
      name
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
export function useConvertToEventProvidedTicketQuery(baseOptions: Apollo.QueryHookOptions<ConvertToEventProvidedTicketQueryData, ConvertToEventProvidedTicketQueryVariables> & ({ variables: ConvertToEventProvidedTicketQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ConvertToEventProvidedTicketQueryData, ConvertToEventProvidedTicketQueryVariables>(ConvertToEventProvidedTicketQueryDocument, options);
      }
export function useConvertToEventProvidedTicketQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConvertToEventProvidedTicketQueryData, ConvertToEventProvidedTicketQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ConvertToEventProvidedTicketQueryData, ConvertToEventProvidedTicketQueryVariables>(ConvertToEventProvidedTicketQueryDocument, options);
        }
export function useConvertToEventProvidedTicketQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ConvertToEventProvidedTicketQueryData, ConvertToEventProvidedTicketQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ConvertToEventProvidedTicketQueryData, ConvertToEventProvidedTicketQueryVariables>(ConvertToEventProvidedTicketQueryDocument, options);
        }
export type ConvertToEventProvidedTicketQueryHookResult = ReturnType<typeof useConvertToEventProvidedTicketQuery>;
export type ConvertToEventProvidedTicketQueryLazyQueryHookResult = ReturnType<typeof useConvertToEventProvidedTicketQueryLazyQuery>;
export type ConvertToEventProvidedTicketQuerySuspenseQueryHookResult = ReturnType<typeof useConvertToEventProvidedTicketQuerySuspenseQuery>;
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
export function useAddAttendeeUsersQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AddAttendeeUsersQueryData, AddAttendeeUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AddAttendeeUsersQueryData, AddAttendeeUsersQueryVariables>(AddAttendeeUsersQueryDocument, options);
        }
export type AddAttendeeUsersQueryHookResult = ReturnType<typeof useAddAttendeeUsersQuery>;
export type AddAttendeeUsersQueryLazyQueryHookResult = ReturnType<typeof useAddAttendeeUsersQueryLazyQuery>;
export type AddAttendeeUsersQuerySuspenseQueryHookResult = ReturnType<typeof useAddAttendeeUsersQuerySuspenseQuery>;
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
export function useTicketAdminWithoutTicketAbilityQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<TicketAdminWithoutTicketAbilityQueryData, TicketAdminWithoutTicketAbilityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TicketAdminWithoutTicketAbilityQueryData, TicketAdminWithoutTicketAbilityQueryVariables>(TicketAdminWithoutTicketAbilityQueryDocument, options);
        }
export type TicketAdminWithoutTicketAbilityQueryHookResult = ReturnType<typeof useTicketAdminWithoutTicketAbilityQuery>;
export type TicketAdminWithoutTicketAbilityQueryLazyQueryHookResult = ReturnType<typeof useTicketAdminWithoutTicketAbilityQueryLazyQuery>;
export type TicketAdminWithoutTicketAbilityQuerySuspenseQueryHookResult = ReturnType<typeof useTicketAdminWithoutTicketAbilityQuerySuspenseQuery>;
export type TicketAdminWithoutTicketAbilityQueryQueryResult = Apollo.QueryResult<TicketAdminWithoutTicketAbilityQueryData, TicketAdminWithoutTicketAbilityQueryVariables>;
export const TicketAdminWithTicketAbilityQueryDocument = gql`
    query TicketAdminWithTicketAbilityQuery($ticketId: ID!) {
  currentAbility {
    can_create_tickets
    can_update_ticket(ticketId: $ticketId)
    can_delete_ticket(ticketId: $ticketId)
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
export function useTicketAdminWithTicketAbilityQuery(baseOptions: Apollo.QueryHookOptions<TicketAdminWithTicketAbilityQueryData, TicketAdminWithTicketAbilityQueryVariables> & ({ variables: TicketAdminWithTicketAbilityQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TicketAdminWithTicketAbilityQueryData, TicketAdminWithTicketAbilityQueryVariables>(TicketAdminWithTicketAbilityQueryDocument, options);
      }
export function useTicketAdminWithTicketAbilityQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TicketAdminWithTicketAbilityQueryData, TicketAdminWithTicketAbilityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TicketAdminWithTicketAbilityQueryData, TicketAdminWithTicketAbilityQueryVariables>(TicketAdminWithTicketAbilityQueryDocument, options);
        }
export function useTicketAdminWithTicketAbilityQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<TicketAdminWithTicketAbilityQueryData, TicketAdminWithTicketAbilityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TicketAdminWithTicketAbilityQueryData, TicketAdminWithTicketAbilityQueryVariables>(TicketAdminWithTicketAbilityQueryDocument, options);
        }
export type TicketAdminWithTicketAbilityQueryHookResult = ReturnType<typeof useTicketAdminWithTicketAbilityQuery>;
export type TicketAdminWithTicketAbilityQueryLazyQueryHookResult = ReturnType<typeof useTicketAdminWithTicketAbilityQueryLazyQuery>;
export type TicketAdminWithTicketAbilityQuerySuspenseQueryHookResult = ReturnType<typeof useTicketAdminWithTicketAbilityQuerySuspenseQuery>;
export type TicketAdminWithTicketAbilityQueryQueryResult = Apollo.QueryResult<TicketAdminWithTicketAbilityQueryData, TicketAdminWithTicketAbilityQueryVariables>;