import { gql } from '@apollo/client';

export const CmsLayoutFields = gql`
  fragment CmsLayoutFields on CmsLayout {
    id
    name
    content
    navbar_classes
    admin_notes
    current_ability_can_update
    current_ability_can_delete
  }
`;

export const CmsLayoutsAdminQuery = gql`
  query CmsLayoutsAdminQuery {
    convention {
      id
      name
    }

    currentAbility {
      can_create_cms_layouts
    }

    cmsLayouts {
      id
      ...CmsLayoutFields
    }
  }

  ${CmsLayoutFields}
`;
