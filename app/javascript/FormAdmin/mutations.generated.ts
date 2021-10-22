/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { FormFieldsFragmentDoc } from './queries.generated';
import { FormEditorDataFragmentDoc } from './queries.generated';
import { FormEditorFormSectionFieldsFragmentDoc } from './queries.generated';
import { FormEditorFormItemFieldsFragmentDoc } from './queries.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CreateFormWithJsonMutationVariables = Types.Exact<{
  formJSON: Types.Scalars['String'];
  formType: Types.FormType;
}>;


export type CreateFormWithJsonMutationData = { __typename: 'Mutation', createFormWithJSON: { __typename: 'CreateFormWithJSONPayload', form: { __typename: 'Form', id: string, title: string, form_type: Types.FormType, export_json: string, event_categories: Array<{ __typename: 'EventCategory', id: string, name: string }>, proposal_event_categories: Array<{ __typename: 'EventCategory', id: string, name: string }>, user_con_profile_conventions: Array<{ __typename: 'Convention', id: string, name: string }> } } };

export type UpdateFormWithJsonMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  formJSON: Types.Scalars['String'];
}>;


export type UpdateFormWithJsonMutationData = { __typename: 'Mutation', updateFormWithJSON: { __typename: 'UpdateFormWithJSONPayload', form: { __typename: 'Form', id: string, title: string, form_type: Types.FormType, export_json: string, event_categories: Array<{ __typename: 'EventCategory', id: string, name: string }>, proposal_event_categories: Array<{ __typename: 'EventCategory', id: string, name: string }>, user_con_profile_conventions: Array<{ __typename: 'Convention', id: string, name: string }> } } };

export type CreateFormMutationVariables = Types.Exact<{
  form: Types.FormInput;
  formType: Types.FormType;
}>;


export type CreateFormMutationData = { __typename: 'Mutation', createForm: { __typename: 'CreateFormPayload', form: { __typename: 'Form', id: string, title: string, form_type: Types.FormType, export_json: string, event_categories: Array<{ __typename: 'EventCategory', id: string, name: string }>, proposal_event_categories: Array<{ __typename: 'EventCategory', id: string, name: string }>, user_con_profile_conventions: Array<{ __typename: 'Convention', id: string, name: string }> } } };

export type UpdateFormMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  form: Types.FormInput;
}>;


export type UpdateFormMutationData = { __typename: 'Mutation', updateForm: { __typename: 'UpdateFormPayload', form: { __typename: 'Form', id: string, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: string, title?: string | null | undefined, position: number, form_items: Array<{ __typename: 'FormItem', id: string, admin_description?: string | null | undefined, public_description?: string | null | undefined, properties: string, position: number, identifier?: string | null | undefined, item_type: string, rendered_properties: string, default_value?: string | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole }> }> } } };

export type DeleteFormMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DeleteFormMutationData = { __typename: 'Mutation', deleteForm: { __typename: 'DeleteFormPayload', clientMutationId?: string | null | undefined } };

export type CreateFormSectionMutationVariables = Types.Exact<{
  formId: Types.Scalars['ID'];
  formSection: Types.FormSectionInput;
}>;


export type CreateFormSectionMutationData = { __typename: 'Mutation', createFormSection: { __typename: 'CreateFormSectionPayload', form_section: { __typename: 'FormSection', id: string, title?: string | null | undefined, position: number, form_items: Array<{ __typename: 'FormItem', id: string, admin_description?: string | null | undefined, public_description?: string | null | undefined, properties: string, position: number, identifier?: string | null | undefined, item_type: string, rendered_properties: string, default_value?: string | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole }> } } };

export type UpdateFormSectionMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  formSection: Types.FormSectionInput;
}>;


export type UpdateFormSectionMutationData = { __typename: 'Mutation', updateFormSection: { __typename: 'UpdateFormSectionPayload', form_section: { __typename: 'FormSection', id: string, title?: string | null | undefined, position: number, form_items: Array<{ __typename: 'FormItem', id: string, admin_description?: string | null | undefined, public_description?: string | null | undefined, properties: string, position: number, identifier?: string | null | undefined, item_type: string, rendered_properties: string, default_value?: string | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole }> } } };

export type DeleteFormSectionMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DeleteFormSectionMutationData = { __typename: 'Mutation', deleteFormSection: { __typename: 'DeleteFormSectionPayload', clientMutationId?: string | null | undefined } };

export type MoveFormSectionMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  destinationIndex: Types.Scalars['Int'];
}>;


export type MoveFormSectionMutationData = { __typename: 'Mutation', moveFormSection: { __typename: 'MoveFormSectionPayload', form: { __typename: 'Form', id: string, title: string, form_type: Types.FormType, form_sections: Array<{ __typename: 'FormSection', id: string, title?: string | null | undefined, position: number, form_items: Array<{ __typename: 'FormItem', id: string, admin_description?: string | null | undefined, public_description?: string | null | undefined, properties: string, position: number, identifier?: string | null | undefined, item_type: string, rendered_properties: string, default_value?: string | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole }> }> } } };

export type CreateFormItemMutationVariables = Types.Exact<{
  formSectionId: Types.Scalars['ID'];
  formItem: Types.FormItemInput;
}>;


export type CreateFormItemMutationData = { __typename: 'Mutation', createFormItem: { __typename: 'CreateFormItemPayload', form_item: { __typename: 'FormItem', id: string, admin_description?: string | null | undefined, public_description?: string | null | undefined, properties: string, position: number, identifier?: string | null | undefined, item_type: string, rendered_properties: string, default_value?: string | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole } } };

export type UpdateFormItemMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  formItem: Types.FormItemInput;
}>;


export type UpdateFormItemMutationData = { __typename: 'Mutation', updateFormItem: { __typename: 'UpdateFormItemPayload', form_item: { __typename: 'FormItem', id: string, admin_description?: string | null | undefined, public_description?: string | null | undefined, properties: string, position: number, identifier?: string | null | undefined, item_type: string, rendered_properties: string, default_value?: string | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole } } };

export type DeleteFormItemMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DeleteFormItemMutationData = { __typename: 'Mutation', deleteFormItem: { __typename: 'DeleteFormItemPayload', clientMutationId?: string | null | undefined } };

export type MoveFormItemMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  formSectionId: Types.Scalars['ID'];
  destinationIndex?: Types.Maybe<Types.Scalars['Int']>;
}>;


export type MoveFormItemMutationData = { __typename: 'Mutation', moveFormItem: { __typename: 'MoveFormItemPayload', form_section: { __typename: 'FormSection', id: string, form_items: Array<{ __typename: 'FormItem', id: string, admin_description?: string | null | undefined, public_description?: string | null | undefined, properties: string, position: number, identifier?: string | null | undefined, item_type: string, rendered_properties: string, default_value?: string | null | undefined, visibility: Types.FormItemRole, writeability: Types.FormItemRole }> } } };


export const CreateFormWithJsonDocument = gql`
    mutation CreateFormWithJSON($formJSON: String!, $formType: FormType!) {
  createFormWithJSON(input: {form_json: $formJSON, form_type: $formType}) {
    form {
      id
      ...FormFields
    }
  }
}
    ${FormFieldsFragmentDoc}`;
export type CreateFormWithJsonMutationFn = Apollo.MutationFunction<CreateFormWithJsonMutationData, CreateFormWithJsonMutationVariables>;

/**
 * __useCreateFormWithJsonMutation__
 *
 * To run a mutation, you first call `useCreateFormWithJsonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFormWithJsonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFormWithJsonMutation, { data, loading, error }] = useCreateFormWithJsonMutation({
 *   variables: {
 *      formJSON: // value for 'formJSON'
 *      formType: // value for 'formType'
 *   },
 * });
 */
export function useCreateFormWithJsonMutation(baseOptions?: Apollo.MutationHookOptions<CreateFormWithJsonMutationData, CreateFormWithJsonMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateFormWithJsonMutationData, CreateFormWithJsonMutationVariables>(CreateFormWithJsonDocument, options);
      }
export type CreateFormWithJsonMutationHookResult = ReturnType<typeof useCreateFormWithJsonMutation>;
export type CreateFormWithJsonMutationResult = Apollo.MutationResult<CreateFormWithJsonMutationData>;
export type CreateFormWithJsonMutationOptions = Apollo.BaseMutationOptions<CreateFormWithJsonMutationData, CreateFormWithJsonMutationVariables>;
export const UpdateFormWithJsonDocument = gql`
    mutation UpdateFormWithJSON($id: ID!, $formJSON: String!) {
  updateFormWithJSON(input: {transitionalId: $id, form_json: $formJSON}) {
    form {
      id
      ...FormFields
    }
  }
}
    ${FormFieldsFragmentDoc}`;
export type UpdateFormWithJsonMutationFn = Apollo.MutationFunction<UpdateFormWithJsonMutationData, UpdateFormWithJsonMutationVariables>;

/**
 * __useUpdateFormWithJsonMutation__
 *
 * To run a mutation, you first call `useUpdateFormWithJsonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFormWithJsonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFormWithJsonMutation, { data, loading, error }] = useUpdateFormWithJsonMutation({
 *   variables: {
 *      id: // value for 'id'
 *      formJSON: // value for 'formJSON'
 *   },
 * });
 */
export function useUpdateFormWithJsonMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFormWithJsonMutationData, UpdateFormWithJsonMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateFormWithJsonMutationData, UpdateFormWithJsonMutationVariables>(UpdateFormWithJsonDocument, options);
      }
export type UpdateFormWithJsonMutationHookResult = ReturnType<typeof useUpdateFormWithJsonMutation>;
export type UpdateFormWithJsonMutationResult = Apollo.MutationResult<UpdateFormWithJsonMutationData>;
export type UpdateFormWithJsonMutationOptions = Apollo.BaseMutationOptions<UpdateFormWithJsonMutationData, UpdateFormWithJsonMutationVariables>;
export const CreateFormDocument = gql`
    mutation CreateForm($form: FormInput!, $formType: FormType!) {
  createForm(input: {form: $form, form_type: $formType}) {
    form {
      id
      ...FormFields
    }
  }
}
    ${FormFieldsFragmentDoc}`;
export type CreateFormMutationFn = Apollo.MutationFunction<CreateFormMutationData, CreateFormMutationVariables>;

/**
 * __useCreateFormMutation__
 *
 * To run a mutation, you first call `useCreateFormMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFormMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFormMutation, { data, loading, error }] = useCreateFormMutation({
 *   variables: {
 *      form: // value for 'form'
 *      formType: // value for 'formType'
 *   },
 * });
 */
export function useCreateFormMutation(baseOptions?: Apollo.MutationHookOptions<CreateFormMutationData, CreateFormMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateFormMutationData, CreateFormMutationVariables>(CreateFormDocument, options);
      }
export type CreateFormMutationHookResult = ReturnType<typeof useCreateFormMutation>;
export type CreateFormMutationResult = Apollo.MutationResult<CreateFormMutationData>;
export type CreateFormMutationOptions = Apollo.BaseMutationOptions<CreateFormMutationData, CreateFormMutationVariables>;
export const UpdateFormDocument = gql`
    mutation UpdateForm($id: ID!, $form: FormInput!) {
  updateForm(input: {transitionalId: $id, form: $form}) {
    form {
      id
      ...FormEditorData
    }
  }
}
    ${FormEditorDataFragmentDoc}`;
export type UpdateFormMutationFn = Apollo.MutationFunction<UpdateFormMutationData, UpdateFormMutationVariables>;

/**
 * __useUpdateFormMutation__
 *
 * To run a mutation, you first call `useUpdateFormMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFormMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFormMutation, { data, loading, error }] = useUpdateFormMutation({
 *   variables: {
 *      id: // value for 'id'
 *      form: // value for 'form'
 *   },
 * });
 */
export function useUpdateFormMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFormMutationData, UpdateFormMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateFormMutationData, UpdateFormMutationVariables>(UpdateFormDocument, options);
      }
export type UpdateFormMutationHookResult = ReturnType<typeof useUpdateFormMutation>;
export type UpdateFormMutationResult = Apollo.MutationResult<UpdateFormMutationData>;
export type UpdateFormMutationOptions = Apollo.BaseMutationOptions<UpdateFormMutationData, UpdateFormMutationVariables>;
export const DeleteFormDocument = gql`
    mutation DeleteForm($id: ID!) {
  deleteForm(input: {transitionalId: $id}) {
    clientMutationId
  }
}
    `;
export type DeleteFormMutationFn = Apollo.MutationFunction<DeleteFormMutationData, DeleteFormMutationVariables>;

/**
 * __useDeleteFormMutation__
 *
 * To run a mutation, you first call `useDeleteFormMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFormMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFormMutation, { data, loading, error }] = useDeleteFormMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteFormMutation(baseOptions?: Apollo.MutationHookOptions<DeleteFormMutationData, DeleteFormMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteFormMutationData, DeleteFormMutationVariables>(DeleteFormDocument, options);
      }
export type DeleteFormMutationHookResult = ReturnType<typeof useDeleteFormMutation>;
export type DeleteFormMutationResult = Apollo.MutationResult<DeleteFormMutationData>;
export type DeleteFormMutationOptions = Apollo.BaseMutationOptions<DeleteFormMutationData, DeleteFormMutationVariables>;
export const CreateFormSectionDocument = gql`
    mutation CreateFormSection($formId: ID!, $formSection: FormSectionInput!) {
  createFormSection(
    input: {transitionalFormId: $formId, form_section: $formSection}
  ) {
    form_section {
      id
      ...FormEditorFormSectionFields
    }
  }
}
    ${FormEditorFormSectionFieldsFragmentDoc}`;
export type CreateFormSectionMutationFn = Apollo.MutationFunction<CreateFormSectionMutationData, CreateFormSectionMutationVariables>;

/**
 * __useCreateFormSectionMutation__
 *
 * To run a mutation, you first call `useCreateFormSectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFormSectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFormSectionMutation, { data, loading, error }] = useCreateFormSectionMutation({
 *   variables: {
 *      formId: // value for 'formId'
 *      formSection: // value for 'formSection'
 *   },
 * });
 */
export function useCreateFormSectionMutation(baseOptions?: Apollo.MutationHookOptions<CreateFormSectionMutationData, CreateFormSectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateFormSectionMutationData, CreateFormSectionMutationVariables>(CreateFormSectionDocument, options);
      }
export type CreateFormSectionMutationHookResult = ReturnType<typeof useCreateFormSectionMutation>;
export type CreateFormSectionMutationResult = Apollo.MutationResult<CreateFormSectionMutationData>;
export type CreateFormSectionMutationOptions = Apollo.BaseMutationOptions<CreateFormSectionMutationData, CreateFormSectionMutationVariables>;
export const UpdateFormSectionDocument = gql`
    mutation UpdateFormSection($id: ID!, $formSection: FormSectionInput!) {
  updateFormSection(input: {transitionalId: $id, form_section: $formSection}) {
    form_section {
      id
      ...FormEditorFormSectionFields
    }
  }
}
    ${FormEditorFormSectionFieldsFragmentDoc}`;
export type UpdateFormSectionMutationFn = Apollo.MutationFunction<UpdateFormSectionMutationData, UpdateFormSectionMutationVariables>;

/**
 * __useUpdateFormSectionMutation__
 *
 * To run a mutation, you first call `useUpdateFormSectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFormSectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFormSectionMutation, { data, loading, error }] = useUpdateFormSectionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      formSection: // value for 'formSection'
 *   },
 * });
 */
export function useUpdateFormSectionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFormSectionMutationData, UpdateFormSectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateFormSectionMutationData, UpdateFormSectionMutationVariables>(UpdateFormSectionDocument, options);
      }
export type UpdateFormSectionMutationHookResult = ReturnType<typeof useUpdateFormSectionMutation>;
export type UpdateFormSectionMutationResult = Apollo.MutationResult<UpdateFormSectionMutationData>;
export type UpdateFormSectionMutationOptions = Apollo.BaseMutationOptions<UpdateFormSectionMutationData, UpdateFormSectionMutationVariables>;
export const DeleteFormSectionDocument = gql`
    mutation DeleteFormSection($id: ID!) {
  deleteFormSection(input: {transitionalId: $id}) {
    clientMutationId
  }
}
    `;
export type DeleteFormSectionMutationFn = Apollo.MutationFunction<DeleteFormSectionMutationData, DeleteFormSectionMutationVariables>;

/**
 * __useDeleteFormSectionMutation__
 *
 * To run a mutation, you first call `useDeleteFormSectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFormSectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFormSectionMutation, { data, loading, error }] = useDeleteFormSectionMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteFormSectionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteFormSectionMutationData, DeleteFormSectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteFormSectionMutationData, DeleteFormSectionMutationVariables>(DeleteFormSectionDocument, options);
      }
export type DeleteFormSectionMutationHookResult = ReturnType<typeof useDeleteFormSectionMutation>;
export type DeleteFormSectionMutationResult = Apollo.MutationResult<DeleteFormSectionMutationData>;
export type DeleteFormSectionMutationOptions = Apollo.BaseMutationOptions<DeleteFormSectionMutationData, DeleteFormSectionMutationVariables>;
export const MoveFormSectionDocument = gql`
    mutation MoveFormSection($id: ID!, $destinationIndex: Int!) {
  moveFormSection(
    input: {transitionalId: $id, destination_index: $destinationIndex}
  ) {
    form {
      id
      ...FormEditorData
    }
  }
}
    ${FormEditorDataFragmentDoc}`;
export type MoveFormSectionMutationFn = Apollo.MutationFunction<MoveFormSectionMutationData, MoveFormSectionMutationVariables>;

/**
 * __useMoveFormSectionMutation__
 *
 * To run a mutation, you first call `useMoveFormSectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMoveFormSectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [moveFormSectionMutation, { data, loading, error }] = useMoveFormSectionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      destinationIndex: // value for 'destinationIndex'
 *   },
 * });
 */
export function useMoveFormSectionMutation(baseOptions?: Apollo.MutationHookOptions<MoveFormSectionMutationData, MoveFormSectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MoveFormSectionMutationData, MoveFormSectionMutationVariables>(MoveFormSectionDocument, options);
      }
export type MoveFormSectionMutationHookResult = ReturnType<typeof useMoveFormSectionMutation>;
export type MoveFormSectionMutationResult = Apollo.MutationResult<MoveFormSectionMutationData>;
export type MoveFormSectionMutationOptions = Apollo.BaseMutationOptions<MoveFormSectionMutationData, MoveFormSectionMutationVariables>;
export const CreateFormItemDocument = gql`
    mutation CreateFormItem($formSectionId: ID!, $formItem: FormItemInput!) {
  createFormItem(
    input: {transitionalFormSectionId: $formSectionId, form_item: $formItem}
  ) {
    form_item {
      id
      ...FormEditorFormItemFields
    }
  }
}
    ${FormEditorFormItemFieldsFragmentDoc}`;
export type CreateFormItemMutationFn = Apollo.MutationFunction<CreateFormItemMutationData, CreateFormItemMutationVariables>;

/**
 * __useCreateFormItemMutation__
 *
 * To run a mutation, you first call `useCreateFormItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFormItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFormItemMutation, { data, loading, error }] = useCreateFormItemMutation({
 *   variables: {
 *      formSectionId: // value for 'formSectionId'
 *      formItem: // value for 'formItem'
 *   },
 * });
 */
export function useCreateFormItemMutation(baseOptions?: Apollo.MutationHookOptions<CreateFormItemMutationData, CreateFormItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateFormItemMutationData, CreateFormItemMutationVariables>(CreateFormItemDocument, options);
      }
export type CreateFormItemMutationHookResult = ReturnType<typeof useCreateFormItemMutation>;
export type CreateFormItemMutationResult = Apollo.MutationResult<CreateFormItemMutationData>;
export type CreateFormItemMutationOptions = Apollo.BaseMutationOptions<CreateFormItemMutationData, CreateFormItemMutationVariables>;
export const UpdateFormItemDocument = gql`
    mutation UpdateFormItem($id: ID!, $formItem: FormItemInput!) {
  updateFormItem(input: {transitionalId: $id, form_item: $formItem}) {
    form_item {
      id
      ...FormEditorFormItemFields
    }
  }
}
    ${FormEditorFormItemFieldsFragmentDoc}`;
export type UpdateFormItemMutationFn = Apollo.MutationFunction<UpdateFormItemMutationData, UpdateFormItemMutationVariables>;

/**
 * __useUpdateFormItemMutation__
 *
 * To run a mutation, you first call `useUpdateFormItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFormItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFormItemMutation, { data, loading, error }] = useUpdateFormItemMutation({
 *   variables: {
 *      id: // value for 'id'
 *      formItem: // value for 'formItem'
 *   },
 * });
 */
export function useUpdateFormItemMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFormItemMutationData, UpdateFormItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateFormItemMutationData, UpdateFormItemMutationVariables>(UpdateFormItemDocument, options);
      }
export type UpdateFormItemMutationHookResult = ReturnType<typeof useUpdateFormItemMutation>;
export type UpdateFormItemMutationResult = Apollo.MutationResult<UpdateFormItemMutationData>;
export type UpdateFormItemMutationOptions = Apollo.BaseMutationOptions<UpdateFormItemMutationData, UpdateFormItemMutationVariables>;
export const DeleteFormItemDocument = gql`
    mutation DeleteFormItem($id: ID!) {
  deleteFormItem(input: {transitionalId: $id}) {
    clientMutationId
  }
}
    `;
export type DeleteFormItemMutationFn = Apollo.MutationFunction<DeleteFormItemMutationData, DeleteFormItemMutationVariables>;

/**
 * __useDeleteFormItemMutation__
 *
 * To run a mutation, you first call `useDeleteFormItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFormItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFormItemMutation, { data, loading, error }] = useDeleteFormItemMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteFormItemMutation(baseOptions?: Apollo.MutationHookOptions<DeleteFormItemMutationData, DeleteFormItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteFormItemMutationData, DeleteFormItemMutationVariables>(DeleteFormItemDocument, options);
      }
export type DeleteFormItemMutationHookResult = ReturnType<typeof useDeleteFormItemMutation>;
export type DeleteFormItemMutationResult = Apollo.MutationResult<DeleteFormItemMutationData>;
export type DeleteFormItemMutationOptions = Apollo.BaseMutationOptions<DeleteFormItemMutationData, DeleteFormItemMutationVariables>;
export const MoveFormItemDocument = gql`
    mutation MoveFormItem($id: ID!, $formSectionId: ID!, $destinationIndex: Int) {
  moveFormItem(
    input: {transitionalId: $id, transitionalFormSectionId: $formSectionId, destination_index: $destinationIndex}
  ) {
    form_section {
      id
      form_items {
        id
        ...FormEditorFormItemFields
      }
    }
  }
}
    ${FormEditorFormItemFieldsFragmentDoc}`;
export type MoveFormItemMutationFn = Apollo.MutationFunction<MoveFormItemMutationData, MoveFormItemMutationVariables>;

/**
 * __useMoveFormItemMutation__
 *
 * To run a mutation, you first call `useMoveFormItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMoveFormItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [moveFormItemMutation, { data, loading, error }] = useMoveFormItemMutation({
 *   variables: {
 *      id: // value for 'id'
 *      formSectionId: // value for 'formSectionId'
 *      destinationIndex: // value for 'destinationIndex'
 *   },
 * });
 */
export function useMoveFormItemMutation(baseOptions?: Apollo.MutationHookOptions<MoveFormItemMutationData, MoveFormItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MoveFormItemMutationData, MoveFormItemMutationVariables>(MoveFormItemDocument, options);
      }
export type MoveFormItemMutationHookResult = ReturnType<typeof useMoveFormItemMutation>;
export type MoveFormItemMutationResult = Apollo.MutationResult<MoveFormItemMutationData>;
export type MoveFormItemMutationOptions = Apollo.BaseMutationOptions<MoveFormItemMutationData, MoveFormItemMutationVariables>;