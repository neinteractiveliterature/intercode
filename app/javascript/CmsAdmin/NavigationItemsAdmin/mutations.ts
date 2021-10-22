import { gql } from '@apollo/client';
import { AdminNavigationItemFields } from './queries';

export const CreateNavigationItem = gql`
  mutation CreateNavigationItem($navigationItem: CmsNavigationItemInput!) {
    createCmsNavigationItem(input: { cms_navigation_item: $navigationItem }) {
      cms_navigation_item {
        id
        ...AdminNavigationItemFields
      }
    }
  }

  ${AdminNavigationItemFields}
`;

export const UpdateNavigationItem = gql`
  mutation UpdateNavigationItem($id: ID!, $navigationItem: CmsNavigationItemInput!) {
    updateCmsNavigationItem(input: { id: $id, cms_navigation_item: $navigationItem }) {
      cms_navigation_item {
        id
        ...AdminNavigationItemFields
      }
    }
  }

  ${AdminNavigationItemFields}
`;

export const DeleteNavigationItem = gql`
  mutation DeleteNavigationItem($id: ID!) {
    deleteCmsNavigationItem(input: { id: $id }) {
      cms_navigation_item {
        id
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
