/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CommonFormFieldsFragmentDoc } from '../Models/commonFormFragments.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type EventProposalFieldsFragment = { __typename: 'EventProposal', id: string, title?: string | null, status: string, form_response_attrs_json?: string | null, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, images: Array<{ __typename: 'ActiveStorageAttachment', id: string, filename: string, url: string, content_type: string, byte_size: number }>, event_category: { __typename: 'EventCategory', id: string, name: string, event_proposal_form?: { __typename: 'Form', id: string, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: string, title?: string | null, position: number, form_items: Array<{ __typename: 'FormItem', id: string, admin_description?: string | null, position: number, identifier?: string | null, item_type: string, rendered_properties: string, default_value?: string | null, visibility: Types.FormItemRole, writeability: Types.FormItemRole, expose_in?: Array<Types.FormItemExposeIn> | null }> }> } | null }, event?: { __typename: 'Event', id: string } | null };

export type EventProposalFormDataFragment = { __typename: 'Convention', id: string, starts_at?: string | null, ends_at?: string | null, timezone_name?: string | null, timezone_mode: Types.TimezoneMode, event_mailing_list_domain?: string | null };

export type EventProposalQueryVariables = Types.Exact<{
  eventProposalId: Types.Scalars['ID']['input'];
}>;


export type EventProposalQueryData = { __typename: 'Query', currentAbility: { __typename: 'Ability', can_delete_event_proposal: boolean }, convention: { __typename: 'Convention', id: string, starts_at?: string | null, ends_at?: string | null, timezone_name?: string | null, timezone_mode: Types.TimezoneMode, event_mailing_list_domain?: string | null, event_proposal: { __typename: 'EventProposal', id: string, title?: string | null, status: string, form_response_attrs_json?: string | null, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, images: Array<{ __typename: 'ActiveStorageAttachment', id: string, filename: string, url: string, content_type: string, byte_size: number }>, event_category: { __typename: 'EventCategory', id: string, name: string, event_proposal_form?: { __typename: 'Form', id: string, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: string, title?: string | null, position: number, form_items: Array<{ __typename: 'FormItem', id: string, admin_description?: string | null, position: number, identifier?: string | null, item_type: string, rendered_properties: string, default_value?: string | null, visibility: Types.FormItemRole, writeability: Types.FormItemRole, expose_in?: Array<Types.FormItemExposeIn> | null }> }> } | null }, event?: { __typename: 'Event', id: string } | null } } };

export type EventProposalQueryWithOwnerQueryVariables = Types.Exact<{
  eventProposalId: Types.Scalars['ID']['input'];
}>;


export type EventProposalQueryWithOwnerQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, starts_at?: string | null, ends_at?: string | null, timezone_name?: string | null, timezone_mode: Types.TimezoneMode, event_mailing_list_domain?: string | null, event_proposal: { __typename: 'EventProposal', id: string, form_response_attrs_json_with_rendered_markdown?: string | null, title?: string | null, status: string, form_response_attrs_json?: string | null, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, owner: { __typename: 'UserConProfile', id: string, name: string, email?: string | null, gravatar_enabled: boolean, gravatar_url: string }, images: Array<{ __typename: 'ActiveStorageAttachment', id: string, filename: string, url: string, content_type: string, byte_size: number }>, event_category: { __typename: 'EventCategory', id: string, name: string, event_proposal_form?: { __typename: 'Form', id: string, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: string, title?: string | null, position: number, form_items: Array<{ __typename: 'FormItem', id: string, admin_description?: string | null, position: number, identifier?: string | null, item_type: string, rendered_properties: string, default_value?: string | null, visibility: Types.FormItemRole, writeability: Types.FormItemRole, expose_in?: Array<Types.FormItemExposeIn> | null }> }> } | null }, event?: { __typename: 'Event', id: string } | null } }, currentAbility: { __typename: 'Ability', can_update_event_proposal: boolean, can_read_admin_notes_on_event_proposal: boolean } };

export type EventProposalAdminNotesQueryVariables = Types.Exact<{
  eventProposalId: Types.Scalars['ID']['input'];
}>;


export type EventProposalAdminNotesQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, event_proposal: { __typename: 'EventProposal', id: string, admin_notes?: string | null } } };

export type ProposeEventButtonQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ProposeEventButtonQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, my_profile?: { __typename: 'UserConProfile', id: string, user?: { __typename: 'User', id: string, event_proposals: Array<{ __typename: 'EventProposal', id: string, title?: string | null, status: string, created_at: string, event_category: { __typename: 'EventCategory', id: string, name: string }, convention: { __typename: 'Convention', id: string, name: string } }> } | null } | null, departments: Array<{ __typename: 'Department', id: string, name: string, proposal_description?: string | null, event_categories: Array<{ __typename: 'EventCategory', id: string }> }>, event_categories: Array<{ __typename: 'EventCategory', id: string, name: string, proposable: boolean, proposal_description?: string | null, department?: { __typename: 'Department', id: string } | null }> } };

export type EventProposalsAdminQueryVariables = Types.Exact<{
  page?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  perPage?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  filters?: Types.InputMaybe<Types.EventProposalFiltersInput>;
  sort?: Types.InputMaybe<Array<Types.SortInput> | Types.SortInput>;
}>;


export type EventProposalsAdminQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, timezone_name?: string | null, event_categories: Array<{ __typename: 'EventCategory', id: string, name: string, default_color?: string | null }>, event_proposals_paginated: { __typename: 'EventProposalsPagination', total_entries: number, total_pages: number, current_page: number, per_page: number, entries: Array<{ __typename: 'EventProposal', id: string, title?: string | null, length_seconds?: number | null, status: string, submitted_at?: string | null, updated_at: string, event_category: { __typename: 'EventCategory', id: string, name: string, default_color?: string | null }, registration_policy?: { __typename: 'RegistrationPolicy', minimum_slots?: number | null, total_slots?: number | null, slots_limited?: boolean | null } | null, owner: { __typename: 'UserConProfile', id: string, name_inverted: string, gravatar_enabled: boolean, gravatar_url: string } }> } } };

export type EventProposalHistoryQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type EventProposalHistoryQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, starts_at?: string | null, ends_at?: string | null, timezone_name?: string | null, timezone_mode: Types.TimezoneMode, event_proposal: { __typename: 'EventProposal', id: string, title?: string | null, owner: { __typename: 'UserConProfile', id: string }, event_category: { __typename: 'EventCategory', id: string, event_proposal_form?: { __typename: 'Form', id: string, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: string, title?: string | null, position: number, form_items: Array<{ __typename: 'FormItem', id: string, admin_description?: string | null, position: number, identifier?: string | null, item_type: string, rendered_properties: string, default_value?: string | null, visibility: Types.FormItemRole, writeability: Types.FormItemRole, expose_in?: Array<Types.FormItemExposeIn> | null }> }> } | null }, form_response_changes: Array<{ __typename: 'FormResponseChange', field_identifier: string, previous_value?: string | null, new_value?: string | null, created_at: string, updated_at: string, user_con_profile: { __typename: 'UserConProfile', id: string, name_without_nickname: string } }> } } };

export const EventProposalFieldsFragmentDoc = gql`
    fragment EventProposalFields on EventProposal {
  id
  title
  status
  form_response_attrs_json
  current_user_form_item_viewer_role
  current_user_form_item_writer_role
  images {
    id
    filename
    url
    content_type
    byte_size
  }
  event_category {
    id
    name
    event_proposal_form {
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
  }
  event {
    id
  }
}
    ${CommonFormFieldsFragmentDoc}`;
export const EventProposalFormDataFragmentDoc = gql`
    fragment EventProposalFormData on Convention {
  id
  starts_at
  ends_at
  timezone_name
  timezone_mode
  event_mailing_list_domain
}
    `;
export const EventProposalQueryDocument = gql`
    query EventProposalQuery($eventProposalId: ID!) {
  currentAbility {
    can_delete_event_proposal(eventProposalId: $eventProposalId)
  }
  convention: conventionByRequestHost {
    id
    ...EventProposalFormData
    event_proposal(id: $eventProposalId) {
      id
      ...EventProposalFields
    }
  }
}
    ${EventProposalFormDataFragmentDoc}
${EventProposalFieldsFragmentDoc}`;

/**
 * __useEventProposalQuery__
 *
 * To run a query within a React component, call `useEventProposalQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventProposalQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventProposalQuery({
 *   variables: {
 *      eventProposalId: // value for 'eventProposalId'
 *   },
 * });
 */
export function useEventProposalQuery(baseOptions: Apollo.QueryHookOptions<EventProposalQueryData, EventProposalQueryVariables> & ({ variables: EventProposalQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventProposalQueryData, EventProposalQueryVariables>(EventProposalQueryDocument, options);
      }
export function useEventProposalQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventProposalQueryData, EventProposalQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventProposalQueryData, EventProposalQueryVariables>(EventProposalQueryDocument, options);
        }
export function useEventProposalQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<EventProposalQueryData, EventProposalQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<EventProposalQueryData, EventProposalQueryVariables>(EventProposalQueryDocument, options);
        }
export type EventProposalQueryHookResult = ReturnType<typeof useEventProposalQuery>;
export type EventProposalQueryLazyQueryHookResult = ReturnType<typeof useEventProposalQueryLazyQuery>;
export type EventProposalQuerySuspenseQueryHookResult = ReturnType<typeof useEventProposalQuerySuspenseQuery>;
export type EventProposalQueryQueryResult = Apollo.QueryResult<EventProposalQueryData, EventProposalQueryVariables>;
export const EventProposalQueryWithOwnerDocument = gql`
    query EventProposalQueryWithOwner($eventProposalId: ID!) {
  convention: conventionByRequestHost {
    id
    ...EventProposalFormData
    event_proposal(id: $eventProposalId) {
      id
      form_response_attrs_json_with_rendered_markdown
      ...EventProposalFields
      owner {
        id
        name
        email
        gravatar_enabled
        gravatar_url
      }
    }
  }
  currentAbility {
    can_update_event_proposal(eventProposalId: $eventProposalId)
    can_read_admin_notes_on_event_proposal(eventProposalId: $eventProposalId)
  }
}
    ${EventProposalFormDataFragmentDoc}
${EventProposalFieldsFragmentDoc}`;

/**
 * __useEventProposalQueryWithOwner__
 *
 * To run a query within a React component, call `useEventProposalQueryWithOwner` and pass it any options that fit your needs.
 * When your component renders, `useEventProposalQueryWithOwner` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventProposalQueryWithOwner({
 *   variables: {
 *      eventProposalId: // value for 'eventProposalId'
 *   },
 * });
 */
export function useEventProposalQueryWithOwner(baseOptions: Apollo.QueryHookOptions<EventProposalQueryWithOwnerQueryData, EventProposalQueryWithOwnerQueryVariables> & ({ variables: EventProposalQueryWithOwnerQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventProposalQueryWithOwnerQueryData, EventProposalQueryWithOwnerQueryVariables>(EventProposalQueryWithOwnerDocument, options);
      }
export function useEventProposalQueryWithOwnerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventProposalQueryWithOwnerQueryData, EventProposalQueryWithOwnerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventProposalQueryWithOwnerQueryData, EventProposalQueryWithOwnerQueryVariables>(EventProposalQueryWithOwnerDocument, options);
        }
export function useEventProposalQueryWithOwnerSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<EventProposalQueryWithOwnerQueryData, EventProposalQueryWithOwnerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<EventProposalQueryWithOwnerQueryData, EventProposalQueryWithOwnerQueryVariables>(EventProposalQueryWithOwnerDocument, options);
        }
export type EventProposalQueryWithOwnerHookResult = ReturnType<typeof useEventProposalQueryWithOwner>;
export type EventProposalQueryWithOwnerLazyQueryHookResult = ReturnType<typeof useEventProposalQueryWithOwnerLazyQuery>;
export type EventProposalQueryWithOwnerSuspenseQueryHookResult = ReturnType<typeof useEventProposalQueryWithOwnerSuspenseQuery>;
export type EventProposalQueryWithOwnerQueryResult = Apollo.QueryResult<EventProposalQueryWithOwnerQueryData, EventProposalQueryWithOwnerQueryVariables>;
export const EventProposalAdminNotesQueryDocument = gql`
    query EventProposalAdminNotesQuery($eventProposalId: ID!) {
  convention: conventionByRequestHost {
    id
    event_proposal(id: $eventProposalId) {
      id
      admin_notes
    }
  }
}
    `;

/**
 * __useEventProposalAdminNotesQuery__
 *
 * To run a query within a React component, call `useEventProposalAdminNotesQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventProposalAdminNotesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventProposalAdminNotesQuery({
 *   variables: {
 *      eventProposalId: // value for 'eventProposalId'
 *   },
 * });
 */
export function useEventProposalAdminNotesQuery(baseOptions: Apollo.QueryHookOptions<EventProposalAdminNotesQueryData, EventProposalAdminNotesQueryVariables> & ({ variables: EventProposalAdminNotesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventProposalAdminNotesQueryData, EventProposalAdminNotesQueryVariables>(EventProposalAdminNotesQueryDocument, options);
      }
export function useEventProposalAdminNotesQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventProposalAdminNotesQueryData, EventProposalAdminNotesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventProposalAdminNotesQueryData, EventProposalAdminNotesQueryVariables>(EventProposalAdminNotesQueryDocument, options);
        }
export function useEventProposalAdminNotesQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<EventProposalAdminNotesQueryData, EventProposalAdminNotesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<EventProposalAdminNotesQueryData, EventProposalAdminNotesQueryVariables>(EventProposalAdminNotesQueryDocument, options);
        }
export type EventProposalAdminNotesQueryHookResult = ReturnType<typeof useEventProposalAdminNotesQuery>;
export type EventProposalAdminNotesQueryLazyQueryHookResult = ReturnType<typeof useEventProposalAdminNotesQueryLazyQuery>;
export type EventProposalAdminNotesQuerySuspenseQueryHookResult = ReturnType<typeof useEventProposalAdminNotesQuerySuspenseQuery>;
export type EventProposalAdminNotesQueryQueryResult = Apollo.QueryResult<EventProposalAdminNotesQueryData, EventProposalAdminNotesQueryVariables>;
export const ProposeEventButtonQueryDocument = gql`
    query ProposeEventButtonQuery {
  convention: conventionByRequestHost {
    id
    my_profile {
      id
      user {
        id
        event_proposals {
          id
          title
          status
          created_at
          event_category {
            id
            name
          }
          convention {
            id
            name
          }
        }
      }
    }
    departments {
      id
      name
      proposal_description
      event_categories {
        id
      }
    }
    event_categories {
      id
      name
      proposable
      proposal_description
      department {
        id
      }
    }
  }
}
    `;

/**
 * __useProposeEventButtonQuery__
 *
 * To run a query within a React component, call `useProposeEventButtonQuery` and pass it any options that fit your needs.
 * When your component renders, `useProposeEventButtonQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProposeEventButtonQuery({
 *   variables: {
 *   },
 * });
 */
export function useProposeEventButtonQuery(baseOptions?: Apollo.QueryHookOptions<ProposeEventButtonQueryData, ProposeEventButtonQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProposeEventButtonQueryData, ProposeEventButtonQueryVariables>(ProposeEventButtonQueryDocument, options);
      }
export function useProposeEventButtonQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProposeEventButtonQueryData, ProposeEventButtonQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProposeEventButtonQueryData, ProposeEventButtonQueryVariables>(ProposeEventButtonQueryDocument, options);
        }
export function useProposeEventButtonQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ProposeEventButtonQueryData, ProposeEventButtonQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ProposeEventButtonQueryData, ProposeEventButtonQueryVariables>(ProposeEventButtonQueryDocument, options);
        }
export type ProposeEventButtonQueryHookResult = ReturnType<typeof useProposeEventButtonQuery>;
export type ProposeEventButtonQueryLazyQueryHookResult = ReturnType<typeof useProposeEventButtonQueryLazyQuery>;
export type ProposeEventButtonQuerySuspenseQueryHookResult = ReturnType<typeof useProposeEventButtonQuerySuspenseQuery>;
export type ProposeEventButtonQueryQueryResult = Apollo.QueryResult<ProposeEventButtonQueryData, ProposeEventButtonQueryVariables>;
export const EventProposalsAdminQueryDocument = gql`
    query EventProposalsAdminQuery($page: Int, $perPage: Int, $filters: EventProposalFiltersInput, $sort: [SortInput!]) {
  convention: conventionByRequestHost {
    id
    timezone_name
    event_categories(current_ability_can_read_event_proposals: true) {
      id
      name
      default_color
    }
    event_proposals_paginated(
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
        title
        length_seconds
        status
        submitted_at
        updated_at
        event_category {
          id
          name
          default_color
        }
        registration_policy {
          minimum_slots
          total_slots
          slots_limited
        }
        owner {
          id
          name_inverted
          gravatar_enabled
          gravatar_url
        }
      }
    }
  }
}
    `;

/**
 * __useEventProposalsAdminQuery__
 *
 * To run a query within a React component, call `useEventProposalsAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventProposalsAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventProposalsAdminQuery({
 *   variables: {
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *      filters: // value for 'filters'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useEventProposalsAdminQuery(baseOptions?: Apollo.QueryHookOptions<EventProposalsAdminQueryData, EventProposalsAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventProposalsAdminQueryData, EventProposalsAdminQueryVariables>(EventProposalsAdminQueryDocument, options);
      }
export function useEventProposalsAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventProposalsAdminQueryData, EventProposalsAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventProposalsAdminQueryData, EventProposalsAdminQueryVariables>(EventProposalsAdminQueryDocument, options);
        }
export function useEventProposalsAdminQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<EventProposalsAdminQueryData, EventProposalsAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<EventProposalsAdminQueryData, EventProposalsAdminQueryVariables>(EventProposalsAdminQueryDocument, options);
        }
export type EventProposalsAdminQueryHookResult = ReturnType<typeof useEventProposalsAdminQuery>;
export type EventProposalsAdminQueryLazyQueryHookResult = ReturnType<typeof useEventProposalsAdminQueryLazyQuery>;
export type EventProposalsAdminQuerySuspenseQueryHookResult = ReturnType<typeof useEventProposalsAdminQuerySuspenseQuery>;
export type EventProposalsAdminQueryQueryResult = Apollo.QueryResult<EventProposalsAdminQueryData, EventProposalsAdminQueryVariables>;
export const EventProposalHistoryQueryDocument = gql`
    query EventProposalHistoryQuery($id: ID!) {
  convention: conventionByRequestHost {
    id
    starts_at
    ends_at
    timezone_name
    timezone_mode
    event_proposal(id: $id) {
      id
      title
      owner {
        id
      }
      event_category {
        id
        event_proposal_form {
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
      }
      form_response_changes {
        user_con_profile {
          id
          name_without_nickname
        }
        field_identifier
        previous_value
        new_value
        created_at
        updated_at
      }
    }
  }
}
    ${CommonFormFieldsFragmentDoc}`;

/**
 * __useEventProposalHistoryQuery__
 *
 * To run a query within a React component, call `useEventProposalHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventProposalHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventProposalHistoryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEventProposalHistoryQuery(baseOptions: Apollo.QueryHookOptions<EventProposalHistoryQueryData, EventProposalHistoryQueryVariables> & ({ variables: EventProposalHistoryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventProposalHistoryQueryData, EventProposalHistoryQueryVariables>(EventProposalHistoryQueryDocument, options);
      }
export function useEventProposalHistoryQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventProposalHistoryQueryData, EventProposalHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventProposalHistoryQueryData, EventProposalHistoryQueryVariables>(EventProposalHistoryQueryDocument, options);
        }
export function useEventProposalHistoryQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<EventProposalHistoryQueryData, EventProposalHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<EventProposalHistoryQueryData, EventProposalHistoryQueryVariables>(EventProposalHistoryQueryDocument, options);
        }
export type EventProposalHistoryQueryHookResult = ReturnType<typeof useEventProposalHistoryQuery>;
export type EventProposalHistoryQueryLazyQueryHookResult = ReturnType<typeof useEventProposalHistoryQueryLazyQuery>;
export type EventProposalHistoryQuerySuspenseQueryHookResult = ReturnType<typeof useEventProposalHistoryQuerySuspenseQuery>;
export type EventProposalHistoryQueryQueryResult = Apollo.QueryResult<EventProposalHistoryQueryData, EventProposalHistoryQueryVariables>;