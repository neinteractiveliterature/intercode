/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { ConventionAdminConventionFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdateConventionMutationVariables = Types.Exact<{
  input: Types.UpdateConventionInput;
}>;


export type UpdateConventionMutationData = { __typename: 'Mutation', updateConvention: { __typename: 'UpdateConventionPayload', convention: { __typename: 'Convention', id: string, accepting_proposals?: boolean | null, starts_at?: string | null, ends_at?: string | null, canceled: boolean, name: string, default_currency_code?: string | null, domain?: string | null, email_from: string, email_mode: Types.EmailMode, event_mailing_list_domain?: string | null, location?: string | null, language: string, timezone_name?: string | null, timezone_mode: Types.TimezoneMode, show_schedule?: Types.ShowSchedule | null, show_event_list?: Types.ShowSchedule | null, hidden: boolean, maximum_tickets?: number | null, ticket_name: string, ticketNamePlural: string, clickwrap_agreement?: string | null, ticket_mode: Types.TicketMode, site_mode: Types.SiteMode, signup_mode: Types.SignupMode, signup_automation_mode: Types.SignupAutomationMode, signup_requests_open: boolean, stripe_account_ready_to_charge: boolean, favicon?: { __typename: 'ActiveStorageAttachment', id: string, url: string } | null, open_graph_image?: { __typename: 'ActiveStorageAttachment', id: string, url: string } | null, stripe_account?: { __typename: 'StripeAccount', id: string, email?: string | null, charges_enabled: boolean, display_name?: string | null } | null, signup_rounds: Array<{ __typename: 'SignupRound', id: string, start?: string | null, maximum_event_signups: string, ranked_choice_order?: Types.RankedChoiceOrder | null }>, defaultLayout: { __typename: 'CmsLayout', id: string, name?: string | null }, cmsLayouts: Array<{ __typename: 'CmsLayout', id: string, name?: string | null }>, rootPage: { __typename: 'Page', id: string, name?: string | null }, cmsPages: Array<{ __typename: 'Page', id: string, name?: string | null }>, staff_positions: Array<{ __typename: 'StaffPosition', id: string, name: string }>, catch_all_staff_position?: { __typename: 'StaffPosition', id: string, name: string } | null } } };

export type CreateConventionStripeAccountMutationVariables = Types.Exact<{
  baseUrl: Types.Scalars['String']['input'];
}>;


export type CreateConventionStripeAccountMutationData = { __typename: 'Mutation', createConventionStripeAccount: { __typename: 'CreateConventionStripeAccountPayload', stripe_account: { __typename: 'StripeAccount', id: string, account_onboarding_link: string } } };


export const UpdateConventionDocument = gql`
    mutation UpdateConvention($input: UpdateConventionInput!) {
  updateConvention(input: $input) {
    convention {
      id
      ...ConventionAdminConventionFields
    }
  }
}
    ${ConventionAdminConventionFieldsFragmentDoc}`;
export type UpdateConventionMutationFn = Apollo.MutationFunction<UpdateConventionMutationData, UpdateConventionMutationVariables>;

/**
 * __useUpdateConventionMutation__
 *
 * To run a mutation, you first call `useUpdateConventionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateConventionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateConventionMutation, { data, loading, error }] = useUpdateConventionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateConventionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateConventionMutationData, UpdateConventionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateConventionMutationData, UpdateConventionMutationVariables>(UpdateConventionDocument, options);
      }
export type UpdateConventionMutationHookResult = ReturnType<typeof useUpdateConventionMutation>;
export type UpdateConventionMutationResult = Apollo.MutationResult<UpdateConventionMutationData>;
export type UpdateConventionMutationOptions = Apollo.BaseMutationOptions<UpdateConventionMutationData, UpdateConventionMutationVariables>;
export const CreateConventionStripeAccountDocument = gql`
    mutation CreateConventionStripeAccount($baseUrl: String!) {
  createConventionStripeAccount(input: {}) {
    stripe_account {
      id
      account_onboarding_link(base_url: $baseUrl)
    }
  }
}
    `;
export type CreateConventionStripeAccountMutationFn = Apollo.MutationFunction<CreateConventionStripeAccountMutationData, CreateConventionStripeAccountMutationVariables>;

/**
 * __useCreateConventionStripeAccountMutation__
 *
 * To run a mutation, you first call `useCreateConventionStripeAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateConventionStripeAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createConventionStripeAccountMutation, { data, loading, error }] = useCreateConventionStripeAccountMutation({
 *   variables: {
 *      baseUrl: // value for 'baseUrl'
 *   },
 * });
 */
export function useCreateConventionStripeAccountMutation(baseOptions?: Apollo.MutationHookOptions<CreateConventionStripeAccountMutationData, CreateConventionStripeAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateConventionStripeAccountMutationData, CreateConventionStripeAccountMutationVariables>(CreateConventionStripeAccountDocument, options);
      }
export type CreateConventionStripeAccountMutationHookResult = ReturnType<typeof useCreateConventionStripeAccountMutation>;
export type CreateConventionStripeAccountMutationResult = Apollo.MutationResult<CreateConventionStripeAccountMutationData>;
export type CreateConventionStripeAccountMutationOptions = Apollo.BaseMutationOptions<CreateConventionStripeAccountMutationData, CreateConventionStripeAccountMutationVariables>;