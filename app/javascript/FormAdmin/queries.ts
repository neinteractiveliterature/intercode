import { gql } from '@apollo/client';
import { CommonFormFields, CommonFormItemFields, CommonFormSectionFields } from '../Models/commonFormFragments';

export const FormFields = gql`
  fragment FormFields on Form {
    id: transitionalId
    title
    form_type
    export_json

    event_categories {
      id: transitionalId
      name
    }

    proposal_event_categories {
      id: transitionalId
      name
    }

    user_con_profile_conventions {
      id: transitionalId
      name
    }
  }
`;

export const FormEditorFormItemFields = gql`
  fragment FormEditorFormItemFields on FormItem {
    id: transitionalId
    admin_description
    public_description
    properties
    ...CommonFormItemFields
  }

  ${CommonFormItemFields}
`;

export const FormEditorFormSectionFields = gql`
  fragment FormEditorFormSectionFields on FormSection {
    id: transitionalId
    ...CommonFormSectionFields

    form_items {
      id: transitionalId
      ...FormEditorFormItemFields
    }
  }

  ${CommonFormSectionFields}
  ${FormEditorFormItemFields}
`;

export const FormEditorData = gql`
  fragment FormEditorData on Form {
    id: transitionalId
    ...CommonFormFields

    form_sections {
      id: transitionalId
      ...FormEditorFormSectionFields
    }
  }

  ${FormEditorFormSectionFields}
  ${CommonFormFields}
`;

export const FormAdminQuery = gql`
  query FormAdminQuery {
    convention: conventionByRequestHost {
      id: transitionalId
      name

      forms {
        id: transitionalId
        ...FormFields
      }
    }
  }

  ${FormFields}
`;

export const FormEditorQuery = gql`
  query FormEditorQuery($id: ID!) {
    convention: conventionByRequestHost {
      id: transitionalId
      name
      starts_at
      ends_at
      timezone_name
      timezone_mode
      event_mailing_list_domain
      form(transitionalId: $id) {
        id: transitionalId
        ...FormEditorData
      }
    }
  }

  ${FormEditorData}
`;

export const PreviewFormItemQuery = gql`
  query PreviewFormItemQuery($formId: ID!, $formSectionId: ID!, $formItem: FormItemInput!) {
    convention: conventionByRequestHost {
      id: transitionalId
      form(transitionalId: $formId) {
        id: transitionalId
        form_section(transitionalId: $formSectionId) {
          id: transitionalId
          preview_form_item(formItem: $formItem) {
            id: transitionalId
            ...FormEditorFormItemFields
          }
        }
      }
    }
  }

  ${FormEditorFormItemFields}
`;
