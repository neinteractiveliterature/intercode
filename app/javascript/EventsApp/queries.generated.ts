/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CommonFormItemFieldsFragmentDoc, CommonFormFieldsFragmentDoc, CommonFormSectionFieldsFragmentDoc } from '../Models/commonFormFragments.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CommonConventionDataFragment = { __typename: 'Convention', id: string, name: string, starts_at?: string | null, ends_at?: string | null, signup_mode: Types.SignupMode, signup_automation_mode: Types.SignupAutomationMode, site_mode: Types.SiteMode, timezone_name?: string | null, timezone_mode: Types.TimezoneMode, ticket_name: string, ticket_mode: Types.TicketMode, event_categories: Array<{ __typename: 'EventCategory', id: string, name: string, scheduling_ui: Types.SchedulingUi, default_color?: string | null, full_color?: string | null, signed_up_color?: string | null, team_member_name: string, teamMemberNamePlural: string, event_form: { __typename: 'Form', id: string, form_sections: Array<{ __typename: 'FormSection', id: string, form_items: Array<{ __typename: 'FormItem', id: string, public_description?: string | null, default_value?: string | null, position: number, identifier?: string | null, item_type: string, rendered_properties: string, visibility: Types.FormItemRole, writeability: Types.FormItemRole, expose_in?: Array<Types.FormItemExposeIn> | null }> }> } }> };

export type RunBasicSignupDataFragment = { __typename: 'Run', id: string, grouped_signup_counts: Array<{ __typename: 'GroupedSignupCount', bucket_key?: string | null, count: number, counted: boolean, state: Types.SignupState, team_member: boolean }>, my_signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: string, state: Types.SignupRequestState }> };

export type CommonConventionDataQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CommonConventionDataQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, name: string, starts_at?: string | null, ends_at?: string | null, signup_mode: Types.SignupMode, signup_automation_mode: Types.SignupAutomationMode, site_mode: Types.SiteMode, timezone_name?: string | null, timezone_mode: Types.TimezoneMode, ticket_name: string, ticket_mode: Types.TicketMode, event_categories: Array<{ __typename: 'EventCategory', id: string, name: string, scheduling_ui: Types.SchedulingUi, default_color?: string | null, full_color?: string | null, signed_up_color?: string | null, team_member_name: string, teamMemberNamePlural: string, event_form: { __typename: 'Form', id: string, form_sections: Array<{ __typename: 'FormSection', id: string, form_items: Array<{ __typename: 'FormItem', id: string, public_description?: string | null, default_value?: string | null, position: number, identifier?: string | null, item_type: string, rendered_properties: string, visibility: Types.FormItemRole, writeability: Types.FormItemRole, expose_in?: Array<Types.FormItemExposeIn> | null }> }> } }> } };

export const CommonConventionDataFragmentDoc = gql`
    fragment CommonConventionData on Convention {
  id
  name
  starts_at
  ends_at
  signup_mode
  signup_automation_mode
  site_mode
  timezone_name
  timezone_mode
  ticket_name
  ticket_mode
  event_categories {
    id
    name
    scheduling_ui
    default_color
    full_color
    signed_up_color
    team_member_name
    teamMemberNamePlural
    event_form {
      id
      form_sections {
        id
        form_items {
          id
          public_description
          default_value
          ...CommonFormItemFields
        }
      }
    }
  }
}
    ${CommonFormItemFieldsFragmentDoc}`;
export const RunBasicSignupDataFragmentDoc = gql`
    fragment RunBasicSignupData on Run {
  id
  grouped_signup_counts {
    bucket_key
    count
    counted
    state
    team_member
  }
  my_signups {
    id
    state
  }
  my_signup_requests {
    id
    state
  }
}
    `;
export const CommonConventionDataQueryDocument = gql`
    query CommonConventionDataQuery {
  convention: conventionByRequestHost {
    id
    ...CommonConventionData
  }
}
    ${CommonConventionDataFragmentDoc}`;

/**
 * __useCommonConventionDataQuery__
 *
 * To run a query within a React component, call `useCommonConventionDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useCommonConventionDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommonConventionDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useCommonConventionDataQuery(baseOptions?: Apollo.QueryHookOptions<CommonConventionDataQueryData, CommonConventionDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CommonConventionDataQueryData, CommonConventionDataQueryVariables>(CommonConventionDataQueryDocument, options);
      }
export function useCommonConventionDataQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CommonConventionDataQueryData, CommonConventionDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CommonConventionDataQueryData, CommonConventionDataQueryVariables>(CommonConventionDataQueryDocument, options);
        }
export function useCommonConventionDataQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CommonConventionDataQueryData, CommonConventionDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CommonConventionDataQueryData, CommonConventionDataQueryVariables>(CommonConventionDataQueryDocument, options);
        }
export type CommonConventionDataQueryHookResult = ReturnType<typeof useCommonConventionDataQuery>;
export type CommonConventionDataQueryLazyQueryHookResult = ReturnType<typeof useCommonConventionDataQueryLazyQuery>;
export type CommonConventionDataQuerySuspenseQueryHookResult = ReturnType<typeof useCommonConventionDataQuerySuspenseQuery>;
export type CommonConventionDataQueryQueryResult = Apollo.QueryResult<CommonConventionDataQueryData, CommonConventionDataQueryVariables>;