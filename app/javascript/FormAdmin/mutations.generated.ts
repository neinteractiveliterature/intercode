/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { FormFieldsFragment, FormEditorDataFragment, FormEditorFormItemFieldsFragment } from './queries.generated';
import { CommonFormSectionFieldsFragment } from '../Models/commonFormFragments.generated';
import { gql } from '@apollo/client';
import { FormFieldsFragmentDoc, FormEditorDataFragmentDoc, FormEditorFormItemFieldsFragmentDoc } from './queries.generated';
import { CommonFormSectionFieldsFragmentDoc } from '../Models/commonFormFragments.generated';
import * as Apollo from '@apollo/client';


export type CreateFormWithJsonMutationVariables = Types.Exact<{
  formJSON: Types.Scalars['String'];
  formType: Types.FormType;
}>;


export type CreateFormWithJsonMutation = (
  { __typename?: 'Mutation' }
  & { createFormWithJSON?: Types.Maybe<(
    { __typename?: 'CreateFormWithJSONPayload' }
    & { form: (
      { __typename?: 'Form' }
      & Pick<Types.Form, 'id'>
      & FormFieldsFragment
    ) }
  )> }
);

export type UpdateFormWithJsonMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
  formJSON: Types.Scalars['String'];
}>;


export type UpdateFormWithJsonMutation = (
  { __typename?: 'Mutation' }
  & { updateFormWithJSON?: Types.Maybe<(
    { __typename?: 'UpdateFormWithJSONPayload' }
    & { form: (
      { __typename?: 'Form' }
      & Pick<Types.Form, 'id'>
      & FormFieldsFragment
    ) }
  )> }
);

export type CreateFormMutationVariables = Types.Exact<{
  form: Types.FormInput;
  formType: Types.FormType;
}>;


export type CreateFormMutation = (
  { __typename?: 'Mutation' }
  & { createForm?: Types.Maybe<(
    { __typename?: 'CreateFormPayload' }
    & { form: (
      { __typename?: 'Form' }
      & Pick<Types.Form, 'id'>
      & FormFieldsFragment
    ) }
  )> }
);

export type UpdateFormMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
  form: Types.FormInput;
}>;


export type UpdateFormMutation = (
  { __typename?: 'Mutation' }
  & { updateForm?: Types.Maybe<(
    { __typename?: 'UpdateFormPayload' }
    & { form: (
      { __typename?: 'Form' }
      & Pick<Types.Form, 'id'>
      & FormEditorDataFragment
    ) }
  )> }
);

export type DeleteFormMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type DeleteFormMutation = (
  { __typename?: 'Mutation' }
  & { deleteForm?: Types.Maybe<(
    { __typename?: 'DeleteFormPayload' }
    & Pick<Types.DeleteFormPayload, 'clientMutationId'>
  )> }
);

export type CreateFormSectionMutationVariables = Types.Exact<{
  formId: Types.Scalars['Int'];
  formSection: Types.FormSectionInput;
}>;


export type CreateFormSectionMutation = (
  { __typename?: 'Mutation' }
  & { createFormSection?: Types.Maybe<(
    { __typename?: 'CreateFormSectionPayload' }
    & { form_section: (
      { __typename?: 'FormSection' }
      & Pick<Types.FormSection, 'id'>
      & { form_items: Array<(
        { __typename?: 'FormItem' }
        & Pick<Types.FormItem, 'id'>
        & FormEditorFormItemFieldsFragment
      )> }
      & CommonFormSectionFieldsFragment
    ) }
  )> }
);

export type UpdateFormSectionMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
  formSection: Types.FormSectionInput;
}>;


export type UpdateFormSectionMutation = (
  { __typename?: 'Mutation' }
  & { updateFormSection?: Types.Maybe<(
    { __typename?: 'UpdateFormSectionPayload' }
    & { form_section: (
      { __typename?: 'FormSection' }
      & Pick<Types.FormSection, 'id'>
      & { form_items: Array<(
        { __typename?: 'FormItem' }
        & Pick<Types.FormItem, 'id'>
        & FormEditorFormItemFieldsFragment
      )> }
      & CommonFormSectionFieldsFragment
    ) }
  )> }
);

export type DeleteFormSectionMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type DeleteFormSectionMutation = (
  { __typename?: 'Mutation' }
  & { deleteFormSection?: Types.Maybe<(
    { __typename?: 'DeleteFormSectionPayload' }
    & Pick<Types.DeleteFormSectionPayload, 'clientMutationId'>
  )> }
);

export type MoveFormSectionMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
  destinationIndex: Types.Scalars['Int'];
}>;


export type MoveFormSectionMutation = (
  { __typename?: 'Mutation' }
  & { moveFormSection?: Types.Maybe<(
    { __typename?: 'MoveFormSectionPayload' }
    & { form: (
      { __typename?: 'Form' }
      & Pick<Types.Form, 'id'>
      & FormEditorDataFragment
    ) }
  )> }
);

export type CreateFormItemMutationVariables = Types.Exact<{
  formSectionId: Types.Scalars['Int'];
  formItem: Types.FormItemInput;
}>;


export type CreateFormItemMutation = (
  { __typename?: 'Mutation' }
  & { createFormItem?: Types.Maybe<(
    { __typename?: 'CreateFormItemPayload' }
    & { form_item: (
      { __typename?: 'FormItem' }
      & Pick<Types.FormItem, 'id'>
      & FormEditorFormItemFieldsFragment
    ) }
  )> }
);

export type UpdateFormItemMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
  formItem: Types.FormItemInput;
}>;


export type UpdateFormItemMutation = (
  { __typename?: 'Mutation' }
  & { updateFormItem?: Types.Maybe<(
    { __typename?: 'UpdateFormItemPayload' }
    & { form_item: (
      { __typename?: 'FormItem' }
      & Pick<Types.FormItem, 'id'>
      & FormEditorFormItemFieldsFragment
    ) }
  )> }
);

export type DeleteFormItemMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type DeleteFormItemMutation = (
  { __typename?: 'Mutation' }
  & { deleteFormItem?: Types.Maybe<(
    { __typename?: 'DeleteFormItemPayload' }
    & Pick<Types.DeleteFormItemPayload, 'clientMutationId'>
  )> }
);

export type MoveFormItemMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
  formSectionId: Types.Scalars['Int'];
  destinationIndex?: Types.Maybe<Types.Scalars['Int']>;
}>;


export type MoveFormItemMutation = (
  { __typename?: 'Mutation' }
  & { moveFormItem?: Types.Maybe<(
    { __typename?: 'MoveFormItemPayload' }
    & { form_section: (
      { __typename?: 'FormSection' }
      & Pick<Types.FormSection, 'id'>
      & { form_items: Array<(
        { __typename?: 'FormItem' }
        & Pick<Types.FormItem, 'id'>
        & FormEditorFormItemFieldsFragment
      )> }
    ) }
  )> }
);


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
export type CreateFormWithJsonMutationFn = Apollo.MutationFunction<CreateFormWithJsonMutation, CreateFormWithJsonMutationVariables>;

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
export function useCreateFormWithJsonMutation(baseOptions?: Apollo.MutationHookOptions<CreateFormWithJsonMutation, CreateFormWithJsonMutationVariables>) {
        return Apollo.useMutation<CreateFormWithJsonMutation, CreateFormWithJsonMutationVariables>(CreateFormWithJsonDocument, baseOptions);
      }
export type CreateFormWithJsonMutationHookResult = ReturnType<typeof useCreateFormWithJsonMutation>;
export type CreateFormWithJsonMutationResult = Apollo.MutationResult<CreateFormWithJsonMutation>;
export type CreateFormWithJsonMutationOptions = Apollo.BaseMutationOptions<CreateFormWithJsonMutation, CreateFormWithJsonMutationVariables>;
export const UpdateFormWithJsonDocument = gql`
    mutation UpdateFormWithJSON($id: Int!, $formJSON: String!) {
  updateFormWithJSON(input: {id: $id, form_json: $formJSON}) {
    form {
      id
      ...FormFields
    }
  }
}
    ${FormFieldsFragmentDoc}`;
export type UpdateFormWithJsonMutationFn = Apollo.MutationFunction<UpdateFormWithJsonMutation, UpdateFormWithJsonMutationVariables>;

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
export function useUpdateFormWithJsonMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFormWithJsonMutation, UpdateFormWithJsonMutationVariables>) {
        return Apollo.useMutation<UpdateFormWithJsonMutation, UpdateFormWithJsonMutationVariables>(UpdateFormWithJsonDocument, baseOptions);
      }
export type UpdateFormWithJsonMutationHookResult = ReturnType<typeof useUpdateFormWithJsonMutation>;
export type UpdateFormWithJsonMutationResult = Apollo.MutationResult<UpdateFormWithJsonMutation>;
export type UpdateFormWithJsonMutationOptions = Apollo.BaseMutationOptions<UpdateFormWithJsonMutation, UpdateFormWithJsonMutationVariables>;
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
export type CreateFormMutationFn = Apollo.MutationFunction<CreateFormMutation, CreateFormMutationVariables>;

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
export function useCreateFormMutation(baseOptions?: Apollo.MutationHookOptions<CreateFormMutation, CreateFormMutationVariables>) {
        return Apollo.useMutation<CreateFormMutation, CreateFormMutationVariables>(CreateFormDocument, baseOptions);
      }
export type CreateFormMutationHookResult = ReturnType<typeof useCreateFormMutation>;
export type CreateFormMutationResult = Apollo.MutationResult<CreateFormMutation>;
export type CreateFormMutationOptions = Apollo.BaseMutationOptions<CreateFormMutation, CreateFormMutationVariables>;
export const UpdateFormDocument = gql`
    mutation UpdateForm($id: Int!, $form: FormInput!) {
  updateForm(input: {id: $id, form: $form}) {
    form {
      id
      ...FormEditorData
    }
  }
}
    ${FormEditorDataFragmentDoc}`;
export type UpdateFormMutationFn = Apollo.MutationFunction<UpdateFormMutation, UpdateFormMutationVariables>;

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
export function useUpdateFormMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFormMutation, UpdateFormMutationVariables>) {
        return Apollo.useMutation<UpdateFormMutation, UpdateFormMutationVariables>(UpdateFormDocument, baseOptions);
      }
export type UpdateFormMutationHookResult = ReturnType<typeof useUpdateFormMutation>;
export type UpdateFormMutationResult = Apollo.MutationResult<UpdateFormMutation>;
export type UpdateFormMutationOptions = Apollo.BaseMutationOptions<UpdateFormMutation, UpdateFormMutationVariables>;
export const DeleteFormDocument = gql`
    mutation DeleteForm($id: Int!) {
  deleteForm(input: {id: $id}) {
    clientMutationId
  }
}
    `;
export type DeleteFormMutationFn = Apollo.MutationFunction<DeleteFormMutation, DeleteFormMutationVariables>;

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
export function useDeleteFormMutation(baseOptions?: Apollo.MutationHookOptions<DeleteFormMutation, DeleteFormMutationVariables>) {
        return Apollo.useMutation<DeleteFormMutation, DeleteFormMutationVariables>(DeleteFormDocument, baseOptions);
      }
export type DeleteFormMutationHookResult = ReturnType<typeof useDeleteFormMutation>;
export type DeleteFormMutationResult = Apollo.MutationResult<DeleteFormMutation>;
export type DeleteFormMutationOptions = Apollo.BaseMutationOptions<DeleteFormMutation, DeleteFormMutationVariables>;
export const CreateFormSectionDocument = gql`
    mutation CreateFormSection($formId: Int!, $formSection: FormSectionInput!) {
  createFormSection(input: {form_id: $formId, form_section: $formSection}) {
    form_section {
      id
      ...CommonFormSectionFields
      form_items {
        id
        ...FormEditorFormItemFields
      }
    }
  }
}
    ${CommonFormSectionFieldsFragmentDoc}
${FormEditorFormItemFieldsFragmentDoc}`;
export type CreateFormSectionMutationFn = Apollo.MutationFunction<CreateFormSectionMutation, CreateFormSectionMutationVariables>;

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
export function useCreateFormSectionMutation(baseOptions?: Apollo.MutationHookOptions<CreateFormSectionMutation, CreateFormSectionMutationVariables>) {
        return Apollo.useMutation<CreateFormSectionMutation, CreateFormSectionMutationVariables>(CreateFormSectionDocument, baseOptions);
      }
export type CreateFormSectionMutationHookResult = ReturnType<typeof useCreateFormSectionMutation>;
export type CreateFormSectionMutationResult = Apollo.MutationResult<CreateFormSectionMutation>;
export type CreateFormSectionMutationOptions = Apollo.BaseMutationOptions<CreateFormSectionMutation, CreateFormSectionMutationVariables>;
export const UpdateFormSectionDocument = gql`
    mutation UpdateFormSection($id: Int!, $formSection: FormSectionInput!) {
  updateFormSection(input: {id: $id, form_section: $formSection}) {
    form_section {
      id
      ...CommonFormSectionFields
      form_items {
        id
        ...FormEditorFormItemFields
      }
    }
  }
}
    ${CommonFormSectionFieldsFragmentDoc}
${FormEditorFormItemFieldsFragmentDoc}`;
export type UpdateFormSectionMutationFn = Apollo.MutationFunction<UpdateFormSectionMutation, UpdateFormSectionMutationVariables>;

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
export function useUpdateFormSectionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFormSectionMutation, UpdateFormSectionMutationVariables>) {
        return Apollo.useMutation<UpdateFormSectionMutation, UpdateFormSectionMutationVariables>(UpdateFormSectionDocument, baseOptions);
      }
export type UpdateFormSectionMutationHookResult = ReturnType<typeof useUpdateFormSectionMutation>;
export type UpdateFormSectionMutationResult = Apollo.MutationResult<UpdateFormSectionMutation>;
export type UpdateFormSectionMutationOptions = Apollo.BaseMutationOptions<UpdateFormSectionMutation, UpdateFormSectionMutationVariables>;
export const DeleteFormSectionDocument = gql`
    mutation DeleteFormSection($id: Int!) {
  deleteFormSection(input: {id: $id}) {
    clientMutationId
  }
}
    `;
export type DeleteFormSectionMutationFn = Apollo.MutationFunction<DeleteFormSectionMutation, DeleteFormSectionMutationVariables>;

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
export function useDeleteFormSectionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteFormSectionMutation, DeleteFormSectionMutationVariables>) {
        return Apollo.useMutation<DeleteFormSectionMutation, DeleteFormSectionMutationVariables>(DeleteFormSectionDocument, baseOptions);
      }
export type DeleteFormSectionMutationHookResult = ReturnType<typeof useDeleteFormSectionMutation>;
export type DeleteFormSectionMutationResult = Apollo.MutationResult<DeleteFormSectionMutation>;
export type DeleteFormSectionMutationOptions = Apollo.BaseMutationOptions<DeleteFormSectionMutation, DeleteFormSectionMutationVariables>;
export const MoveFormSectionDocument = gql`
    mutation MoveFormSection($id: Int!, $destinationIndex: Int!) {
  moveFormSection(input: {id: $id, destination_index: $destinationIndex}) {
    form {
      id
      ...FormEditorData
    }
  }
}
    ${FormEditorDataFragmentDoc}`;
export type MoveFormSectionMutationFn = Apollo.MutationFunction<MoveFormSectionMutation, MoveFormSectionMutationVariables>;

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
export function useMoveFormSectionMutation(baseOptions?: Apollo.MutationHookOptions<MoveFormSectionMutation, MoveFormSectionMutationVariables>) {
        return Apollo.useMutation<MoveFormSectionMutation, MoveFormSectionMutationVariables>(MoveFormSectionDocument, baseOptions);
      }
export type MoveFormSectionMutationHookResult = ReturnType<typeof useMoveFormSectionMutation>;
export type MoveFormSectionMutationResult = Apollo.MutationResult<MoveFormSectionMutation>;
export type MoveFormSectionMutationOptions = Apollo.BaseMutationOptions<MoveFormSectionMutation, MoveFormSectionMutationVariables>;
export const CreateFormItemDocument = gql`
    mutation CreateFormItem($formSectionId: Int!, $formItem: FormItemInput!) {
  createFormItem(input: {form_section_id: $formSectionId, form_item: $formItem}) {
    form_item {
      id
      ...FormEditorFormItemFields
    }
  }
}
    ${FormEditorFormItemFieldsFragmentDoc}`;
export type CreateFormItemMutationFn = Apollo.MutationFunction<CreateFormItemMutation, CreateFormItemMutationVariables>;

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
export function useCreateFormItemMutation(baseOptions?: Apollo.MutationHookOptions<CreateFormItemMutation, CreateFormItemMutationVariables>) {
        return Apollo.useMutation<CreateFormItemMutation, CreateFormItemMutationVariables>(CreateFormItemDocument, baseOptions);
      }
export type CreateFormItemMutationHookResult = ReturnType<typeof useCreateFormItemMutation>;
export type CreateFormItemMutationResult = Apollo.MutationResult<CreateFormItemMutation>;
export type CreateFormItemMutationOptions = Apollo.BaseMutationOptions<CreateFormItemMutation, CreateFormItemMutationVariables>;
export const UpdateFormItemDocument = gql`
    mutation UpdateFormItem($id: Int!, $formItem: FormItemInput!) {
  updateFormItem(input: {id: $id, form_item: $formItem}) {
    form_item {
      id
      ...FormEditorFormItemFields
    }
  }
}
    ${FormEditorFormItemFieldsFragmentDoc}`;
export type UpdateFormItemMutationFn = Apollo.MutationFunction<UpdateFormItemMutation, UpdateFormItemMutationVariables>;

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
export function useUpdateFormItemMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFormItemMutation, UpdateFormItemMutationVariables>) {
        return Apollo.useMutation<UpdateFormItemMutation, UpdateFormItemMutationVariables>(UpdateFormItemDocument, baseOptions);
      }
export type UpdateFormItemMutationHookResult = ReturnType<typeof useUpdateFormItemMutation>;
export type UpdateFormItemMutationResult = Apollo.MutationResult<UpdateFormItemMutation>;
export type UpdateFormItemMutationOptions = Apollo.BaseMutationOptions<UpdateFormItemMutation, UpdateFormItemMutationVariables>;
export const DeleteFormItemDocument = gql`
    mutation DeleteFormItem($id: Int!) {
  deleteFormItem(input: {id: $id}) {
    clientMutationId
  }
}
    `;
export type DeleteFormItemMutationFn = Apollo.MutationFunction<DeleteFormItemMutation, DeleteFormItemMutationVariables>;

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
export function useDeleteFormItemMutation(baseOptions?: Apollo.MutationHookOptions<DeleteFormItemMutation, DeleteFormItemMutationVariables>) {
        return Apollo.useMutation<DeleteFormItemMutation, DeleteFormItemMutationVariables>(DeleteFormItemDocument, baseOptions);
      }
export type DeleteFormItemMutationHookResult = ReturnType<typeof useDeleteFormItemMutation>;
export type DeleteFormItemMutationResult = Apollo.MutationResult<DeleteFormItemMutation>;
export type DeleteFormItemMutationOptions = Apollo.BaseMutationOptions<DeleteFormItemMutation, DeleteFormItemMutationVariables>;
export const MoveFormItemDocument = gql`
    mutation MoveFormItem($id: Int!, $formSectionId: Int!, $destinationIndex: Int) {
  moveFormItem(input: {id: $id, form_section_id: $formSectionId, destination_index: $destinationIndex}) {
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
export type MoveFormItemMutationFn = Apollo.MutationFunction<MoveFormItemMutation, MoveFormItemMutationVariables>;

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
export function useMoveFormItemMutation(baseOptions?: Apollo.MutationHookOptions<MoveFormItemMutation, MoveFormItemMutationVariables>) {
        return Apollo.useMutation<MoveFormItemMutation, MoveFormItemMutationVariables>(MoveFormItemDocument, baseOptions);
      }
export type MoveFormItemMutationHookResult = ReturnType<typeof useMoveFormItemMutation>;
export type MoveFormItemMutationResult = Apollo.MutationResult<MoveFormItemMutation>;
export type MoveFormItemMutationOptions = Apollo.BaseMutationOptions<MoveFormItemMutation, MoveFormItemMutationVariables>;