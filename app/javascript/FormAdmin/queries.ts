import { gql } from '@apollo/client';
import { CommonFormItemFields, CommonFormFields } from '../Models/commonFormFragments';

export const FormFields = gql`
  fragment FormFields on Form {
    id
    title
    form_type
    export_json

    event_categories {
      id
      name
    }

    proposal_event_categories {
      id
      name
    }

    user_con_profile_conventions {
      id
      name
    }
  }
`;

export const FormEditorFormItemFields = gql`
  fragment FormEditorFormItemFields on FormItem {
    id
    admin_description
    public_description
    properties
    ...CommonFormItemFields
  }

  ${CommonFormItemFields}
`;

export const FormEditorData = gql`
  fragment FormEditorData on Form {
    id
    ...CommonFormFields

    form_sections {
      id

      form_items {
        id
        ...FormEditorFormItemFields
      }
    }
  }

  ${CommonFormFields}
  ${FormEditorFormItemFields}
`;

export const FormAdminQuery = gql`
  query FormAdminQuery {
    convention: conventionByRequestHost {
      id
      name

      forms {
        id
        ...FormFields
      }
    }
  }

  ${FormFields}
`;

export const FormEditorQuery = gql`
  query FormEditorQuery($id: Int!) {
    convention: conventionByRequestHost {
      id
      name
      starts_at
      ends_at
      timezone_name
      timezone_mode
      event_mailing_list_domain
    }

    form(id: $id) {
      id
      ...FormEditorData
    }
  }

  ${FormEditorData}
`;

export const PreviewFormItemQuery = gql`
  query PreviewFormItemQuery($formSectionId: Int!, $formItem: FormItemInput!) {
    previewFormItem(formSectionId: $formSectionId, formItem: $formItem) {
      id
      ...FormEditorFormItemFields
    }
  }

  ${FormEditorFormItemFields}
`;
