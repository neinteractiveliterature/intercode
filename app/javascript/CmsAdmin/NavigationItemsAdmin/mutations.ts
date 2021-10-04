import { gql } from '@apollo/client';
import { AdminNavigationItemFields } from './queries';

export const CreateNavigationItem = gql`
  mutation CreateNavigationItem($navigationItem: CmsNavigationItemInput!) {
    createCmsNavigationItem(input: { cms_navigation_item: $navigationItem }) {
      cms_navigation_item {
        id: transitionalId
        ...AdminNavigationItemFields
      }
    }
  }

  ${AdminNavigationItemFields}
`;

export const UpdateNavigationItem = gql`
  mutation UpdateNavigationItem($id: Int!, $navigationItem: CmsNavigationItemInput!) {
    updateCmsNavigationItem(input: { id: $id, cms_navigation_item: $navigationItem }) {
      cms_navigation_item {
        id: transitionalId
        ...AdminNavigationItemFields
      }
    }
  }

  ${AdminNavigationItemFields}
`;

export const DeleteNavigationItem = gql`
  mutation DeleteNavigationItem($id: Int!) {
    deleteCmsNavigationItem(input: { id: $id }) {
      cms_navigation_item {
        id: transitionalId
      }
    }
  }
`;

export const SortNavigationItems = gql`
  mutation SortNavigationItems($sortItems: [UpdateCmsNavigationItemInput!]!) {
    sortCmsNavigationItems(input: { sort_items: $sortItems }) {
      clientMutationId
    }
  }
`;
