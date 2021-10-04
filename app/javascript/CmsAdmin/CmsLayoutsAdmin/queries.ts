import { gql } from '@apollo/client';

export const CmsLayoutFields = gql`
  fragment CmsLayoutFields on CmsLayout {
    id: transitionalId
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
    convention: conventionByRequestHostIfPresent {
      id: transitionalId
      name
    }

    currentAbility {
      can_create_cms_layouts
    }

    cmsParent: cmsParentByRequestHost {
      id: transitionalId
      cmsLayouts {
        id: transitionalId
        ...CmsLayoutFields
      }
    }
  }

  ${CmsLayoutFields}
`;
