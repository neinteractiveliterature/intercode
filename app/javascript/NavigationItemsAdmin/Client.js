import gql from 'graphql-tag';

const navigationItemFragment = gql`
fragment NavigationItemFields on CmsNavigationItem {
  id
  position
  title

  page {
    id
  }

  navigation_section {
    id
  }
}
`;

const cmsNavigationItemsQuery = gql`
query {
  convention {
    pages {
      id
      name
    }

    cms_navigation_items {
      ...NavigationItemFields
    }
  }
}

${navigationItemFragment}
`;

const createNavigationItemMutation = gql`
mutation($navigationItem: CmsNavigationItemInput!) {
  createCmsNavigationItem(input: { cms_navigation_item: $navigationItem }) {
    cms_navigation_item {
      ...NavigationItemFields
    }
  }
}

${navigationItemFragment}
`;

const updateNavigationItemMutation = gql`
mutation($id: Int!, $navigationItem: CmsNavigationItemInput!) {
  updateCmsNavigationItem(input: { id: $id, cms_navigation_item: $navigationItem }) {
    cms_navigation_item {
      ...NavigationItemFields
    }
  }
}

${navigationItemFragment}
`;

const deleteNavigationItemMutation = gql`
mutation($id: Int!) {
  deleteCmsNavigationItem(input: { id: $id }) {
    cms_navigation_item {
      id
    }
  }
}
`;

const sortNavigationItemsMutation = gql`
mutation($sortItems: [UpdateCmsNavigationItemInput!]!) {
  sortCmsNavigationItems(input: { sort_items: $sortItems }) {
    clientMutationId
  }
}
`;

function graphqlNavigationItemToCadmusNavbarAdminObject(navigationItem) {
  return {
    id: navigationItem.id,
    position: navigationItem.position,
    title: navigationItem.title,
    navigation_section_id: (navigationItem.navigation_section || {}).id,
    page_id: (navigationItem.page || {}).id,
  };
}

class Client {
  constructor(apolloClient) {
    this.apolloClient = apolloClient;

    this.requestsInProgress = {
      savingNavigationItem: false,
      deletingNavigationItem: false,
      loadingNavigationItems: false,
      loadingPages: false,
      sortingNavigationItems: false,
    };

    this.errorSubscribers = [];
  }

  addErrorSubscriber(subscriber) {
    this.errorSubscribers.push(subscriber);
  }

  onError(error) {
    this.errorSubscribers.forEach((errorSubscriber) => { errorSubscriber(error); });
  }

  async fetchNavigationItems() {
    this.requestsInProgress.loadingNavigationItems = true;
    try {
      const { data } = await this.apolloClient.query({ query: cmsNavigationItemsQuery });
      return data.convention.cms_navigation_items
        .map(graphqlNavigationItemToCadmusNavbarAdminObject);
    } catch (error) {
      this.onError(error);
      throw error;
    } finally {
      this.requestsInProgress.loadingNavigationItems = false;
    }
  }

  async fetchPages() {
    this.requestsInProgress.loadingPages = true;
    try {
      const { data } = await this.apolloClient.query({ query: cmsNavigationItemsQuery });
      return data.convention.pages;
    } catch (error) {
      this.onError(error);
      throw error;
    } finally {
      this.requestsInProgress.loadingPages = false;
    }
  }

  async saveNavigationItem(navigationItem) {
    this.requestsInProgress.savingNavigationItem = true;
    let mutation;
    let update;
    const variables = {
      navigationItem: {
        title: navigationItem.title,
        navigation_section_id: navigationItem.navigation_section_id,
        page_id: navigationItem.page_id,
        position: navigationItem.position,
      },
    };

    try {
      if (navigationItem.id) {
        mutation = updateNavigationItemMutation;
        variables.id = navigationItem.id;
      } else {
        mutation = createNavigationItemMutation;
        update = (
          cache,
          { data: { createCmsNavigationItem: { cms_navigation_item: newNavigationItem } } },
        ) => {
          const data = cache.readQuery({ query: cmsNavigationItemsQuery });
          data.convention.cms_navigation_items.push(newNavigationItem);
          cache.writeQuery({ query: cmsNavigationItemsQuery, data });
        };
      }

      const { data } = await this.apolloClient.mutate({ mutation, variables, update });
      const mutationResponse = (
        mutation === updateNavigationItemMutation ?
          data.updateCmsNavigationItem :
          data.createCmsNavigationItem
      );

      return graphqlNavigationItemToCadmusNavbarAdminObject(mutationResponse.cms_navigation_item);
    } catch (error) {
      this.onError(error);
      throw error;
    } finally {
      this.requestsInProgress.savingNavigationItem = false;
    }
  }

  async deleteNavigationItem(navigationItem) {
    this.requestsInProgress.deletingNavigationItem = true;

    try {
      return await this.apolloClient.mutate({
        mutation: deleteNavigationItemMutation,
        variables: { id: navigationItem.id },
        update: (cache) => {
          const data = cache.readQuery({ query: cmsNavigationItemsQuery });
          data.convention.cms_navigation_items = data.convention.cms_navigation_items
            .filter(item => item.id !== navigationItem.id);
          cache.writeQuery({ query: cmsNavigationItemsQuery, data });
        },
      });
    } catch (error) {
      this.onError(error);
      throw error;
    } finally {
      this.requestsInProgress.deletingNavigationItem = false;
    }
  }

  async sortNavigationItems(navigationItems) {
    const sortItems = navigationItems.map(navigationItem => ({
      id: navigationItem.id,
      cms_navigation_item: {
        position: navigationItem.position,
        navigation_section_id: navigationItem.navigation_section_id,
      },
    }));

    this.requestsInProgress.sortingNavigationItems = true;
    try {
      return await this.apolloClient.mutate({
        mutation: sortNavigationItemsMutation,
        variables: { sortItems },
        update: (cache) => {
          const data = cache.readQuery({ query: cmsNavigationItemsQuery });
          const newNavigationItems = data.convention.cms_navigation_items.map((item) => {
            const sortItem = sortItems.find(si => si.id === item.id);
            if (sortItem == null) {
              return item;
            }

            return { ...item, ...sortItem.cms_navigation_item };
          });

          cache.writeQuery({
            query: cmsNavigationItemsQuery,
            data: {
              ...data,
              convention: {
                ...data.convention,
                cms_navigation_items: newNavigationItems,
              },
            },
          });
        },
      });
    } catch (error) {
      this.onError(error);
      throw error;
    } finally {
      this.requestsInProgress.sortingNavigationItems = false;
    }
  }
}

export default Client;
