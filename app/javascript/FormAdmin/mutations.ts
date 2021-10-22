import { gql } from '@apollo/client';
import { FormFields, FormEditorData, FormEditorFormItemFields, FormEditorFormSectionFields } from './queries';

export const CreateFormWithJSON = gql`
  mutation CreateFormWithJSON($formJSON: String!, $formType: FormType!) {
    createFormWithJSON(input: { form_json: $formJSON, form_type: $formType }) {
      form {
        id
        ...FormFields
      }
    }
  }

  ${FormFields}
`;

export const UpdateFormWithJSON = gql`
  mutation UpdateFormWithJSON($id: ID!, $formJSON: String!) {
    updateFormWithJSON(input: { transitionalId: $id, form_json: $formJSON }) {
      form {
        id
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
        id
        ...FormFields
      }
    }
  }

  ${FormFields}
`;

export const UpdateForm = gql`
  mutation UpdateForm($id: ID!, $form: FormInput!) {
    updateForm(input: { transitionalId: $id, form: $form }) {
      form {
        id
        ...FormEditorData
      }
    }
  }

  ${FormEditorData}
`;

export const DeleteForm = gql`
  mutation DeleteForm($id: ID!) {
    deleteForm(input: { transitionalId: $id }) {
      clientMutationId
    }
  }
`;

export const CreateFormSection = gql`
  mutation CreateFormSection($formId: ID!, $formSection: FormSectionInput!) {
    createFormSection(input: { transitionalFormId: $formId, form_section: $formSection }) {
      form_section {
        id
        ...FormEditorFormSectionFields
      }
    }
  }

  ${FormEditorFormSectionFields}
`;

export const UpdateFormSection = gql`
  mutation UpdateFormSection($id: ID!, $formSection: FormSectionInput!) {
    updateFormSection(input: { transitionalId: $id, form_section: $formSection }) {
      form_section {
        id
        ...FormEditorFormSectionFields
      }
    }
  }

  ${FormEditorFormSectionFields}
`;

export const DeleteFormSection = gql`
  mutation DeleteFormSection($id: ID!) {
    deleteFormSection(input: { transitionalId: $id }) {
      clientMutationId
    }
  }
`;

export const MoveFormSection = gql`
  mutation MoveFormSection($id: ID!, $destinationIndex: Int!) {
    moveFormSection(input: { transitionalId: $id, destination_index: $destinationIndex }) {
      form {
        id
        ...FormEditorData
      }
    }
  }

  ${FormEditorData}
`;

export const CreateFormItem = gql`
  mutation CreateFormItem($formSectionId: ID!, $formItem: FormItemInput!) {
    createFormItem(input: { transitionalFormSectionId: $formSectionId, form_item: $formItem }) {
      form_item {
        id
        ...FormEditorFormItemFields
      }
    }
  }

  ${FormEditorFormItemFields}
`;

export const UpdateFormItem = gql`
  mutation UpdateFormItem($id: ID!, $formItem: FormItemInput!) {
    updateFormItem(input: { transitionalId: $id, form_item: $formItem }) {
      form_item {
        id
        ...FormEditorFormItemFields
      }
    }
  }

  ${FormEditorFormItemFields}
`;

export const DeleteFormItem = gql`
  mutation DeleteFormItem($id: ID!) {
    deleteFormItem(input: { transitionalId: $id }) {
      clientMutationId
    }
  }
`;

export const MoveFormItem = gql`
  mutation MoveFormItem($id: ID!, $formSectionId: ID!, $destinationIndex: Int) {
    moveFormItem(
      input: { transitionalId: $id, transitionalFormSectionId: $formSectionId, destination_index: $destinationIndex }
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

  ${FormEditorFormItemFields}
`;
