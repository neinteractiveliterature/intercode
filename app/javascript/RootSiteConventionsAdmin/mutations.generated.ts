/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { ConventionDisplayFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateConventionMutationVariables = Types.Exact<{
  convention: Types.ConventionInput;
  cloneConventionId?: Types.InputMaybe<Types.Scalars['ID']['input']>;
  organizationId?: Types.InputMaybe<Types.Scalars['ID']['input']>;
  cmsContentSetName?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type CreateConventionMutationData = { __typename: 'Mutation', createConvention: { __typename: 'CreateConventionPayload', convention: { __typename: 'Convention', id: string, name: string, starts_at?: string | null, ends_at?: string | null, canceled: boolean, timezone_name?: string | null, timezone_mode: Types.TimezoneMode, domain?: string | null, site_mode: Types.SiteMode, ticket_mode: Types.TicketMode, show_event_list?: Types.ShowSchedule | null, show_schedule?: Types.ShowSchedule | null, email_from: string, hidden: boolean, language: string, signup_rounds: Array<{ __typename: 'SignupRound', id: string, start?: string | null, maximum_event_signups: string }>, organization?: { __typename: 'Organization', id: string, name: string } | null } } };

export type SetConventionCanceledMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  canceled: Types.Scalars['Boolean']['input'];
}>;


export type SetConventionCanceledMutationData = { __typename: 'Mutation', setConventionCanceled: { __typename: 'SetConventionCanceledPayload', convention: { __typename: 'Convention', id: string, name: string, starts_at?: string | null, ends_at?: string | null, canceled: boolean, timezone_name?: string | null, timezone_mode: Types.TimezoneMode, domain?: string | null, site_mode: Types.SiteMode, ticket_mode: Types.TicketMode, show_event_list?: Types.ShowSchedule | null, show_schedule?: Types.ShowSchedule | null, email_from: string, hidden: boolean, language: string, signup_rounds: Array<{ __typename: 'SignupRound', id: string, start?: string | null, maximum_event_signups: string }>, organization?: { __typename: 'Organization', id: string, name: string } | null } } };


export const CreateConventionDocument = gql`
    mutation CreateConvention($convention: ConventionInput!, $cloneConventionId: ID, $organizationId: ID, $cmsContentSetName: String) {
  createConvention(
    input: {convention: $convention, cloneConventionId: $cloneConventionId, organizationId: $organizationId, cms_content_set_name: $cmsContentSetName}
  ) {
    convention {
      id
      ...ConventionDisplayFields
    }
  }
}
    ${ConventionDisplayFieldsFragmentDoc}`;
export type CreateConventionMutationFn = Apollo.MutationFunction<CreateConventionMutationData, CreateConventionMutationVariables>;

/**
 * __useCreateConventionMutation__
 *
 * To run a mutation, you first call `useCreateConventionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateConventionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createConventionMutation, { data, loading, error }] = useCreateConventionMutation({
 *   variables: {
 *      convention: // value for 'convention'
 *      cloneConventionId: // value for 'cloneConventionId'
 *      organizationId: // value for 'organizationId'
 *      cmsContentSetName: // value for 'cmsContentSetName'
 *   },
 * });
 */
export function useCreateConventionMutation(baseOptions?: Apollo.MutationHookOptions<CreateConventionMutationData, CreateConventionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateConventionMutationData, CreateConventionMutationVariables>(CreateConventionDocument, options);
      }
export type CreateConventionMutationHookResult = ReturnType<typeof useCreateConventionMutation>;
export type CreateConventionMutationResult = Apollo.MutationResult<CreateConventionMutationData>;
export type CreateConventionMutationOptions = Apollo.BaseMutationOptions<CreateConventionMutationData, CreateConventionMutationVariables>;
export const SetConventionCanceledDocument = gql`
    mutation SetConventionCanceled($id: ID!, $canceled: Boolean!) {
  setConventionCanceled(input: {id: $id, canceled: $canceled}) {
    convention {
      id
      ...ConventionDisplayFields
    }
  }
}
    ${ConventionDisplayFieldsFragmentDoc}`;
export type SetConventionCanceledMutationFn = Apollo.MutationFunction<SetConventionCanceledMutationData, SetConventionCanceledMutationVariables>;

/**
 * __useSetConventionCanceledMutation__
 *
 * To run a mutation, you first call `useSetConventionCanceledMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetConventionCanceledMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setConventionCanceledMutation, { data, loading, error }] = useSetConventionCanceledMutation({
 *   variables: {
 *      id: // value for 'id'
 *      canceled: // value for 'canceled'
 *   },
 * });
 */
export function useSetConventionCanceledMutation(baseOptions?: Apollo.MutationHookOptions<SetConventionCanceledMutationData, SetConventionCanceledMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetConventionCanceledMutationData, SetConventionCanceledMutationVariables>(SetConventionCanceledDocument, options);
      }
export type SetConventionCanceledMutationHookResult = ReturnType<typeof useSetConventionCanceledMutation>;
export type SetConventionCanceledMutationResult = Apollo.MutationResult<SetConventionCanceledMutationData>;
export type SetConventionCanceledMutationOptions = Apollo.BaseMutationOptions<SetConventionCanceledMutationData, SetConventionCanceledMutationVariables>;