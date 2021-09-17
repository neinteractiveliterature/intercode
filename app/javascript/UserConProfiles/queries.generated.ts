/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CommonFormFieldsFragmentDoc, CommonFormSectionFieldsFragmentDoc, CommonFormItemFieldsFragmentDoc } from '../Models/commonFormFragments.generated';
import { AdminOrderFieldsFragmentDoc } from '../Store/orderFields.generated';
import { AdminProductFieldsFragmentDoc } from '../Store/adminProductFields.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type UserConProfileFormDataFragment = { __typename: 'Convention', id: number, starts_at?: Types.Maybe<any>, ends_at?: Types.Maybe<any>, timezone_name?: Types.Maybe<string>, timezone_mode: Types.TimezoneMode, user_con_profile_form: { __typename: 'Form', id: number, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: number, title?: Types.Maybe<string>, position: number, form_items: Array<{ __typename: 'FormItem', id: number, position: number, identifier?: Types.Maybe<string>, item_type: string, rendered_properties?: Types.Maybe<any>, default_value?: Types.Maybe<any>, visibility: Types.FormItemRole, writeability: Types.FormItemRole }> }> } };

export type UserConProfileFieldsFragment = { __typename: 'UserConProfile', id: number, name: string, form_response_attrs_json?: Types.Maybe<any>, gravatar_enabled: boolean, gravatar_url: string };

export type UserConProfileAdminTicketFieldsFragment = { __typename: 'Ticket', id: number, created_at: any, updated_at: any, order_entry?: Types.Maybe<{ __typename: 'OrderEntry', id: number, order: { __typename: 'Order', id: number, status: Types.OrderStatus, submitted_at?: Types.Maybe<any>, charge_id?: Types.Maybe<string>, payment_note?: Types.Maybe<string>, user_con_profile: { __typename: 'UserConProfile', id: number, name_without_nickname: string }, total_price: { __typename: 'Money', fractional: number, currency_code: string }, payment_amount?: Types.Maybe<{ __typename: 'Money', fractional: number, currency_code: string }>, coupon_applications: Array<{ __typename: 'CouponApplication', id: number, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', id: number, code: string, percent_discount?: Types.Maybe<any>, fixed_amount?: Types.Maybe<{ __typename: 'Money', fractional: number, currency_code: string }>, provides_product?: Types.Maybe<{ __typename: 'Product', id: number, name: string }> } }>, order_entries: Array<{ __typename: 'OrderEntry', id: number, quantity: number, describe_products: string, product: { __typename: 'Product', id: number, name: string }, product_variant?: Types.Maybe<{ __typename: 'ProductVariant', id: number, name: string }>, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }> }, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }>, ticket_type: { __typename: 'TicketType', id: number, description?: Types.Maybe<string>, name: string }, provided_by_event?: Types.Maybe<{ __typename: 'Event', id: number, title?: Types.Maybe<string> }> };

export type UserConProfileQueryVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type UserConProfileQueryData = { __typename: 'Query', convention?: Types.Maybe<{ __typename: 'Convention', id: number, starts_at?: Types.Maybe<any>, ends_at?: Types.Maybe<any>, timezone_name?: Types.Maybe<string>, timezone_mode: Types.TimezoneMode, user_con_profile_form: { __typename: 'Form', id: number, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: number, title?: Types.Maybe<string>, position: number, form_items: Array<{ __typename: 'FormItem', id: number, position: number, identifier?: Types.Maybe<string>, item_type: string, rendered_properties?: Types.Maybe<any>, default_value?: Types.Maybe<any>, visibility: Types.FormItemRole, writeability: Types.FormItemRole }> }> } }>, userConProfile: { __typename: 'UserConProfile', id: number, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, name: string, form_response_attrs_json?: Types.Maybe<any>, gravatar_enabled: boolean, gravatar_url: string } };

export type UserConProfileAdminQueryVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type UserConProfileAdminQueryData = { __typename: 'Query', myProfile?: Types.Maybe<{ __typename: 'UserConProfile', id: number, ability?: Types.Maybe<{ __typename: 'Ability', can_read_signups: boolean, can_update_user_con_profile: boolean, can_delete_user_con_profile: boolean, can_become_user_con_profile: boolean }> }>, convention: { __typename: 'Convention', id: number, name: string, starts_at?: Types.Maybe<any>, ends_at?: Types.Maybe<any>, timezone_name?: Types.Maybe<string>, timezone_mode: Types.TimezoneMode, ticket_name: string, ticket_mode: Types.TicketMode, user_con_profile_form: { __typename: 'Form', id: number, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: number, title?: Types.Maybe<string>, position: number, form_items: Array<{ __typename: 'FormItem', id: number, admin_description?: Types.Maybe<string>, position: number, identifier?: Types.Maybe<string>, item_type: string, rendered_properties?: Types.Maybe<any>, default_value?: Types.Maybe<any>, visibility: Types.FormItemRole, writeability: Types.FormItemRole }> }> }, ticket_types: Array<{ __typename: 'TicketType', id: number, description?: Types.Maybe<string>, name: string, maximum_event_provided_tickets: number, providing_products: Array<{ __typename: 'Product', id: number, name: string, description?: Types.Maybe<string>, description_html?: Types.Maybe<string>, image_url?: Types.Maybe<string>, available: boolean, payment_options: Array<string>, pricing_structure: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: Types.Maybe<{ __typename: 'Money', fractional: number, currency_code: string }>, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: Types.Maybe<any>, finish?: Types.Maybe<any>, value: { __typename: 'Money', fractional: number, currency_code: string } }> } }, product_variants: Array<{ __typename: 'ProductVariant', id: number, name: string, description?: Types.Maybe<string>, image_url?: Types.Maybe<string>, position?: Types.Maybe<number>, override_pricing_structure?: Types.Maybe<{ __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: Types.Maybe<{ __typename: 'Money', fractional: number, currency_code: string }>, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: Types.Maybe<any>, finish?: Types.Maybe<any>, value: { __typename: 'Money', fractional: number, currency_code: string } }> } }> }>, provides_ticket_type?: Types.Maybe<{ __typename: 'TicketType', id: number, description?: Types.Maybe<string> }> }> }> }, userConProfile: { __typename: 'UserConProfile', id: number, email?: Types.Maybe<string>, user_id: number, name: string, name_without_nickname: string, form_response_attrs_json?: Types.Maybe<any>, gravatar_enabled: boolean, gravatar_url: string, ticket?: Types.Maybe<{ __typename: 'Ticket', id: number, created_at: any, updated_at: any, order_entry?: Types.Maybe<{ __typename: 'OrderEntry', id: number, order: { __typename: 'Order', id: number, status: Types.OrderStatus, submitted_at?: Types.Maybe<any>, charge_id?: Types.Maybe<string>, payment_note?: Types.Maybe<string>, user_con_profile: { __typename: 'UserConProfile', id: number, name_without_nickname: string }, total_price: { __typename: 'Money', fractional: number, currency_code: string }, payment_amount?: Types.Maybe<{ __typename: 'Money', fractional: number, currency_code: string }>, coupon_applications: Array<{ __typename: 'CouponApplication', id: number, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', id: number, code: string, percent_discount?: Types.Maybe<any>, fixed_amount?: Types.Maybe<{ __typename: 'Money', fractional: number, currency_code: string }>, provides_product?: Types.Maybe<{ __typename: 'Product', id: number, name: string }> } }>, order_entries: Array<{ __typename: 'OrderEntry', id: number, quantity: number, describe_products: string, product: { __typename: 'Product', id: number, name: string }, product_variant?: Types.Maybe<{ __typename: 'ProductVariant', id: number, name: string }>, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }> }, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }>, ticket_type: { __typename: 'TicketType', id: number, description?: Types.Maybe<string>, name: string }, provided_by_event?: Types.Maybe<{ __typename: 'Event', id: number, title?: Types.Maybe<string> }> }> } };

export type UserConProfilesTableUserConProfilesQueryVariables = Types.Exact<{
  page?: Types.Maybe<Types.Scalars['Int']>;
  perPage?: Types.Maybe<Types.Scalars['Int']>;
  filters?: Types.Maybe<Types.UserConProfileFiltersInput>;
  sort?: Types.Maybe<Array<Types.SortInput> | Types.SortInput>;
}>;


export type UserConProfilesTableUserConProfilesQueryData = { __typename: 'Query', convention?: Types.Maybe<{ __typename: 'Convention', id: number, name: string, starts_at?: Types.Maybe<any>, ends_at?: Types.Maybe<any>, timezone_name?: Types.Maybe<string>, timezone_mode: Types.TimezoneMode, ticket_name: string, ticket_mode: Types.TicketMode, ticket_types: Array<{ __typename: 'TicketType', id: number, name: string }>, user_con_profile_form: { __typename: 'Form', id: number, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: number, title?: Types.Maybe<string>, position: number, form_items: Array<{ __typename: 'FormItem', id: number, admin_description?: Types.Maybe<string>, position: number, identifier?: Types.Maybe<string>, item_type: string, rendered_properties?: Types.Maybe<any>, default_value?: Types.Maybe<any>, visibility: Types.FormItemRole, writeability: Types.FormItemRole }> }> }, user_con_profiles_paginated: { __typename: 'UserConProfilesPagination', total_entries: number, total_pages: number, current_page: number, per_page: number, entries: Array<{ __typename: 'UserConProfile', id: number, name_inverted: string, first_name: string, last_name: string, email?: Types.Maybe<string>, site_admin: boolean, form_response_attrs_json?: Types.Maybe<any>, order_summary: string, gravatar_enabled: boolean, gravatar_url: string, user_id: number, team_members: Array<{ __typename: 'TeamMember', id: number }>, ticket?: Types.Maybe<{ __typename: 'Ticket', id: number, updated_at: any, order_entry?: Types.Maybe<{ __typename: 'OrderEntry', id: number, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }>, ticket_type: { __typename: 'TicketType', id: number, name: string } }> }> } }>, currentAbility: { __typename: 'Ability', can_create_user_con_profiles: boolean } };

export type ConvertToEventProvidedTicketQueryVariables = Types.Exact<{
  eventId: Types.Scalars['Int'];
}>;


export type ConvertToEventProvidedTicketQueryData = { __typename: 'Query', convention?: Types.Maybe<{ __typename: 'Convention', id: number, ticket_name: string, ticket_types: Array<{ __typename: 'TicketType', id: number, maximum_event_provided_tickets: number, description?: Types.Maybe<string>, name: string }> }>, event: { __typename: 'Event', id: number, title?: Types.Maybe<string>, event_category: { __typename: 'EventCategory', id: number, can_provide_tickets: boolean }, provided_tickets: Array<{ __typename: 'Ticket', id: number, ticket_type: { __typename: 'TicketType', id: number, name: string } }> } };

export type AddAttendeeUsersQueryVariables = Types.Exact<{
  name?: Types.Maybe<Types.Scalars['String']>;
}>;


export type AddAttendeeUsersQueryData = { __typename: 'Query', users_paginated: { __typename: 'UsersPagination', entries: Array<{ __typename: 'User', id: number, name?: Types.Maybe<string>, email?: Types.Maybe<string>, first_name?: Types.Maybe<string>, last_name?: Types.Maybe<string> }> } };

export type TicketAdminWithoutTicketAbilityQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type TicketAdminWithoutTicketAbilityQueryData = { __typename: 'Query', currentAbility: { __typename: 'Ability', can_create_tickets: boolean } };

export type TicketAdminWithTicketAbilityQueryVariables = Types.Exact<{
  ticketId: Types.Scalars['Int'];
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
    query UserConProfileQuery($id: Int!) {
  convention {
    ...UserConProfileFormData
    id
  }
  userConProfile(id: $id) {
    id
    current_user_form_item_viewer_role
    current_user_form_item_writer_role
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