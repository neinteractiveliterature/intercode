import { gql } from '@apollo/client';

export const CommonFormItemFields = gql`
  fragment CommonFormItemFields on FormItem {
    id: transitionalId
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
    id: transitionalId
    title
    position
    form_items {
      id: transitionalId
      ...CommonFormItemFields
    }
  }

  ${CommonFormItemFields}
`;

export const CommonFormFields = gql`
  fragment CommonFormFields on Form {
    id: transitionalId
    title
    form_type

    form_sections {
      id: transitionalId
      ...CommonFormSectionFields
    }
  }

  ${CommonFormSectionFields}
`;
