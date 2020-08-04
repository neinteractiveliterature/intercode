/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { EventProposalFieldsFragment } from './queries.generated';
import gql from 'graphql-tag';
import { EventProposalFieldsFragmentDoc } from './queries.generated';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';


export type CreateEventProposalMutationVariables = Types.Exact<{
  cloneEventProposalId?: Types.Maybe<Types.Scalars['Int']>;
  eventCategoryId: Types.Scalars['Int'];
}>;


export type CreateEventProposalMutation = (
  { __typename?: 'Mutation' }
  & { createEventProposal?: Types.Maybe<(
    { __typename?: 'CreateEventProposalPayload' }
    & { event_proposal: (
      { __typename?: 'EventProposal' }
      & Pick<Types.EventProposal, 'id'>
    ) }
  )> }
);

export type UpdateEventProposalMutationVariables = Types.Exact<{
  input: Types.UpdateEventProposalInput;
}>;


export type UpdateEventProposalMutation = (
  { __typename?: 'Mutation' }
  & { updateEventProposal?: Types.Maybe<(
    { __typename?: 'UpdateEventProposalPayload' }
    & { event_proposal: (
      { __typename?: 'EventProposal' }
      & Pick<Types.EventProposal, 'id'>
      & EventProposalFieldsFragment
    ) }
  )> }
);

export type DeleteEventProposalMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type DeleteEventProposalMutation = (
  { __typename?: 'Mutation' }
  & { deleteEventProposal?: Types.Maybe<(
    { __typename?: 'DeleteEventProposalPayload' }
    & Pick<Types.DeleteEventProposalPayload, 'clientMutationId'>
  )> }
);

export type SubmitEventProposalMutationVariables = Types.Exact<{
  input: Types.SubmitEventProposalInput;
}>;


export type SubmitEventProposalMutation = (
  { __typename?: 'Mutation' }
  & { submitEventProposal?: Types.Maybe<(
    { __typename?: 'SubmitEventProposalPayload' }
    & { event_proposal: (
      { __typename?: 'EventProposal' }
      & Pick<Types.EventProposal, 'id'>
      & EventProposalFieldsFragment
    ) }
  )> }
);

export type TransitionEventProposalMutationVariables = Types.Exact<{
  eventProposalId: Types.Scalars['Int'];
  status: Types.Scalars['String'];
  dropEvent?: Types.Maybe<Types.Scalars['Boolean']>;
}>;


export type TransitionEventProposalMutation = (
  { __typename?: 'Mutation' }
  & { transitionEventProposal?: Types.Maybe<(
    { __typename?: 'TransitionEventProposalPayload' }
    & { event_proposal: (
      { __typename?: 'EventProposal' }
      & Pick<Types.EventProposal, 'id'>
      & EventProposalFieldsFragment
    ) }
  )> }
);

export type UpdateEventProposalAdminNotesMutationVariables = Types.Exact<{
  eventProposalId: Types.Scalars['Int'];
  adminNotes: Types.Scalars['String'];
}>;


export type UpdateEventProposalAdminNotesMutation = (
  { __typename?: 'Mutation' }
  & { updateEventProposalAdminNotes?: Types.Maybe<(
    { __typename?: 'UpdateEventProposalAdminNotesPayload' }
    & { event_proposal: (
      { __typename?: 'EventProposal' }
      & Pick<Types.EventProposal, 'id'>
      & EventProposalFieldsFragment
    ) }
  )> }
);


export const CreateEventProposalDocument = gql`
    mutation CreateEventProposal($cloneEventProposalId: Int, $eventCategoryId: Int!) {
  createEventProposal(input: {clone_event_proposal_id: $cloneEventProposalId, event_category_id: $eventCategoryId}) {
    event_proposal {
      id
    }
  }
}
    `;
export type CreateEventProposalMutationFn = ApolloReactCommon.MutationFunction<CreateEventProposalMutation, CreateEventProposalMutationVariables>;

/**
 * __useCreateEventProposalMutation__
 *
 * To run a mutation, you first call `useCreateEventProposalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEventProposalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEventProposalMutation, { data, loading, error }] = useCreateEventProposalMutation({
 *   variables: {
 *      cloneEventProposalId: // value for 'cloneEventProposalId'
 *      eventCategoryId: // value for 'eventCategoryId'
 *   },
 * });
 */
export function useCreateEventProposalMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateEventProposalMutation, CreateEventProposalMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateEventProposalMutation, CreateEventProposalMutationVariables>(CreateEventProposalDocument, baseOptions);
      }
export type CreateEventProposalMutationHookResult = ReturnType<typeof useCreateEventProposalMutation>;
export type CreateEventProposalMutationResult = ApolloReactCommon.MutationResult<CreateEventProposalMutation>;
export type CreateEventProposalMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateEventProposalMutation, CreateEventProposalMutationVariables>;
export const UpdateEventProposalDocument = gql`
    mutation UpdateEventProposal($input: UpdateEventProposalInput!) {
  updateEventProposal(input: $input) {
    event_proposal {
      id
      ...EventProposalFields
    }
  }
}
    ${EventProposalFieldsFragmentDoc}`;
export type UpdateEventProposalMutationFn = ApolloReactCommon.MutationFunction<UpdateEventProposalMutation, UpdateEventProposalMutationVariables>;

/**
 * __useUpdateEventProposalMutation__
 *
 * To run a mutation, you first call `useUpdateEventProposalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEventProposalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEventProposalMutation, { data, loading, error }] = useUpdateEventProposalMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateEventProposalMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateEventProposalMutation, UpdateEventProposalMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateEventProposalMutation, UpdateEventProposalMutationVariables>(UpdateEventProposalDocument, baseOptions);
      }
export type UpdateEventProposalMutationHookResult = ReturnType<typeof useUpdateEventProposalMutation>;
export type UpdateEventProposalMutationResult = ApolloReactCommon.MutationResult<UpdateEventProposalMutation>;
export type UpdateEventProposalMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateEventProposalMutation, UpdateEventProposalMutationVariables>;
export const DeleteEventProposalDocument = gql`
    mutation DeleteEventProposal($id: Int!) {
  deleteEventProposal(input: {id: $id}) {
    clientMutationId
  }
}
    `;
export type DeleteEventProposalMutationFn = ApolloReactCommon.MutationFunction<DeleteEventProposalMutation, DeleteEventProposalMutationVariables>;

/**
 * __useDeleteEventProposalMutation__
 *
 * To run a mutation, you first call `useDeleteEventProposalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEventProposalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEventProposalMutation, { data, loading, error }] = useDeleteEventProposalMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteEventProposalMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteEventProposalMutation, DeleteEventProposalMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteEventProposalMutation, DeleteEventProposalMutationVariables>(DeleteEventProposalDocument, baseOptions);
      }
export type DeleteEventProposalMutationHookResult = ReturnType<typeof useDeleteEventProposalMutation>;
export type DeleteEventProposalMutationResult = ApolloReactCommon.MutationResult<DeleteEventProposalMutation>;
export type DeleteEventProposalMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteEventProposalMutation, DeleteEventProposalMutationVariables>;
export const SubmitEventProposalDocument = gql`
    mutation SubmitEventProposal($input: SubmitEventProposalInput!) {
  submitEventProposal(input: $input) {
    event_proposal {
      id
      ...EventProposalFields
    }
  }
}
    ${EventProposalFieldsFragmentDoc}`;
export type SubmitEventProposalMutationFn = ApolloReactCommon.MutationFunction<SubmitEventProposalMutation, SubmitEventProposalMutationVariables>;

/**
 * __useSubmitEventProposalMutation__
 *
 * To run a mutation, you first call `useSubmitEventProposalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubmitEventProposalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [submitEventProposalMutation, { data, loading, error }] = useSubmitEventProposalMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSubmitEventProposalMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SubmitEventProposalMutation, SubmitEventProposalMutationVariables>) {
        return ApolloReactHooks.useMutation<SubmitEventProposalMutation, SubmitEventProposalMutationVariables>(SubmitEventProposalDocument, baseOptions);
      }
export type SubmitEventProposalMutationHookResult = ReturnType<typeof useSubmitEventProposalMutation>;
export type SubmitEventProposalMutationResult = ApolloReactCommon.MutationResult<SubmitEventProposalMutation>;
export type SubmitEventProposalMutationOptions = ApolloReactCommon.BaseMutationOptions<SubmitEventProposalMutation, SubmitEventProposalMutationVariables>;
export const TransitionEventProposalDocument = gql`
    mutation TransitionEventProposal($eventProposalId: Int!, $status: String!, $dropEvent: Boolean) {
  transitionEventProposal(input: {id: $eventProposalId, status: $status, drop_event: $dropEvent}) {
    event_proposal {
      id
      ...EventProposalFields
    }
  }
}
    ${EventProposalFieldsFragmentDoc}`;
export type TransitionEventProposalMutationFn = ApolloReactCommon.MutationFunction<TransitionEventProposalMutation, TransitionEventProposalMutationVariables>;

/**
 * __useTransitionEventProposalMutation__
 *
 * To run a mutation, you first call `useTransitionEventProposalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTransitionEventProposalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [transitionEventProposalMutation, { data, loading, error }] = useTransitionEventProposalMutation({
 *   variables: {
 *      eventProposalId: // value for 'eventProposalId'
 *      status: // value for 'status'
 *      dropEvent: // value for 'dropEvent'
 *   },
 * });
 */
export function useTransitionEventProposalMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<TransitionEventProposalMutation, TransitionEventProposalMutationVariables>) {
        return ApolloReactHooks.useMutation<TransitionEventProposalMutation, TransitionEventProposalMutationVariables>(TransitionEventProposalDocument, baseOptions);
      }
export type TransitionEventProposalMutationHookResult = ReturnType<typeof useTransitionEventProposalMutation>;
export type TransitionEventProposalMutationResult = ApolloReactCommon.MutationResult<TransitionEventProposalMutation>;
export type TransitionEventProposalMutationOptions = ApolloReactCommon.BaseMutationOptions<TransitionEventProposalMutation, TransitionEventProposalMutationVariables>;
export const UpdateEventProposalAdminNotesDocument = gql`
    mutation UpdateEventProposalAdminNotes($eventProposalId: Int!, $adminNotes: String!) {
  updateEventProposalAdminNotes(input: {id: $eventProposalId, admin_notes: $adminNotes}) {
    event_proposal {
      id
      ...EventProposalFields
    }
  }
}
    ${EventProposalFieldsFragmentDoc}`;
export type UpdateEventProposalAdminNotesMutationFn = ApolloReactCommon.MutationFunction<UpdateEventProposalAdminNotesMutation, UpdateEventProposalAdminNotesMutationVariables>;

/**
 * __useUpdateEventProposalAdminNotesMutation__
 *
 * To run a mutation, you first call `useUpdateEventProposalAdminNotesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEventProposalAdminNotesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEventProposalAdminNotesMutation, { data, loading, error }] = useUpdateEventProposalAdminNotesMutation({
 *   variables: {
 *      eventProposalId: // value for 'eventProposalId'
 *      adminNotes: // value for 'adminNotes'
 *   },
 * });
 */
export function useUpdateEventProposalAdminNotesMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateEventProposalAdminNotesMutation, UpdateEventProposalAdminNotesMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateEventProposalAdminNotesMutation, UpdateEventProposalAdminNotesMutationVariables>(UpdateEventProposalAdminNotesDocument, baseOptions);
      }
export type UpdateEventProposalAdminNotesMutationHookResult = ReturnType<typeof useUpdateEventProposalAdminNotesMutation>;
export type UpdateEventProposalAdminNotesMutationResult = ApolloReactCommon.MutationResult<UpdateEventProposalAdminNotesMutation>;
export type UpdateEventProposalAdminNotesMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateEventProposalAdminNotesMutation, UpdateEventProposalAdminNotesMutationVariables>;