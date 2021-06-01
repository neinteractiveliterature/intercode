/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { CommonFormFieldsFragment, CommonFormSectionFieldsFragment, CommonFormItemFieldsFragment } from '../../Models/commonFormFragments.generated';
import { gql } from '@apollo/client';
import { CommonFormFieldsFragmentDoc, CommonFormSectionFieldsFragmentDoc, CommonFormItemFieldsFragmentDoc } from '../../Models/commonFormFragments.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type EventHistoryQueryVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type EventHistoryQueryData = (
  { __typename: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'starts_at' | 'ends_at' | 'timezone_name' | 'timezone_mode'>
  )>, event: (
    { __typename: 'Event' }
    & Pick<Types.Event, 'id' | 'title'>
    & { event_category: (
      { __typename: 'EventCategory' }
      & Pick<Types.EventCategory, 'id'>
      & { event_form: (
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
      ) }
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


export const EventHistoryQueryDocument = gql`
    query EventHistoryQuery($id: Int!) {
  convention {
    id
    starts_at
    ends_at
    timezone_name
    timezone_mode
  }
  event(id: $id) {
    id
    title
    event_category {
      id
      event_form {
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
 * __useEventHistoryQuery__
 *
 * To run a query within a React component, call `useEventHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventHistoryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEventHistoryQuery(baseOptions: Apollo.QueryHookOptions<EventHistoryQueryData, EventHistoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventHistoryQueryData, EventHistoryQueryVariables>(EventHistoryQueryDocument, options);
      }
export function useEventHistoryQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventHistoryQueryData, EventHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventHistoryQueryData, EventHistoryQueryVariables>(EventHistoryQueryDocument, options);
        }
export type EventHistoryQueryHookResult = ReturnType<typeof useEventHistoryQuery>;
export type EventHistoryQueryLazyQueryHookResult = ReturnType<typeof useEventHistoryQueryLazyQuery>;
export type EventHistoryQueryQueryResult = Apollo.QueryResult<EventHistoryQueryData, EventHistoryQueryVariables>;