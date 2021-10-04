import { gql } from '@apollo/client';
import { FormFields, FormEditorData, FormEditorFormItemFields } from './queries';
import { CommonFormSectionFields } from '../Models/commonFormFragments';

export const CreateFormWithJSON = gql`
  mutation CreateFormWithJSON($formJSON: String!, $formType: FormType!) {
    createFormWithJSON(input: { form_json: $formJSON, form_type: $formType }) {
      form {
        id: transitionalId
        ...FormFields
      }
    }
  }

  ${FormFields}
`;

export const UpdateFormWithJSON = gql`
  mutation UpdateFormWithJSON($id: Int!, $formJSON: String!) {
    updateFormWithJSON(input: { id: $id, form_json: $formJSON }) {
      form {
        id: transitionalId
        ...FormFields
      }
    }
  }

  ${FormFields}
`;

export const CreateForm = gql`
  mutation CreateForm($form: FormInput!, $formType: FormType!) {
    createForm(input: { form: $form, form_type: $formType }) {
      form {
        id: transitionalId
        ...FormFields
      }
    }
  }

  ${FormFields}
`;

export const UpdateForm = gql`
  mutation UpdateForm($id: Int!, $form: FormInput!) {
    updateForm(input: { id: $id, form: $form }) {
      form {
        id: transitionalId
        ...FormEditorData
      }
    }
  }

  ${FormEditorData}
`;

export const DeleteForm = gql`
  mutation DeleteForm($id: Int!) {
    deleteForm(input: { id: $id }) {
      clientMutationId
    }
  }
`;

export const CreateFormSection = gql`
  mutation CreateFormSection($formId: Int!, $formSection: FormSectionInput!) {
    createFormSection(input: { form_id: $formId, form_section: $formSection }) {
      form_section {
        id: transitionalId
        ...CommonFormSectionFields

        form_items {
          id: transitionalId
          ...FormEditorFormItemFields
        }
      }
    }
  }

  ${CommonFormSectionFields}
  ${FormEditorFormItemFields}
`;

export const UpdateFormSection = gql`
  mutation UpdateFormSection($id: Int!, $formSection: FormSectionInput!) {
    updateFormSection(input: { id: $id, form_section: $formSection }) {
      form_section {
        id: transitionalId
        ...CommonFormSectionFields

        form_items {
          id: transitionalId
          ...FormEditorFormItemFields
        }
      }
    }
  }

  ${CommonFormSectionFields}
  ${FormEditorFormItemFields}
`;

export const DeleteFormSection = gql`
  mutation DeleteFormSection($id: Int!) {
    deleteFormSection(input: { id: $id }) {
      clientMutationId
    }
  }
`;

export const MoveFormSection = gql`
  mutation MoveFormSection($id: Int!, $destinationIndex: Int!) {
    moveFormSection(input: { id: $id, destination_index: $destinationIndex }) {
      form {
        id: transitionalId
        ...FormEditorData
      }
    }
  }

  ${FormEditorData}
`;

export const CreateFormItem = gql`
  mutation CreateFormItem($formSectionId: Int!, $formItem: FormItemInput!) {
    createFormItem(input: { form_section_id: $formSectionId, form_item: $formItem }) {
      form_item {
        id: transitionalId
        ...FormEditorFormItemFields
      }
    }
  }

  ${FormEditorFormItemFields}
`;

export const UpdateFormItem = gql`
  mutation UpdateFormItem($id: Int!, $formItem: FormItemInput!) {
    updateFormItem(input: { id: $id, form_item: $formItem }) {
      form_item {
        id: transitionalId
        ...FormEditorFormItemFields
      }
    }
  }

  ${FormEditorFormItemFields}
`;

export const DeleteFormItem = gql`
  mutation DeleteFormItem($id: Int!) {
    deleteFormItem(input: { id: $id }) {
      clientMutationId
    }
  }
`;

export const MoveFormItem = gql`
  mutation MoveFormItem($id: Int!, $formSectionId: Int!, $destinationIndex: Int) {
    moveFormItem(
      input: { id: $id, form_section_id: $formSectionId, destination_index: $destinationIndex }
    ) {
      form_section {
        id: transitionalId

        form_items {
          id: transitionalId
          ...FormEditorFormItemFields
        }
      }
    }
  }

  ${FormEditorFormItemFields}
`;
