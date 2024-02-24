/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CommonFormFieldsFragmentDoc } from '../../Models/commonFormFragments.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type EventHistoryQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type EventHistoryQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, starts_at?: string | null, ends_at?: string | null, timezone_name?: string | null, timezone_mode: Types.TimezoneMode, event: { __typename: 'Event', id: string, title?: string | null, event_category: { __typename: 'EventCategory', id: string, event_form: { __typename: 'Form', id: string, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: string, title?: string | null, position: number, form_items: Array<{ __typename: 'FormItem', id: string, admin_description?: string | null, position: number, identifier?: string | null, item_type: string, rendered_properties: string, default_value?: string | null, visibility: Types.FormItemRole, writeability: Types.FormItemRole, expose_in?: Array<Types.FormItemExposeIn> | null }> }> } }, form_response_changes: Array<{ __typename: 'FormResponseChange', field_identifier: string, previous_value?: string | null, new_value?: string | null, created_at: string, updated_at: string, user_con_profile: { __typename: 'UserConProfile', id: string, name_without_nickname: string } }> } } };


export const EventHistoryQueryDocument = gql`
    query EventHistoryQuery($id: ID!) {
  convention: conventionByRequestHost {
    id
    starts_at
    ends_at
    timezone_name
    timezone_mode
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
export function useEventHistoryQuery(baseOptions: Apollo.QueryHookOptions<EventHistoryQueryData, EventHistoryQueryVariables> & ({ variables: EventHistoryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventHistoryQueryData, EventHistoryQueryVariables>(EventHistoryQueryDocument, options);
      }
export function useEventHistoryQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventHistoryQueryData, EventHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventHistoryQueryData, EventHistoryQueryVariables>(EventHistoryQueryDocument, options);
        }
export function useEventHistoryQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<EventHistoryQueryData, EventHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<EventHistoryQueryData, EventHistoryQueryVariables>(EventHistoryQueryDocument, options);
        }
export type EventHistoryQueryHookResult = ReturnType<typeof useEventHistoryQuery>;
export type EventHistoryQueryLazyQueryHookResult = ReturnType<typeof useEventHistoryQueryLazyQuery>;
export type EventHistoryQuerySuspenseQueryHookResult = ReturnType<typeof useEventHistoryQuerySuspenseQuery>;
export type EventHistoryQueryQueryResult = Apollo.QueryResult<EventHistoryQueryData, EventHistoryQueryVariables>;