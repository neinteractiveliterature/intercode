/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CommonFormFieldsFragmentDoc, CommonFormSectionFieldsFragmentDoc, CommonFormItemFieldsFragmentDoc } from '../Models/commonFormFragments.generated';
import { AdminOrderFieldsFragmentDoc } from '../Store/orderFields.generated';
import { AdminProductFieldsFragmentDoc } from '../Store/adminProductFields.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type UserConProfileFormDataFragment = { __typename: 'Convention', starts_at?: string | null | undefined, ends_at?: string | null | undefined, timezone_name?: string | null | undefined, timezone_mode: Types.TimezoneMode, id: string, user_con_profile_form: { __typename: 'Form', title: string, form_type: Types.FormType, id: string, form_sections: Array<{ __typename: 'FormSection', title?: string | null | undefined, position: number, id: string, form_items: Array<{ __typename: 'FormItem', position: number, identifier?: string | null | undefined, item_type: string, rendered_properties: string, default_value?: string | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole, id: string }> }> } };

export type UserConProfileFieldsFragment = { __typename: 'UserConProfile', name: string, form_response_attrs_json?: string | null | undefined, gravatar_enabled: boolean, gravatar_url: string, id: string };

export type UserConProfileAdminTicketFieldsFragment = { __typename: 'Ticket', created_at: string, updated_at: string, id: string, order_entry?: { __typename: 'OrderEntry', id: string, order: { __typename: 'Order', status: Types.OrderStatus, submitted_at?: string | null | undefined, charge_id?: string | null | undefined, payment_note?: string | null | undefined, id: string, user_con_profile: { __typename: 'UserConProfile', name_without_nickname: string, id: string }, total_price: { __typename: 'Money', fractional: number, currency_code: string }, payment_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, coupon_applications: Array<{ __typename: 'CouponApplication', id: string, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', code: string, percent_discount?: string | null | undefined, id: string, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, provides_product?: { __typename: 'Product', name: string, id: string } | null | undefined } }>, order_entries: Array<{ __typename: 'OrderEntry', quantity: number, describe_products: string, id: string, product: { __typename: 'Product', name: string, id: string }, product_variant?: { __typename: 'ProductVariant', name: string, id: string } | null | undefined, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }> }, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } } | null | undefined, ticket_type: { __typename: 'TicketType', description?: string | null | undefined, name: string, id: string }, provided_by_event?: { __typename: 'Event', title?: string | null | undefined, id: string } | null | undefined };

export type UserConProfileQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type UserConProfileQueryData = { __typename: 'Query', convention: { __typename: 'Convention', starts_at?: string | null | undefined, ends_at?: string | null | undefined, timezone_name?: string | null | undefined, timezone_mode: Types.TimezoneMode, id: string, user_con_profile: { __typename: 'UserConProfile', current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, name: string, form_response_attrs_json?: string | null | undefined, gravatar_enabled: boolean, gravatar_url: string, id: string }, user_con_profile_form: { __typename: 'Form', title: string, form_type: Types.FormType, id: string, form_sections: Array<{ __typename: 'FormSection', title?: string | null | undefined, position: number, id: string, form_items: Array<{ __typename: 'FormItem', position: number, identifier?: string | null | undefined, item_type: string, rendered_properties: string, default_value?: string | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole, id: string }> }> } } };

export type UserConProfileAdminQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type UserConProfileAdminQueryData = { __typename: 'Query', convention: { __typename: 'Convention', name: string, starts_at?: string | null | undefined, ends_at?: string | null | undefined, timezone_name?: string | null | undefined, timezone_mode: Types.TimezoneMode, ticket_name: string, ticket_mode: Types.TicketMode, id: string, my_profile?: { __typename: 'UserConProfile', id: string, ability?: { __typename: 'Ability', can_read_signups: boolean, can_update_user_con_profile: boolean, can_delete_user_con_profile: boolean, can_become_user_con_profile: boolean } | null | undefined } | null | undefined, user_con_profile: { __typename: 'UserConProfile', email?: string | null | undefined, user_id: number, name: string, name_without_nickname: string, form_response_attrs_json?: string | null | undefined, gravatar_enabled: boolean, gravatar_url: string, id: string, ticket?: { __typename: 'Ticket', created_at: string, updated_at: string, id: string, order_entry?: { __typename: 'OrderEntry', id: string, order: { __typename: 'Order', status: Types.OrderStatus, submitted_at?: string | null | undefined, charge_id?: string | null | undefined, payment_note?: string | null | undefined, id: string, user_con_profile: { __typename: 'UserConProfile', name_without_nickname: string, id: string }, total_price: { __typename: 'Money', fractional: number, currency_code: string }, payment_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, coupon_applications: Array<{ __typename: 'CouponApplication', id: string, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', code: string, percent_discount?: string | null | undefined, id: string, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, provides_product?: { __typename: 'Product', name: string, id: string } | null | undefined } }>, order_entries: Array<{ __typename: 'OrderEntry', quantity: number, describe_products: string, id: string, product: { __typename: 'Product', name: string, id: string }, product_variant?: { __typename: 'ProductVariant', name: string, id: string } | null | undefined, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }> }, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } } | null | undefined, ticket_type: { __typename: 'TicketType', description?: string | null | undefined, name: string, id: string }, provided_by_event?: { __typename: 'Event', title?: string | null | undefined, id: string } | null | undefined } | null | undefined }, user_con_profile_form: { __typename: 'Form', title: string, form_type: Types.FormType, id: string, form_sections: Array<{ __typename: 'FormSection', title?: string | null | undefined, position: number, id: string, form_items: Array<{ __typename: 'FormItem', admin_description?: string | null | undefined, position: number, identifier?: string | null | undefined, item_type: string, rendered_properties: string, default_value?: string | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole, id: string }> }> }, ticket_types: Array<{ __typename: 'TicketType', description?: string | null | undefined, name: string, maximum_event_provided_tickets: number, id: string, providing_products: Array<{ __typename: 'Product', name: string, description?: string | null | undefined, description_html?: string | null | undefined, image_url?: string | null | undefined, available: boolean, payment_options: Array<string>, id: string, pricing_structure: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: string | null | undefined, finish?: string | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } }> } }, product_variants: Array<{ __typename: 'ProductVariant', name: string, description?: string | null | undefined, image_url?: string | null | undefined, position?: number | null | undefined, id: string, override_pricing_structure?: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: string | null | undefined, finish?: string | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } }> } } | null | undefined }>, provides_ticket_type?: { __typename: 'TicketType', description?: string | null | undefined, id: string } | null | undefined }> }> } };

export type UserConProfilesTableUserConProfilesQueryVariables = Types.Exact<{
  page?: Types.Maybe<Types.Scalars['Int']>;
  perPage?: Types.Maybe<Types.Scalars['Int']>;
  filters?: Types.Maybe<Types.UserConProfileFiltersInput>;
  sort?: Types.Maybe<Array<Types.SortInput> | Types.SortInput>;
}>;


export type UserConProfilesTableUserConProfilesQueryData = { __typename: 'Query', convention: { __typename: 'Convention', name: string, starts_at?: string | null | undefined, ends_at?: string | null | undefined, timezone_name?: string | null | undefined, timezone_mode: Types.TimezoneMode, ticket_name: string, ticket_mode: Types.TicketMode, id: string, ticket_types: Array<{ __typename: 'TicketType', name: string, id: string }>, user_con_profile_form: { __typename: 'Form', title: string, form_type: Types.FormType, id: string, form_sections: Array<{ __typename: 'FormSection', title?: string | null | undefined, position: number, id: string, form_items: Array<{ __typename: 'FormItem', admin_description?: string | null | undefined, position: number, identifier?: string | null | undefined, item_type: string, rendered_properties: string, default_value?: string | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole, id: string }> }> }, user_con_profiles_paginated: { __typename: 'UserConProfilesPagination', total_entries: number, total_pages: number, current_page: number, per_page: number, entries: Array<{ __typename: 'UserConProfile', name_inverted: string, first_name: string, last_name: string, email?: string | null | undefined, site_admin: boolean, form_response_attrs_json?: string | null | undefined, order_summary: string, gravatar_enabled: boolean, gravatar_url: string, user_id: number, id: string, team_members: Array<{ __typename: 'TeamMember', id: string }>, ticket?: { __typename: 'Ticket', updated_at: string, id: string, order_entry?: { __typename: 'OrderEntry', id: string, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } } | null | undefined, ticket_type: { __typename: 'TicketType', name: string, id: string } } | null | undefined }> } }, currentAbility: { __typename: 'Ability', can_create_user_con_profiles: boolean } };

export type ConvertToEventProvidedTicketQueryVariables = Types.Exact<{
  eventId: Types.Scalars['ID'];
}>;


export type ConvertToEventProvidedTicketQueryData = { __typename: 'Query', convention: { __typename: 'Convention', ticket_name: string, id: string, event: { __typename: 'Event', title?: string | null | undefined, id: string, event_category: { __typename: 'EventCategory', can_provide_tickets: boolean, id: string }, provided_tickets: Array<{ __typename: 'Ticket', id: string, ticket_type: { __typename: 'TicketType', name: string, id: string } }> }, ticket_types: Array<{ __typename: 'TicketType', maximum_event_provided_tickets: number, description?: string | null | undefined, name: string, id: string }> } };

export type AddAttendeeUsersQueryVariables = Types.Exact<{
  name?: Types.Maybe<Types.Scalars['String']>;
}>;


export type AddAttendeeUsersQueryData = { __typename: 'Query', users_paginated: { __typename: 'UsersPagination', entries: Array<{ __typename: 'User', name?: string | null | undefined, email?: string | null | undefined, first_name?: string | null | undefined, last_name?: string | null | undefined, id: string }> } };

export type TicketAdminWithoutTicketAbilityQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type TicketAdminWithoutTicketAbilityQueryData = { __typename: 'Query', currentAbility: { __typename: 'Ability', can_create_tickets: boolean } };

export type TicketAdminWithTicketAbilityQueryVariables = Types.Exact<{
  ticketId: Types.Scalars['ID'];
}>;


export type TicketAdminWithTicketAbilityQueryData = { __typename: 'Query', currentAbility: { __typename: 'Ability', can_create_tickets: boolean, can_update_ticket: boolean, can_delete_ticket: boolean } };

export const UserConProfileFormDataFragmentDoc = gql`
    fragment UserConProfileFormData on Convention {
  id: transitionalId
  starts_at
  ends_at
  timezone_name
  timezone_mode
  user_con_profile_form {
    id: transitionalId
    ...CommonFormFields
  }
}
    ${CommonFormFieldsFragmentDoc}`;
export const UserConProfileFieldsFragmentDoc = gql`
    fragment UserConProfileFields on UserConProfile {
  id: transitionalId
  name
  form_response_attrs_json
  gravatar_enabled
  gravatar_url
}
    `;
export const UserConProfileAdminTicketFieldsFragmentDoc = gql`
    fragment UserConProfileAdminTicketFields on Ticket {
  id: transitionalId
  created_at
  updated_at
  order_entry {
    id: transitionalId
    order {
      id: transitionalId
      ...AdminOrderFieldsFragment
    }
    price_per_item {
      fractional
      currency_code
    }
  }
  ticket_type {
    id: transitionalId
    description
    name
  }
  provided_by_event {
    id: transitionalId
    title
  }
}
    ${AdminOrderFieldsFragmentDoc}`;
export const UserConProfileQueryDocument = gql`
    query UserConProfileQuery($id: ID!) {
  convention: conventionByRequestHost {
    ...UserConProfileFormData
    id: transitionalId
    user_con_profile(transitionalId: $id) {
      id: transitionalId
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
    query UserConProfileAdminQuery($id: ID!) {
  convention: conventionByRequestHost {
    id: transitionalId
    name
    starts_at
    ends_at
    timezone_name
    timezone_mode
    ticket_name
    ticket_mode
    my_profile {
      id: transitionalId
      ability {
        can_read_signups
        can_update_user_con_profile(transitionalUserConProfileId: $id)
        can_delete_user_con_profile(transitionalUserConProfileId: $id)
        can_become_user_con_profile(transitionalUserConProfileId: $id)
      }
    }
    user_con_profile(transitionalId: $id) {
      id: transitionalId
      email
      user_id
      name
      name_without_nickname
      form_response_attrs_json
      gravatar_enabled
      gravatar_url
      ticket {
        id: transitionalId
        ...UserConProfileAdminTicketFields
      }
    }
    user_con_profile_form {
      id: transitionalId
      ...CommonFormFields
      form_sections {
        id: transitionalId
        form_items {
          id: transitionalId
          admin_description
        }
      }
    }
    ticket_types {
      id: transitionalId
      description
      name
      maximum_event_provided_tickets
      providing_products {
        id: transitionalId
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
  convention: conventionByRequestHost {
    id: transitionalId
    name
    starts_at
    ends_at
    timezone_name
    timezone_mode
    ticket_name
    ticket_mode
    ticket_types {
      id: transitionalId
      name
    }
    user_con_profile_form {
      id: transitionalId
      ...CommonFormFields
      form_sections {
        id: transitionalId
        form_items {
          id: transitionalId
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
        id: transitionalId
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
          id: transitionalId
        }
        ticket {
          id: transitionalId
          updated_at
          order_entry {
            id: transitionalId
            price_per_item {
              fractional
              currency_code
            }
          }
          ticket_type {
            id: transitionalId
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
    query ConvertToEventProvidedTicketQuery($eventId: ID!) {
  convention: conventionByRequestHost {
    id: transitionalId
    ticket_name
    event(transitionalId: $eventId) {
      id: transitionalId
      title
      event_category {
        id: transitionalId
        can_provide_tickets
      }
      provided_tickets {
        id: transitionalId
        ticket_type {
          id: transitionalId
          name
        }
      }
    }
    ticket_types {
      id: transitionalId
      maximum_event_provided_tickets(transitionalEventId: $eventId)
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
      id: transitionalId
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
    query TicketAdminWithTicketAbilityQuery($ticketId: ID!) {
  currentAbility {
    can_create_tickets
    can_update_ticket(transitionalTicketId: $ticketId)
    can_delete_ticket(transitionalTicketId: $ticketId)
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