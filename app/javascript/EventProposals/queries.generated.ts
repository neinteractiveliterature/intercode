/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CommonFormFieldsFragmentDoc, CommonFormSectionFieldsFragmentDoc, CommonFormItemFieldsFragmentDoc } from '../Models/commonFormFragments.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type EventProposalFieldsFragment = { __typename: 'EventProposal', title?: string | null | undefined, status: string, form_response_attrs_json?: any | null | undefined, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, id: string, event_category: { __typename: 'EventCategory', name: string, id: string, event_proposal_form?: { __typename: 'Form', title: string, form_type: Types.FormType, id: string, form_sections: Array<{ __typename: 'FormSection', title?: string | null | undefined, position: number, id: string, form_items: Array<{ __typename: 'FormItem', admin_description?: string | null | undefined, position: number, identifier?: string | null | undefined, item_type: string, rendered_properties?: any | null | undefined, default_value?: any | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole, id: string }> }> } | null | undefined }, event?: { __typename: 'Event', id: string } | null | undefined };

export type EventProposalFormDataFragment = { __typename: 'Convention', starts_at?: any | null | undefined, ends_at?: any | null | undefined, timezone_name?: string | null | undefined, timezone_mode: Types.TimezoneMode, event_mailing_list_domain?: string | null | undefined, id: string };

export type EventProposalQueryVariables = Types.Exact<{
  eventProposalId: Types.Scalars['Int'];
}>;


export type EventProposalQueryData = { __typename: 'Query', currentAbility: { __typename: 'Ability', can_delete_event_proposal: boolean }, convention: { __typename: 'Convention', starts_at?: any | null | undefined, ends_at?: any | null | undefined, timezone_name?: string | null | undefined, timezone_mode: Types.TimezoneMode, event_mailing_list_domain?: string | null | undefined, id: string, event_proposal: { __typename: 'EventProposal', title?: string | null | undefined, status: string, form_response_attrs_json?: any | null | undefined, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, id: string, event_category: { __typename: 'EventCategory', name: string, id: string, event_proposal_form?: { __typename: 'Form', title: string, form_type: Types.FormType, id: string, form_sections: Array<{ __typename: 'FormSection', title?: string | null | undefined, position: number, id: string, form_items: Array<{ __typename: 'FormItem', admin_description?: string | null | undefined, position: number, identifier?: string | null | undefined, item_type: string, rendered_properties?: any | null | undefined, default_value?: any | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole, id: string }> }> } | null | undefined }, event?: { __typename: 'Event', id: string } | null | undefined } } };

export type EventProposalQueryWithOwnerQueryVariables = Types.Exact<{
  eventProposalId: Types.Scalars['Int'];
}>;


export type EventProposalQueryWithOwnerQueryData = { __typename: 'Query', convention: { __typename: 'Convention', starts_at?: any | null | undefined, ends_at?: any | null | undefined, timezone_name?: string | null | undefined, timezone_mode: Types.TimezoneMode, event_mailing_list_domain?: string | null | undefined, id: string, event_proposal: { __typename: 'EventProposal', title?: string | null | undefined, status: string, form_response_attrs_json?: any | null | undefined, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, id: string, owner: { __typename: 'UserConProfile', name: string, email?: string | null | undefined, gravatar_enabled: boolean, gravatar_url: string, id: string }, event_category: { __typename: 'EventCategory', name: string, id: string, event_proposal_form?: { __typename: 'Form', title: string, form_type: Types.FormType, id: string, form_sections: Array<{ __typename: 'FormSection', title?: string | null | undefined, position: number, id: string, form_items: Array<{ __typename: 'FormItem', admin_description?: string | null | undefined, position: number, identifier?: string | null | undefined, item_type: string, rendered_properties?: any | null | undefined, default_value?: any | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole, id: string }> }> } | null | undefined }, event?: { __typename: 'Event', id: string } | null | undefined } }, currentAbility: { __typename: 'Ability', can_update_event_proposal: boolean, can_read_admin_notes_on_event_proposal: boolean } };

export type EventProposalAdminNotesQueryVariables = Types.Exact<{
  eventProposalId: Types.Scalars['Int'];
}>;


export type EventProposalAdminNotesQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, event_proposal: { __typename: 'EventProposal', admin_notes?: string | null | undefined, id: string } } };

export type ProposeEventButtonQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ProposeEventButtonQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, my_profile?: { __typename: 'UserConProfile', id: string, user?: { __typename: 'User', id: string, event_proposals: Array<{ __typename: 'EventProposal', title?: string | null | undefined, status: string, created_at: any, id: string, event_category: { __typename: 'EventCategory', name: string, id: string }, convention: { __typename: 'Convention', name: string, id: string } }> } | null | undefined } | null | undefined, departments: Array<{ __typename: 'Department', name: string, proposal_description?: string | null | undefined, id: string, event_categories: Array<{ __typename: 'EventCategory', id: string }> }>, event_categories: Array<{ __typename: 'EventCategory', name: string, proposable: boolean, proposal_description?: string | null | undefined, id: string, department?: { __typename: 'Department', id: string } | null | undefined }> } };

export type EventProposalsAdminQueryVariables = Types.Exact<{
  page?: Types.Maybe<Types.Scalars['Int']>;
  perPage?: Types.Maybe<Types.Scalars['Int']>;
  filters?: Types.Maybe<Types.EventProposalFiltersInput>;
  sort?: Types.Maybe<Array<Types.SortInput> | Types.SortInput>;
}>;


export type EventProposalsAdminQueryData = { __typename: 'Query', convention: { __typename: 'Convention', timezone_name?: string | null | undefined, id: string, event_categories: Array<{ __typename: 'EventCategory', name: string, default_color?: string | null | undefined, id: string }>, event_proposals_paginated: { __typename: 'EventProposalsPagination', total_entries: number, total_pages: number, current_page: number, per_page: number, entries: Array<{ __typename: 'EventProposal', title?: string | null | undefined, length_seconds?: number | null | undefined, status: string, submitted_at: any, updated_at: any, id: string, event_category: { __typename: 'EventCategory', name: string, default_color?: string | null | undefined, id: string }, registration_policy?: { __typename: 'RegistrationPolicy', minimum_slots?: number | null | undefined, total_slots?: number | null | undefined, slots_limited?: boolean | null | undefined } | null | undefined, owner: { __typename: 'UserConProfile', name_inverted: string, gravatar_enabled: boolean, gravatar_url: string, id: string } }> } } };

export type EventProposalHistoryQueryVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type EventProposalHistoryQueryData = { __typename: 'Query', convention: { __typename: 'Convention', starts_at?: any | null | undefined, ends_at?: any | null | undefined, timezone_name?: string | null | undefined, timezone_mode: Types.TimezoneMode, id: string, event_proposal: { __typename: 'EventProposal', title?: string | null | undefined, id: string, owner: { __typename: 'UserConProfile', id: string }, event_category: { __typename: 'EventCategory', id: string, event_proposal_form?: { __typename: 'Form', title: string, form_type: Types.FormType, id: string, form_sections: Array<{ __typename: 'FormSection', title?: string | null | undefined, position: number, id: string, form_items: Array<{ __typename: 'FormItem', admin_description?: string | null | undefined, position: number, identifier?: string | null | undefined, item_type: string, rendered_properties?: any | null | undefined, default_value?: any | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole, id: string }> }> } | null | undefined }, form_response_changes: Array<{ __typename: 'FormResponseChange', field_identifier: string, previous_value?: any | null | undefined, new_value?: any | null | undefined, created_at: any, updated_at: any, user_con_profile: { __typename: 'UserConProfile', name_without_nickname: string, id: string } }> } } };

export const EventProposalFieldsFragmentDoc = gql`
    fragment EventProposalFields on EventProposal {
  id: transitionalId
  title
  status
  form_response_attrs_json
  current_user_form_item_viewer_role
  current_user_form_item_writer_role
  event_category {
    id: transitionalId
    name
    event_proposal_form {
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
  }
  event {
    id: transitionalId
  }
}
    ${CommonFormFieldsFragmentDoc}`;
export const EventProposalFormDataFragmentDoc = gql`
    fragment EventProposalFormData on Convention {
  id: transitionalId
  starts_at
  ends_at
  timezone_name
  timezone_mode
  event_mailing_list_domain
}
    `;
export const EventProposalQueryDocument = gql`
    query EventProposalQuery($eventProposalId: Int!) {
  currentAbility {
    can_delete_event_proposal(event_proposal_id: $eventProposalId)
  }
  convention: conventionByRequestHost {
    id: transitionalId
    ...EventProposalFormData
    event_proposal(id: $eventProposalId) {
      id: transitionalId
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
export function useEventProposalQuery(baseOptions: Apollo.QueryHookOptions<EventProposalQueryData, EventProposalQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventProposalQueryData, EventProposalQueryVariables>(EventProposalQueryDocument, options);
      }
export function useEventProposalQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventProposalQueryData, EventProposalQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventProposalQueryData, EventProposalQueryVariables>(EventProposalQueryDocument, options);
        }
export type EventProposalQueryHookResult = ReturnType<typeof useEventProposalQuery>;
export type EventProposalQueryLazyQueryHookResult = ReturnType<typeof useEventProposalQueryLazyQuery>;
export type EventProposalQueryQueryResult = Apollo.QueryResult<EventProposalQueryData, EventProposalQueryVariables>;
export const EventProposalQueryWithOwnerDocument = gql`
    query EventProposalQueryWithOwner($eventProposalId: Int!) {
  convention: conventionByRequestHost {
    id: transitionalId
    ...EventProposalFormData
    event_proposal(id: $eventProposalId) {
      id: transitionalId
      ...EventProposalFields
      owner {
        id: transitionalId
        name
        email
        gravatar_enabled
        gravatar_url
      }
    }
  }
  currentAbility {
    can_update_event_proposal(event_proposal_id: $eventProposalId)
    can_read_admin_notes_on_event_proposal(event_proposal_id: $eventProposalId)
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
export function useEventProposalQueryWithOwner(baseOptions: Apollo.QueryHookOptions<EventProposalQueryWithOwnerQueryData, EventProposalQueryWithOwnerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventProposalQueryWithOwnerQueryData, EventProposalQueryWithOwnerQueryVariables>(EventProposalQueryWithOwnerDocument, options);
      }
export function useEventProposalQueryWithOwnerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventProposalQueryWithOwnerQueryData, EventProposalQueryWithOwnerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventProposalQueryWithOwnerQueryData, EventProposalQueryWithOwnerQueryVariables>(EventProposalQueryWithOwnerDocument, options);
        }
export type EventProposalQueryWithOwnerHookResult = ReturnType<typeof useEventProposalQueryWithOwner>;
export type EventProposalQueryWithOwnerLazyQueryHookResult = ReturnType<typeof useEventProposalQueryWithOwnerLazyQuery>;
export type EventProposalQueryWithOwnerQueryResult = Apollo.QueryResult<EventProposalQueryWithOwnerQueryData, EventProposalQueryWithOwnerQueryVariables>;
export const EventProposalAdminNotesQueryDocument = gql`
    query EventProposalAdminNotesQuery($eventProposalId: Int!) {
  convention: conventionByRequestHost {
    id: transitionalId
    event_proposal(id: $eventProposalId) {
      id: transitionalId
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
export function useEventProposalAdminNotesQuery(baseOptions: Apollo.QueryHookOptions<EventProposalAdminNotesQueryData, EventProposalAdminNotesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventProposalAdminNotesQueryData, EventProposalAdminNotesQueryVariables>(EventProposalAdminNotesQueryDocument, options);
      }
export function useEventProposalAdminNotesQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventProposalAdminNotesQueryData, EventProposalAdminNotesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventProposalAdminNotesQueryData, EventProposalAdminNotesQueryVariables>(EventProposalAdminNotesQueryDocument, options);
        }
export type EventProposalAdminNotesQueryHookResult = ReturnType<typeof useEventProposalAdminNotesQuery>;
export type EventProposalAdminNotesQueryLazyQueryHookResult = ReturnType<typeof useEventProposalAdminNotesQueryLazyQuery>;
export type EventProposalAdminNotesQueryQueryResult = Apollo.QueryResult<EventProposalAdminNotesQueryData, EventProposalAdminNotesQueryVariables>;
export const ProposeEventButtonQueryDocument = gql`
    query ProposeEventButtonQuery {
  convention: conventionByRequestHost {
    id: transitionalId
    my_profile {
      id: transitionalId
      user {
        id: transitionalId
        event_proposals {
          id: transitionalId
          title
          status
          created_at
          event_category {
            id: transitionalId
            name
          }
          convention {
            id: transitionalId
            name
          }
        }
      }
    }
    departments {
      id: transitionalId
      name
      proposal_description
      event_categories {
        id: transitionalId
      }
    }
    event_categories {
      id: transitionalId
      name
      proposable
      proposal_description
      department {
        id: transitionalId
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
export type ProposeEventButtonQueryHookResult = ReturnType<typeof useProposeEventButtonQuery>;
export type ProposeEventButtonQueryLazyQueryHookResult = ReturnType<typeof useProposeEventButtonQueryLazyQuery>;
export type ProposeEventButtonQueryQueryResult = Apollo.QueryResult<ProposeEventButtonQueryData, ProposeEventButtonQueryVariables>;
export const EventProposalsAdminQueryDocument = gql`
    query EventProposalsAdminQuery($page: Int, $perPage: Int, $filters: EventProposalFiltersInput, $sort: [SortInput!]) {
  convention: conventionByRequestHost {
    id: transitionalId
    timezone_name
    event_categories(current_ability_can_read_event_proposals: true) {
      id: transitionalId
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
        id: transitionalId
        title
        length_seconds
        status
        submitted_at
        updated_at
        event_category {
          id: transitionalId
          name
          default_color
        }
        registration_policy {
          minimum_slots
          total_slots
          slots_limited
        }
        owner {
          id: transitionalId
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
export type EventProposalsAdminQueryHookResult = ReturnType<typeof useEventProposalsAdminQuery>;
export type EventProposalsAdminQueryLazyQueryHookResult = ReturnType<typeof useEventProposalsAdminQueryLazyQuery>;
export type EventProposalsAdminQueryQueryResult = Apollo.QueryResult<EventProposalsAdminQueryData, EventProposalsAdminQueryVariables>;
export const EventProposalHistoryQueryDocument = gql`
    query EventProposalHistoryQuery($id: Int!) {
  convention: conventionByRequestHost {
    id: transitionalId
    starts_at
    ends_at
    timezone_name
    timezone_mode
    event_proposal(id: $id) {
      id: transitionalId
      title
      owner {
        id: transitionalId
      }
      event_category {
        id: transitionalId
        event_proposal_form {
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
      }
      form_response_changes {
        user_con_profile {
          id: transitionalId
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
export function useEventProposalHistoryQuery(baseOptions: Apollo.QueryHookOptions<EventProposalHistoryQueryData, EventProposalHistoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventProposalHistoryQueryData, EventProposalHistoryQueryVariables>(EventProposalHistoryQueryDocument, options);
      }
export function useEventProposalHistoryQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventProposalHistoryQueryData, EventProposalHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventProposalHistoryQueryData, EventProposalHistoryQueryVariables>(EventProposalHistoryQueryDocument, options);
        }
export type EventProposalHistoryQueryHookResult = ReturnType<typeof useEventProposalHistoryQuery>;
export type EventProposalHistoryQueryLazyQueryHookResult = ReturnType<typeof useEventProposalHistoryQueryLazyQuery>;
export type EventProposalHistoryQueryQueryResult = Apollo.QueryResult<EventProposalHistoryQueryData, EventProposalHistoryQueryVariables>;