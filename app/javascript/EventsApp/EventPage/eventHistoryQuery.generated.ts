/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CommonFormFieldsFragmentDoc, CommonFormSectionFieldsFragmentDoc, CommonFormItemFieldsFragmentDoc } from '../../Models/commonFormFragments.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type EventHistoryQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type EventHistoryQueryData = { __typename: 'Query', convention: { __typename: 'Convention', starts_at?: string | null | undefined, ends_at?: string | null | undefined, timezone_name?: string | null | undefined, timezone_mode: Types.TimezoneMode, id: string, event: { __typename: 'Event', title?: string | null | undefined, id: string, event_category: { __typename: 'EventCategory', id: string, event_form: { __typename: 'Form', title: string, form_type: Types.FormType, id: string, form_sections: Array<{ __typename: 'FormSection', title?: string | null | undefined, position: number, id: string, form_items: Array<{ __typename: 'FormItem', admin_description?: string | null | undefined, position: number, identifier?: string | null | undefined, item_type: string, rendered_properties: string, default_value?: string | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole, id: string }> }> } }, form_response_changes: Array<{ __typename: 'FormResponseChange', field_identifier: string, previous_value?: string | null | undefined, new_value?: string | null | undefined, created_at: string, updated_at: string, user_con_profile: { __typename: 'UserConProfile', name_without_nickname: string, id: string } }> } } };


export const EventHistoryQueryDocument = gql`
    query EventHistoryQuery($id: ID!) {
  convention: conventionByRequestHost {
    id: transitionalId
    starts_at
    ends_at
    timezone_name
    timezone_mode
    event(transitionalId: $id) {
      id: transitionalId
      title
      event_category {
        id: transitionalId
        event_form {
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