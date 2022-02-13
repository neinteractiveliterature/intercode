/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { EventProposalFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateEventProposalMutationVariables = Types.Exact<{
  cloneEventProposalId?: Types.InputMaybe<Types.Scalars['ID']>;
  eventCategoryId: Types.Scalars['ID'];
}>;


export type CreateEventProposalMutationData = { __typename: 'Mutation', createEventProposal: { __typename: 'CreateEventProposalPayload', event_proposal: { __typename: 'EventProposal', id: string } } };

export type UpdateEventProposalMutationVariables = Types.Exact<{
  input: Types.UpdateEventProposalInput;
}>;


export type UpdateEventProposalMutationData = { __typename: 'Mutation', updateEventProposal: { __typename: 'UpdateEventProposalPayload', event_proposal: { __typename: 'EventProposal', id: string, title?: string | null, status: string, form_response_attrs_json?: string | null, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, images: Array<{ __typename: 'ActiveStorageAttachment', id: string, filename: string, url: string, content_type: string, byte_size: number }>, event_category: { __typename: 'EventCategory', id: string, name: string, event_proposal_form?: { __typename: 'Form', id: string, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: string, title?: string | null, position: number, form_items: Array<{ __typename: 'FormItem', id: string, admin_description?: string | null, position: number, identifier?: string | null, item_type: string, rendered_properties: string, default_value?: string | null, visibility: Types.FormItemRole, writeability: Types.FormItemRole }> }> } | null }, event?: { __typename: 'Event', id: string } | null } } };

export type AttachImageToEventProposalMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  signedBlobId: Types.Scalars['ID'];
}>;


export type AttachImageToEventProposalMutationData = { __typename: 'Mutation', attachImageToEventProposal: { __typename: 'AttachImageToEventProposalPayload', attachment: { __typename: 'ActiveStorageAttachment', id: string, filename: string, url: string, content_type: string, byte_size: number } } };

export type DeleteEventProposalMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DeleteEventProposalMutationData = { __typename: 'Mutation', deleteEventProposal: { __typename: 'DeleteEventProposalPayload', clientMutationId?: string | null } };

export type SubmitEventProposalMutationVariables = Types.Exact<{
  input: Types.SubmitEventProposalInput;
}>;


export type SubmitEventProposalMutationData = { __typename: 'Mutation', submitEventProposal: { __typename: 'SubmitEventProposalPayload', event_proposal: { __typename: 'EventProposal', id: string, title?: string | null, status: string, form_response_attrs_json?: string | null, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, images: Array<{ __typename: 'ActiveStorageAttachment', id: string, filename: string, url: string, content_type: string, byte_size: number }>, event_category: { __typename: 'EventCategory', id: string, name: string, event_proposal_form?: { __typename: 'Form', id: string, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: string, title?: string | null, position: number, form_items: Array<{ __typename: 'FormItem', id: string, admin_description?: string | null, position: number, identifier?: string | null, item_type: string, rendered_properties: string, default_value?: string | null, visibility: Types.FormItemRole, writeability: Types.FormItemRole }> }> } | null }, event?: { __typename: 'Event', id: string } | null } } };

export type TransitionEventProposalMutationVariables = Types.Exact<{
  eventProposalId: Types.Scalars['ID'];
  status: Types.Scalars['String'];
  dropEvent?: Types.InputMaybe<Types.Scalars['Boolean']>;
}>;


export type TransitionEventProposalMutationData = { __typename: 'Mutation', transitionEventProposal: { __typename: 'TransitionEventProposalPayload', event_proposal: { __typename: 'EventProposal', id: string, title?: string | null, status: string, form_response_attrs_json?: string | null, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, images: Array<{ __typename: 'ActiveStorageAttachment', id: string, filename: string, url: string, content_type: string, byte_size: number }>, event_category: { __typename: 'EventCategory', id: string, name: string, event_proposal_form?: { __typename: 'Form', id: string, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: string, title?: string | null, position: number, form_items: Array<{ __typename: 'FormItem', id: string, admin_description?: string | null, position: number, identifier?: string | null, item_type: string, rendered_properties: string, default_value?: string | null, visibility: Types.FormItemRole, writeability: Types.FormItemRole }> }> } | null }, event?: { __typename: 'Event', id: string } | null } } };

export type UpdateEventProposalAdminNotesMutationVariables = Types.Exact<{
  eventProposalId: Types.Scalars['ID'];
  adminNotes: Types.Scalars['String'];
}>;


export type UpdateEventProposalAdminNotesMutationData = { __typename: 'Mutation', updateEventProposalAdminNotes: { __typename: 'UpdateEventProposalAdminNotesPayload', event_proposal: { __typename: 'EventProposal', id: string, title?: string | null, status: string, form_response_attrs_json?: string | null, current_user_form_item_viewer_role: Types.FormItemRole, current_user_form_item_writer_role: Types.FormItemRole, images: Array<{ __typename: 'ActiveStorageAttachment', id: string, filename: string, url: string, content_type: string, byte_size: number }>, event_category: { __typename: 'EventCategory', id: string, name: string, event_proposal_form?: { __typename: 'Form', id: string, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: string, title?: string | null, position: number, form_items: Array<{ __typename: 'FormItem', id: string, admin_description?: string | null, position: number, identifier?: string | null, item_type: string, rendered_properties: string, default_value?: string | null, visibility: Types.FormItemRole, writeability: Types.FormItemRole }> }> } | null }, event?: { __typename: 'Event', id: string } | null } } };


export const CreateEventProposalDocument = gql`
    mutation CreateEventProposal($cloneEventProposalId: ID, $eventCategoryId: ID!) {
  createEventProposal(
    input: {cloneEventProposalId: $cloneEventProposalId, eventCategoryId: $eventCategoryId}
  ) {
    event_proposal {
      id
    }
  }
}
    `;
export type CreateEventProposalMutationFn = Apollo.MutationFunction<CreateEventProposalMutationData, CreateEventProposalMutationVariables>;

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
export function useCreateEventProposalMutation(baseOptions?: Apollo.MutationHookOptions<CreateEventProposalMutationData, CreateEventProposalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEventProposalMutationData, CreateEventProposalMutationVariables>(CreateEventProposalDocument, options);
      }
export type CreateEventProposalMutationHookResult = ReturnType<typeof useCreateEventProposalMutation>;
export type CreateEventProposalMutationResult = Apollo.MutationResult<CreateEventProposalMutationData>;
export type CreateEventProposalMutationOptions = Apollo.BaseMutationOptions<CreateEventProposalMutationData, CreateEventProposalMutationVariables>;
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
export type UpdateEventProposalMutationFn = Apollo.MutationFunction<UpdateEventProposalMutationData, UpdateEventProposalMutationVariables>;

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
export function useUpdateEventProposalMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEventProposalMutationData, UpdateEventProposalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEventProposalMutationData, UpdateEventProposalMutationVariables>(UpdateEventProposalDocument, options);
      }
export type UpdateEventProposalMutationHookResult = ReturnType<typeof useUpdateEventProposalMutation>;
export type UpdateEventProposalMutationResult = Apollo.MutationResult<UpdateEventProposalMutationData>;
export type UpdateEventProposalMutationOptions = Apollo.BaseMutationOptions<UpdateEventProposalMutationData, UpdateEventProposalMutationVariables>;
export const AttachImageToEventProposalDocument = gql`
    mutation AttachImageToEventProposal($id: ID!, $signedBlobId: ID!) {
  attachImageToEventProposal(input: {id: $id, signedBlobId: $signedBlobId}) {
    attachment {
      id
      filename
      url
      content_type
      byte_size
    }
  }
}
    `;
export type AttachImageToEventProposalMutationFn = Apollo.MutationFunction<AttachImageToEventProposalMutationData, AttachImageToEventProposalMutationVariables>;

/**
 * __useAttachImageToEventProposalMutation__
 *
 * To run a mutation, you first call `useAttachImageToEventProposalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAttachImageToEventProposalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [attachImageToEventProposalMutation, { data, loading, error }] = useAttachImageToEventProposalMutation({
 *   variables: {
 *      id: // value for 'id'
 *      signedBlobId: // value for 'signedBlobId'
 *   },
 * });
 */
export function useAttachImageToEventProposalMutation(baseOptions?: Apollo.MutationHookOptions<AttachImageToEventProposalMutationData, AttachImageToEventProposalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AttachImageToEventProposalMutationData, AttachImageToEventProposalMutationVariables>(AttachImageToEventProposalDocument, options);
      }
export type AttachImageToEventProposalMutationHookResult = ReturnType<typeof useAttachImageToEventProposalMutation>;
export type AttachImageToEventProposalMutationResult = Apollo.MutationResult<AttachImageToEventProposalMutationData>;
export type AttachImageToEventProposalMutationOptions = Apollo.BaseMutationOptions<AttachImageToEventProposalMutationData, AttachImageToEventProposalMutationVariables>;
export const DeleteEventProposalDocument = gql`
    mutation DeleteEventProposal($id: ID!) {
  deleteEventProposal(input: {id: $id}) {
    clientMutationId
  }
}
    `;
export type DeleteEventProposalMutationFn = Apollo.MutationFunction<DeleteEventProposalMutationData, DeleteEventProposalMutationVariables>;

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
export function useDeleteEventProposalMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEventProposalMutationData, DeleteEventProposalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEventProposalMutationData, DeleteEventProposalMutationVariables>(DeleteEventProposalDocument, options);
      }
export type DeleteEventProposalMutationHookResult = ReturnType<typeof useDeleteEventProposalMutation>;
export type DeleteEventProposalMutationResult = Apollo.MutationResult<DeleteEventProposalMutationData>;
export type DeleteEventProposalMutationOptions = Apollo.BaseMutationOptions<DeleteEventProposalMutationData, DeleteEventProposalMutationVariables>;
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
export type SubmitEventProposalMutationFn = Apollo.MutationFunction<SubmitEventProposalMutationData, SubmitEventProposalMutationVariables>;

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
export function useSubmitEventProposalMutation(baseOptions?: Apollo.MutationHookOptions<SubmitEventProposalMutationData, SubmitEventProposalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubmitEventProposalMutationData, SubmitEventProposalMutationVariables>(SubmitEventProposalDocument, options);
      }
export type SubmitEventProposalMutationHookResult = ReturnType<typeof useSubmitEventProposalMutation>;
export type SubmitEventProposalMutationResult = Apollo.MutationResult<SubmitEventProposalMutationData>;
export type SubmitEventProposalMutationOptions = Apollo.BaseMutationOptions<SubmitEventProposalMutationData, SubmitEventProposalMutationVariables>;
export const TransitionEventProposalDocument = gql`
    mutation TransitionEventProposal($eventProposalId: ID!, $status: String!, $dropEvent: Boolean) {
  transitionEventProposal(
    input: {id: $eventProposalId, status: $status, drop_event: $dropEvent}
  ) {
    event_proposal {
      id
      ...EventProposalFields
    }
  }
}
    ${EventProposalFieldsFragmentDoc}`;
export type TransitionEventProposalMutationFn = Apollo.MutationFunction<TransitionEventProposalMutationData, TransitionEventProposalMutationVariables>;

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
export function useTransitionEventProposalMutation(baseOptions?: Apollo.MutationHookOptions<TransitionEventProposalMutationData, TransitionEventProposalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TransitionEventProposalMutationData, TransitionEventProposalMutationVariables>(TransitionEventProposalDocument, options);
      }
export type TransitionEventProposalMutationHookResult = ReturnType<typeof useTransitionEventProposalMutation>;
export type TransitionEventProposalMutationResult = Apollo.MutationResult<TransitionEventProposalMutationData>;
export type TransitionEventProposalMutationOptions = Apollo.BaseMutationOptions<TransitionEventProposalMutationData, TransitionEventProposalMutationVariables>;
export const UpdateEventProposalAdminNotesDocument = gql`
    mutation UpdateEventProposalAdminNotes($eventProposalId: ID!, $adminNotes: String!) {
  updateEventProposalAdminNotes(
    input: {id: $eventProposalId, admin_notes: $adminNotes}
  ) {
    event_proposal {
      id
      ...EventProposalFields
    }
  }
}
    ${EventProposalFieldsFragmentDoc}`;
export type UpdateEventProposalAdminNotesMutationFn = Apollo.MutationFunction<UpdateEventProposalAdminNotesMutationData, UpdateEventProposalAdminNotesMutationVariables>;

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
export function useUpdateEventProposalAdminNotesMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEventProposalAdminNotesMutationData, UpdateEventProposalAdminNotesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEventProposalAdminNotesMutationData, UpdateEventProposalAdminNotesMutationVariables>(UpdateEventProposalAdminNotesDocument, options);
      }
export type UpdateEventProposalAdminNotesMutationHookResult = ReturnType<typeof useUpdateEventProposalAdminNotesMutation>;
export type UpdateEventProposalAdminNotesMutationResult = Apollo.MutationResult<UpdateEventProposalAdminNotesMutationData>;
export type UpdateEventProposalAdminNotesMutationOptions = Apollo.BaseMutationOptions<UpdateEventProposalAdminNotesMutationData, UpdateEventProposalAdminNotesMutationVariables>;