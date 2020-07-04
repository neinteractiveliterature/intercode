import gql from 'graphql-tag';

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
  position
  identifier
  item_type
  admin_description
  public_description
  properties
  rendered_properties
  default_value
}
`;

export const FormEditorFormSectionFields = gql`
fragment FormEditorFormSectionFields on FormSection {
  id
  title
  position
  form_items {
    id
    ...FormEditorFormItemFields
  }
}

${FormEditorFormItemFields}
`;

export const FormEditorData = gql`
fragment FormEditorData on Form {
  id
  title
  form_type

  form_sections {
    id
    ...FormEditorFormSectionFields
  }
}

${FormEditorFormSectionFields}
`;

export const FormAdminQuery = gql`
query FormAdminQuery {
  convention {
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
  convention {
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
