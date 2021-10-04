import { gql } from '@apollo/client';
import { PermissionedRoleFields, PermissionedModelFields } from '../../Permissions/fragments';

export const CmsContentFields = gql`
  fragment CmsContentFields on CmsContent {
    # eslint-disable-next-line @graphql-eslint/naming-convention
    __typename

    ... on Page {
      id: transitionalId
      name
    }

    ... on CmsPartial {
      id: transitionalId
      name
    }

    ... on CmsLayout {
      id: transitionalId
      name
    }
  }
`;

export const CmsContentGroupFields = gql`
  fragment CmsContentGroupFields on CmsContentGroup {
    id: transitionalId
    name
    current_ability_can_update
    current_ability_can_delete

    contents {
      ...CmsContentFields
    }

    permissions {
      id: transitionalId
      permission

      model {
        ...PermissionedModelFields
      }

      role {
        ...PermissionedRoleFields
      }
    }
  }

  ${CmsContentFields}
  ${PermissionedRoleFields}
  ${PermissionedModelFields}
`;

export const CmsContentGroupsAdminQuery = gql`
  query CmsContentGroupsAdminQuery {
    convention: conventionByRequestHostIfPresent {
      id: transitionalId
      name

      staff_positions {
        id: transitionalId
        name
      }
    }

    cmsParent: cmsParentByRequestHost {
      id: transitionalId
      cmsContentGroups {
        id: transitionalId
        ...CmsContentGroupFields
      }
    }

    currentAbility {
      can_create_cms_content_groups
    }
  }

  ${CmsContentGroupFields}
`;

export const SearchCmsContentQuery = gql`
  query SearchCmsContentQuery($name: String) {
    cmsParent: cmsParentByRequestHost {
      id: transitionalId

      typeaheadSearchCmsContent(name: $name) {
        ...CmsContentFields
      }
    }
  }

  ${CmsContentFields}
`;
