/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { CommonFormFieldsFragment } from '../Models/commonFormFragments.generated';
import gql from 'graphql-tag';
import { CommonFormFieldsFragmentDoc } from '../Models/commonFormFragments.generated';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';


export type EventProposalFieldsFragment = (
  { __typename?: 'EventProposal' }
  & Pick<Types.EventProposal, 'id' | 'title' | 'status' | 'form_response_attrs_json'>
  & { event_category: (
    { __typename?: 'EventCategory' }
    & Pick<Types.EventCategory, 'id' | 'name'>
    & { event_proposal_form?: Types.Maybe<(
      { __typename?: 'Form' }
      & Pick<Types.Form, 'id' | 'form_api_json'>
    )> }
  ), event?: Types.Maybe<(
    { __typename?: 'Event' }
    & Pick<Types.Event, 'id'>
  )> }
);

export type EventProposalFormDataFragment = (
  { __typename?: 'Convention' }
  & Pick<Types.Convention, 'id' | 'starts_at' | 'ends_at' | 'timezone_name' | 'event_mailing_list_domain'>
);

export type EventProposalQueryQueryVariables = Types.Exact<{
  eventProposalId: Types.Scalars['Int'];
}>;


export type EventProposalQueryQuery = (
  { __typename?: 'Query' }
  & { currentAbility: (
    { __typename?: 'Ability' }
    & Pick<Types.Ability, 'can_delete_event_proposal'>
  ), convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & EventProposalFormDataFragment
  )>, eventProposal: (
    { __typename?: 'EventProposal' }
    & Pick<Types.EventProposal, 'id'>
    & EventProposalFieldsFragment
  ) }
);

export type EventProposalQueryWithOwnerQueryVariables = Types.Exact<{
  eventProposalId: Types.Scalars['Int'];
}>;


export type EventProposalQueryWithOwnerQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & EventProposalFormDataFragment
  )>, eventProposal: (
    { __typename?: 'EventProposal' }
    & Pick<Types.EventProposal, 'id'>
    & { owner: (
      { __typename?: 'UserConProfile' }
      & Pick<Types.UserConProfile, 'id' | 'name' | 'email' | 'gravatar_enabled' | 'gravatar_url'>
    ) }
    & EventProposalFieldsFragment
  ), currentAbility: (
    { __typename?: 'Ability' }
    & Pick<Types.Ability, 'can_update_event_proposal' | 'can_read_admin_notes_on_event_proposal'>
  ) }
);

export type EventProposalAdminNotesQueryQueryVariables = Types.Exact<{
  eventProposalId: Types.Scalars['Int'];
}>;


export type EventProposalAdminNotesQueryQuery = (
  { __typename?: 'Query' }
  & { eventProposal: (
    { __typename?: 'EventProposal' }
    & Pick<Types.EventProposal, 'id' | 'admin_notes'>
  ) }
);

export type ProposeEventButtonQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ProposeEventButtonQueryQuery = (
  { __typename?: 'Query' }
  & { myProfile?: Types.Maybe<(
    { __typename?: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id'>
    & { user?: Types.Maybe<(
      { __typename?: 'User' }
      & Pick<Types.User, 'id'>
      & { event_proposals: Array<(
        { __typename?: 'EventProposal' }
        & Pick<Types.EventProposal, 'id' | 'title' | 'status' | 'created_at'>
        & { event_category: (
          { __typename?: 'EventCategory' }
          & Pick<Types.EventCategory, 'id' | 'name'>
        ), convention: (
          { __typename?: 'Convention' }
          & Pick<Types.Convention, 'id' | 'name'>
        ) }
      )> }
    )> }
  )>, convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & { departments: Array<(
      { __typename?: 'Department' }
      & Pick<Types.Department, 'id' | 'name' | 'proposal_description'>
    )>, event_categories: Array<(
      { __typename?: 'EventCategory' }
      & Pick<Types.EventCategory, 'id' | 'name' | 'proposable' | 'proposal_description'>
      & { department?: Types.Maybe<(
        { __typename?: 'Department' }
        & Pick<Types.Department, 'id'>
      )> }
    )> }
  )> }
);

export type EventProposalsAdminQueryQueryVariables = Types.Exact<{
  page?: Types.Maybe<Types.Scalars['Int']>;
  perPage?: Types.Maybe<Types.Scalars['Int']>;
  filters?: Types.Maybe<Types.EventProposalFiltersInput>;
  sort?: Types.Maybe<Array<Types.SortInput>>;
}>;


export type EventProposalsAdminQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id' | 'timezone_name'>
    & { event_categories: Array<(
      { __typename?: 'EventCategory' }
      & Pick<Types.EventCategory, 'id' | 'name' | 'default_color'>
    )>, event_proposals_paginated: (
      { __typename?: 'EventProposalsPagination' }
      & Pick<Types.EventProposalsPagination, 'total_entries' | 'total_pages' | 'current_page' | 'per_page'>
      & { entries: Array<(
        { __typename?: 'EventProposal' }
        & Pick<Types.EventProposal, 'id' | 'title' | 'length_seconds' | 'status' | 'submitted_at' | 'updated_at'>
        & { event_category: (
          { __typename?: 'EventCategory' }
          & Pick<Types.EventCategory, 'id' | 'name' | 'default_color'>
        ), registration_policy?: Types.Maybe<(
          { __typename?: 'RegistrationPolicy' }
          & Pick<Types.RegistrationPolicy, 'minimum_slots' | 'total_slots' | 'slots_limited'>
        )>, owner: (
          { __typename?: 'UserConProfile' }
          & Pick<Types.UserConProfile, 'id' | 'name_inverted' | 'gravatar_enabled' | 'gravatar_url'>
        ) }
      )> }
    ) }
  )> }
);

export type EventProposalHistoryQueryQueryVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type EventProposalHistoryQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id' | 'starts_at' | 'ends_at' | 'timezone_name' | 'timezone_mode'>
  )>, eventProposal: (
    { __typename?: 'EventProposal' }
    & Pick<Types.EventProposal, 'id' | 'title'>
    & { owner: (
      { __typename?: 'UserConProfile' }
      & Pick<Types.UserConProfile, 'id'>
    ), event_category: (
      { __typename?: 'EventCategory' }
      & Pick<Types.EventCategory, 'id'>
      & { event_proposal_form?: Types.Maybe<(
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
      )> }
    ), form_response_changes: Array<(
      { __typename?: 'FormResponseChange' }
      & Pick<Types.FormResponseChange, 'field_identifier' | 'previous_value' | 'new_value' | 'created_at' | 'updated_at'>
      & { user_con_profile: (
        { __typename?: 'UserConProfile' }
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
  event_category {
    id
    name
    event_proposal_form {
      id
      form_api_json
    }
  }
  event {
    id
  }
}
    `;
export const EventProposalFormDataFragmentDoc = gql`
    fragment EventProposalFormData on Convention {
  id
  starts_at
  ends_at
  timezone_name
  event_mailing_list_domain
}
    `;
export const EventProposalQueryDocument = gql`
    query EventProposalQuery($eventProposalId: Int!) {
  currentAbility {
    can_delete_event_proposal(event_proposal_id: $eventProposalId)
  }
  convention {
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
 * __useEventProposalQueryQuery__
 *
 * To run a query within a React component, call `useEventProposalQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventProposalQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventProposalQueryQuery({
 *   variables: {
 *      eventProposalId: // value for 'eventProposalId'
 *   },
 * });
 */
export function useEventProposalQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<EventProposalQueryQuery, EventProposalQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<EventProposalQueryQuery, EventProposalQueryQueryVariables>(EventProposalQueryDocument, baseOptions);
      }
export function useEventProposalQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<EventProposalQueryQuery, EventProposalQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<EventProposalQueryQuery, EventProposalQueryQueryVariables>(EventProposalQueryDocument, baseOptions);
        }
export type EventProposalQueryQueryHookResult = ReturnType<typeof useEventProposalQueryQuery>;
export type EventProposalQueryLazyQueryHookResult = ReturnType<typeof useEventProposalQueryLazyQuery>;
export type EventProposalQueryQueryResult = ApolloReactCommon.QueryResult<EventProposalQueryQuery, EventProposalQueryQueryVariables>;
export const EventProposalQueryWithOwnerDocument = gql`
    query EventProposalQueryWithOwner($eventProposalId: Int!) {
  convention {
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
 * __useEventProposalQueryWithOwnerQuery__
 *
 * To run a query within a React component, call `useEventProposalQueryWithOwnerQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventProposalQueryWithOwnerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventProposalQueryWithOwnerQuery({
 *   variables: {
 *      eventProposalId: // value for 'eventProposalId'
 *   },
 * });
 */
export function useEventProposalQueryWithOwnerQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<EventProposalQueryWithOwnerQuery, EventProposalQueryWithOwnerQueryVariables>) {
        return ApolloReactHooks.useQuery<EventProposalQueryWithOwnerQuery, EventProposalQueryWithOwnerQueryVariables>(EventProposalQueryWithOwnerDocument, baseOptions);
      }
export function useEventProposalQueryWithOwnerLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<EventProposalQueryWithOwnerQuery, EventProposalQueryWithOwnerQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<EventProposalQueryWithOwnerQuery, EventProposalQueryWithOwnerQueryVariables>(EventProposalQueryWithOwnerDocument, baseOptions);
        }
export type EventProposalQueryWithOwnerQueryHookResult = ReturnType<typeof useEventProposalQueryWithOwnerQuery>;
export type EventProposalQueryWithOwnerLazyQueryHookResult = ReturnType<typeof useEventProposalQueryWithOwnerLazyQuery>;
export type EventProposalQueryWithOwnerQueryResult = ApolloReactCommon.QueryResult<EventProposalQueryWithOwnerQuery, EventProposalQueryWithOwnerQueryVariables>;
export const EventProposalAdminNotesQueryDocument = gql`
    query EventProposalAdminNotesQuery($eventProposalId: Int!) {
  eventProposal(id: $eventProposalId) {
    id
    admin_notes
  }
}
    `;

/**
 * __useEventProposalAdminNotesQueryQuery__
 *
 * To run a query within a React component, call `useEventProposalAdminNotesQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventProposalAdminNotesQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventProposalAdminNotesQueryQuery({
 *   variables: {
 *      eventProposalId: // value for 'eventProposalId'
 *   },
 * });
 */
export function useEventProposalAdminNotesQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<EventProposalAdminNotesQueryQuery, EventProposalAdminNotesQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<EventProposalAdminNotesQueryQuery, EventProposalAdminNotesQueryQueryVariables>(EventProposalAdminNotesQueryDocument, baseOptions);
      }
export function useEventProposalAdminNotesQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<EventProposalAdminNotesQueryQuery, EventProposalAdminNotesQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<EventProposalAdminNotesQueryQuery, EventProposalAdminNotesQueryQueryVariables>(EventProposalAdminNotesQueryDocument, baseOptions);
        }
export type EventProposalAdminNotesQueryQueryHookResult = ReturnType<typeof useEventProposalAdminNotesQueryQuery>;
export type EventProposalAdminNotesQueryLazyQueryHookResult = ReturnType<typeof useEventProposalAdminNotesQueryLazyQuery>;
export type EventProposalAdminNotesQueryQueryResult = ApolloReactCommon.QueryResult<EventProposalAdminNotesQueryQuery, EventProposalAdminNotesQueryQueryVariables>;
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
  convention {
    id
    departments {
      id
      name
      proposal_description
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
 * __useProposeEventButtonQueryQuery__
 *
 * To run a query within a React component, call `useProposeEventButtonQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useProposeEventButtonQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProposeEventButtonQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useProposeEventButtonQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ProposeEventButtonQueryQuery, ProposeEventButtonQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<ProposeEventButtonQueryQuery, ProposeEventButtonQueryQueryVariables>(ProposeEventButtonQueryDocument, baseOptions);
      }
export function useProposeEventButtonQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ProposeEventButtonQueryQuery, ProposeEventButtonQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ProposeEventButtonQueryQuery, ProposeEventButtonQueryQueryVariables>(ProposeEventButtonQueryDocument, baseOptions);
        }
export type ProposeEventButtonQueryQueryHookResult = ReturnType<typeof useProposeEventButtonQueryQuery>;
export type ProposeEventButtonQueryLazyQueryHookResult = ReturnType<typeof useProposeEventButtonQueryLazyQuery>;
export type ProposeEventButtonQueryQueryResult = ApolloReactCommon.QueryResult<ProposeEventButtonQueryQuery, ProposeEventButtonQueryQueryVariables>;
export const EventProposalsAdminQueryDocument = gql`
    query EventProposalsAdminQuery($page: Int, $perPage: Int, $filters: EventProposalFiltersInput, $sort: [SortInput!]) {
  convention {
    id
    timezone_name
    event_categories(current_ability_can_read_event_proposals: true) {
      id
      name
      default_color
    }
    event_proposals_paginated(page: $page, per_page: $perPage, filters: $filters, sort: $sort) {
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
 * __useEventProposalsAdminQueryQuery__
 *
 * To run a query within a React component, call `useEventProposalsAdminQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventProposalsAdminQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventProposalsAdminQueryQuery({
 *   variables: {
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *      filters: // value for 'filters'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useEventProposalsAdminQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<EventProposalsAdminQueryQuery, EventProposalsAdminQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<EventProposalsAdminQueryQuery, EventProposalsAdminQueryQueryVariables>(EventProposalsAdminQueryDocument, baseOptions);
      }
export function useEventProposalsAdminQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<EventProposalsAdminQueryQuery, EventProposalsAdminQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<EventProposalsAdminQueryQuery, EventProposalsAdminQueryQueryVariables>(EventProposalsAdminQueryDocument, baseOptions);
        }
export type EventProposalsAdminQueryQueryHookResult = ReturnType<typeof useEventProposalsAdminQueryQuery>;
export type EventProposalsAdminQueryLazyQueryHookResult = ReturnType<typeof useEventProposalsAdminQueryLazyQuery>;
export type EventProposalsAdminQueryQueryResult = ApolloReactCommon.QueryResult<EventProposalsAdminQueryQuery, EventProposalsAdminQueryQueryVariables>;
export const EventProposalHistoryQueryDocument = gql`
    query EventProposalHistoryQuery($id: Int!) {
  convention {
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
 * __useEventProposalHistoryQueryQuery__
 *
 * To run a query within a React component, call `useEventProposalHistoryQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventProposalHistoryQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventProposalHistoryQueryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEventProposalHistoryQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<EventProposalHistoryQueryQuery, EventProposalHistoryQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<EventProposalHistoryQueryQuery, EventProposalHistoryQueryQueryVariables>(EventProposalHistoryQueryDocument, baseOptions);
      }
export function useEventProposalHistoryQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<EventProposalHistoryQueryQuery, EventProposalHistoryQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<EventProposalHistoryQueryQuery, EventProposalHistoryQueryQueryVariables>(EventProposalHistoryQueryDocument, baseOptions);
        }
export type EventProposalHistoryQueryQueryHookResult = ReturnType<typeof useEventProposalHistoryQueryQuery>;
export type EventProposalHistoryQueryLazyQueryHookResult = ReturnType<typeof useEventProposalHistoryQueryLazyQuery>;
export type EventProposalHistoryQueryQueryResult = ApolloReactCommon.QueryResult<EventProposalHistoryQueryQuery, EventProposalHistoryQueryQueryVariables>;