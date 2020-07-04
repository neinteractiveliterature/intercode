import gql from 'graphql-tag';

export const CmsFileFields = gql`
fragment CmsFileFields on CmsFile {
  id
  filename
  url
  content_type
  size
  current_ability_can_delete
}
`;

export const CmsFilesAdminQuery = gql`
query CmsFilesAdminQuery {
  convention {
    id
    name
  }

  currentAbility {
    can_create_cms_files
  }

  cmsFiles {
    id
    ...CmsFileFields
  }
}

${CmsFileFields}
`;
