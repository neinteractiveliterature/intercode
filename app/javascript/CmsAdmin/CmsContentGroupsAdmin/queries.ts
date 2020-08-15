import { gql } from '@apollo/client';
import { PermissionedRoleFields } from '../../Permissions/fragments';

export const CmsContentFields = gql`
  fragment CmsContentFields on CmsContent {
    __typename

    ... on Page {
      id
      name
    }

    ... on CmsPartial {
      id
      name
    }

    ... on CmsLayout {
      id
      name
    }
  }
`;

export const CmsContentGroupFields = gql`
  fragment CmsContentGroupFields on CmsContentGroup {
    id
    name
    current_ability_can_update
    current_ability_can_delete

    contents {
      ...CmsContentFields
    }

    permissions {
      id
      permission

      role {
        ...PermissionedRoleFields
      }
    }
  }

  ${CmsContentFields}
  ${PermissionedRoleFields}
`;

export const CmsContentGroupsAdminQuery = gql`
  query CmsContentGroupsAdminQuery {
    convention {
      id
      name

      staff_positions {
        id
        name
      }
    }

    cmsContentGroups {
      id
      ...CmsContentGroupFields
    }

    currentAbility {
      can_create_cms_content_groups
    }
  }

  ${CmsContentGroupFields}
`;

export const SearchCmsContentQuery = gql`
  query SearchCmsContentQuery($name: String) {
    searchCmsContent(name: $name) {
      ...CmsContentFields
    }
  }

  ${CmsContentFields}
`;
