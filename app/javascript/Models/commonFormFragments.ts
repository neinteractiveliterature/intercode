import { gql } from '@apollo/client';

export const CommonFormItemFields = gql`
  fragment CommonFormItemFields on FormItem {
    id
    position
    identifier
    item_type
    rendered_properties
    default_value
    visibility
    writeability
  }
`;

export const CommonFormSectionFields = gql`
  fragment CommonFormSectionFields on FormSection {
    id
    title
    position
    form_items {
      id
      ...CommonFormItemFields
    }
  }

  ${CommonFormItemFields}
`;

export const CommonFormFields = gql`
  fragment CommonFormFields on Form {
    id
    title
    form_type

    form_sections {
      id
      ...CommonFormSectionFields
    }
  }

  ${CommonFormSectionFields}
`;
