/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { CommonFormFieldsFragment, CommonFormSectionFieldsFragment, CommonFormItemFieldsFragment } from '../Models/commonFormFragments.generated';
import { gql } from '@apollo/client';
import { CommonFormFieldsFragmentDoc, CommonFormSectionFieldsFragmentDoc, CommonFormItemFieldsFragmentDoc } from '../Models/commonFormFragments.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type EventProposalFieldsFragment = (
  { __typename: 'EventProposal' }
  & Pick<Types.EventProposal, 'id' | 'title' | 'status' | 'form_response_attrs_json' | 'current_user_form_item_viewer_role' | 'current_user_form_item_writer_role'>
  & { event_category: (
    { __typename: 'EventCategory' }
    & Pick<Types.EventCategory, 'id' | 'name'>
    & { event_proposal_form?: Types.Maybe<(
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
    )> }
  ), event?: Types.Maybe<(
    { __typename: 'Event' }
    & Pick<Types.Event, 'id'>
  )> }
);

export type EventProposalFormDataFragment = (
  { __typename: 'Convention' }
  & Pick<Types.Convention, 'id' | 'starts_at' | 'ends_at' | 'timezone_name' | 'timezone_mode' | 'event_mailing_list_domain'>
);

export type EventProposalQueryVariables = Types.Exact<{
  eventProposalId: Types.Scalars['Int'];
}>;


export type EventProposalQueryData = (
  { __typename: 'Query' }
  & { currentAbility: (
    { __typename: 'Ability' }
    & Pick<Types.Ability, 'can_delete_event_proposal'>
  ), convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & EventProposalFormDataFragment
  ), eventProposal: (
    { __typename: 'EventProposal' }
    & Pick<Types.EventProposal, 'id'>
    & EventProposalFieldsFragment
  ) }
);

export type EventProposalQueryWithOwnerQueryVariables = Types.Exact<{
  eventProposalId: Types.Scalars['Int'];
}>;


export type EventProposalQueryWithOwnerQueryData = (
  { __typename: 'Query' }
  & { convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & EventProposalFormDataFragment
  ), eventProposal: (
    { __typename: 'EventProposal' }
    & Pick<Types.EventProposal, 'id'>
    & { owner: (
      { __typename: 'UserConProfile' }
      & Pick<Types.UserConProfile, 'id' | 'name' | 'email' | 'gravatar_enabled' | 'gravatar_url'>
    ) }
    & EventProposalFieldsFragment
  ), currentAbility: (
    { __typename: 'Ability' }
    & Pick<Types.Ability, 'can_update_event_proposal' | 'can_read_admin_notes_on_event_proposal'>
  ) }
);

export type EventProposalAdminNotesQueryVariables = Types.Exact<{
  eventProposalId: Types.Scalars['Int'];
}>;


export type EventProposalAdminNotesQueryData = (
  { __typename: 'Query' }
  & { eventProposal: (
    { __typename: 'EventProposal' }
    & Pick<Types.EventProposal, 'id' | 'admin_notes'>
  ) }
);

export type ProposeEventButtonQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ProposeEventButtonQueryData = (
  { __typename: 'Query' }
  & { myProfile?: Types.Maybe<(
    { __typename: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id'>
    & { user?: Types.Maybe<(
      { __typename: 'User' }
      & Pick<Types.User, 'id'>
      & { event_proposals: Array<(
        { __typename: 'EventProposal' }
        & Pick<Types.EventProposal, 'id' | 'title' | 'status' | 'created_at'>
        & { event_category: (
          { __typename: 'EventCategory' }
          & Pick<Types.EventCategory, 'id' | 'name'>
        ), convention: (
          { __typename: 'Convention' }
          & Pick<Types.Convention, 'id' | 'name'>
        ) }
      )> }
    )> }
  )>, convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & { departments: Array<(
      { __typename: 'Department' }
      & Pick<Types.Department, 'id' | 'name' | 'proposal_description'>
      & { event_categories: Array<(
        { __typename: 'EventCategory' }
        & Pick<Types.EventCategory, 'id'>
      )> }
    )>, event_categories: Array<(
      { __typename: 'EventCategory' }
      & Pick<Types.EventCategory, 'id' | 'name' | 'proposable' | 'proposal_description'>
      & { department?: Types.Maybe<(
        { __typename: 'Department' }
        & Pick<Types.Department, 'id'>
      )> }
    )> }
  ) }
);

export type EventProposalsAdminQueryVariables = Types.Exact<{
  page?: Types.Maybe<Types.Scalars['Int']>;
  perPage?: Types.Maybe<Types.Scalars['Int']>;
  filters?: Types.Maybe<Types.EventProposalFiltersInput>;
  sort?: Types.Maybe<Array<Types.SortInput> | Types.SortInput>;
}>;


export type EventProposalsAdminQueryData = (
  { __typename: 'Query' }
  & { convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'timezone_name'>
    & { event_categories: Array<(
      { __typename: 'EventCategory' }
      & Pick<Types.EventCategory, 'id' | 'name' | 'default_color'>
    )>, event_proposals_paginated: (
      { __typename: 'EventProposalsPagination' }
      & Pick<Types.EventProposalsPagination, 'total_entries' | 'total_pages' | 'current_page' | 'per_page'>
      & { entries: Array<(
        { __typename: 'EventProposal' }
        & Pick<Types.EventProposal, 'id' | 'title' | 'length_seconds' | 'status' | 'submitted_at' | 'updated_at'>
        & { event_category: (
          { __typename: 'EventCategory' }
          & Pick<Types.EventCategory, 'id' | 'name' | 'default_color'>
        ), registration_policy?: Types.Maybe<(
          { __typename: 'RegistrationPolicy' }
          & Pick<Types.RegistrationPolicy, 'minimum_slots' | 'total_slots' | 'slots_limited'>
        )>, owner: (
          { __typename: 'UserConProfile' }
          & Pick<Types.UserConProfile, 'id' | 'name_inverted' | 'gravatar_enabled' | 'gravatar_url'>
        ) }
      )> }
    ) }
  ) }
);

export type EventProposalHistoryQueryVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type EventProposalHistoryQueryData = (
  { __typename: 'Query' }
  & { convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'starts_at' | 'ends_at' | 'timezone_name' | 'timezone_mode'>
  ), eventProposal: (
    { __typename: 'EventProposal' }
    & Pick<Types.EventProposal, 'id' | 'title'>
    & { owner: (
      { __typename: 'UserConProfile' }
      & Pick<Types.UserConProfile, 'id'>
    ), event_category: (
      { __typename: 'EventCategory' }
      & Pick<Types.EventCategory, 'id'>
      & { event_proposal_form?: Types.Maybe<(
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
      )> }
    ), form_response_changes: Array<(
      { __typename: 'FormResponseChange' }
      & Pick<Types.FormResponseChange, 'field_identifier' | 'previous_value' | 'new_value' | 'created_at' | 'updated_at'>
      & { user_con_profile: (
        { __typename: 'UserConProfile' }
        & Pick<Types.UserConProfile, 'id' | 'name_without_nickname'>
      ) }
    )> }
  ) }
);

export const EventProposalFieldsFragmentDoc = gql`
    fragment EventProposalFields on EventProposal {
  id
  title
  status
  form_response_attrs_json
  current_user_form_item_viewer_role
  current_user_form_item_writer_role
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
    query EventProposalQuery($eventProposalId: Int!) {
  currentAbility {
    can_delete_event_proposal(event_proposal_id: $eventProposalId)
  }
  convention: assertConvention {
    id
    ...EventProposalFormData
  }
  eventProposal(id: $eventProposalId) {
    id
    ...EventProposalFields
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
  convention: assertConvention {
    id
    ...EventProposalFormData
  }
  eventProposal(id: $eventProposalId) {
    id
    ...EventProposalFields
    owner {
      id
      name
      email
      gravatar_enabled
      gravatar_url
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
  eventProposal(id: $eventProposalId) {
    id
    admin_notes
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
  myProfile {
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
  convention: assertConvention {
    id
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
export type ProposeEventButtonQueryHookResult = ReturnType<typeof useProposeEventButtonQuery>;
export type ProposeEventButtonQueryLazyQueryHookResult = ReturnType<typeof useProposeEventButtonQueryLazyQuery>;
export type ProposeEventButtonQueryQueryResult = Apollo.QueryResult<ProposeEventButtonQueryData, ProposeEventButtonQueryVariables>;
export const EventProposalsAdminQueryDocument = gql`
    query EventProposalsAdminQuery($page: Int, $perPage: Int, $filters: EventProposalFiltersInput, $sort: [SortInput!]) {
  convention: assertConvention {
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
export type EventProposalsAdminQueryHookResult = ReturnType<typeof useEventProposalsAdminQuery>;
export type EventProposalsAdminQueryLazyQueryHookResult = ReturnType<typeof useEventProposalsAdminQueryLazyQuery>;
export type EventProposalsAdminQueryQueryResult = Apollo.QueryResult<EventProposalsAdminQueryData, EventProposalsAdminQueryVariables>;
export const EventProposalHistoryQueryDocument = gql`
    query EventProposalHistoryQuery($id: Int!) {
  convention: assertConvention {
    id
    starts_at
    ends_at
    timezone_name
    timezone_mode
  }
  eventProposal(id: $id) {
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