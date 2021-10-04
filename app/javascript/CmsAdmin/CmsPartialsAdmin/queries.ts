import { gql } from '@apollo/client';

export const CmsPartialFields = gql`
  fragment CmsPartialFields on CmsPartial {
    id: transitionalId
    name
    content
    admin_notes
    current_ability_can_update
    current_ability_can_delete
  }
`;

export const CmsPartialsAdminQuery = gql`
  query CmsPartialsAdminQuery {
    convention: conventionByRequestHostIfPresent {
      id: transitionalId
      name
    }

    currentAbility {
      can_create_cms_partials
    }

    cmsParent: cmsParentByRequestHost {
      id: transitionalId
      cmsPartials {
        id: transitionalId
        ...CmsPartialFields
      }
    }
  }

  ${CmsPartialFields}
`;
