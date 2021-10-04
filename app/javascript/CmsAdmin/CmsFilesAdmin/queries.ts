import { gql } from '@apollo/client';

export const CmsFileFields = gql`
  fragment CmsFileFields on CmsFile {
    id: transitionalId
    filename
    url
    content_type
    size
    current_ability_can_delete
  }
`;

export const CmsFilesAdminQuery = gql`
  query CmsFilesAdminQuery {
    convention: conventionByRequestHostIfPresent {
      id: transitionalId
      name
    }

    currentAbility {
      can_create_cms_files
    }

    cmsParent: cmsParentByRequestHost {
      id: transitionalId
      cmsFiles {
        id: transitionalId
        ...CmsFileFields
      }
    }
  }

  ${CmsFileFields}
`;
