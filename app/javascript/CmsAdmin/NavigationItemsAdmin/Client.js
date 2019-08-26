import { NavigationItemsAdminQuery } from './queries.gql';
import {
  CreateNavigationItem, UpdateNavigationItem, DeleteNavigationItem, SortNavigationItems,
} from './mutations.gql';

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
      const { data } = await this.apolloClient.query({ query: NavigationItemsAdminQuery });
      return data.cmsNavigationItems
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
      const { data } = await this.apolloClient.query({ query: NavigationItemsAdminQuery });
      return data.cmsPages;
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
        mutation = UpdateNavigationItem;
        variables.id = navigationItem.id;
      } else {
        mutation = CreateNavigationItem;
        update = (
          cache,
          { data: { createCmsNavigationItem: { cms_navigation_item: newNavigationItem } } },
        ) => {
          const data = cache.readQuery({ query: NavigationItemsAdminQuery });
          data.cmsNavigationItems.push(newNavigationItem);
          cache.writeQuery({ query: NavigationItemsAdminQuery, data });
        };
      }

      const { data } = await this.apolloClient.mutate({ mutation, variables, update });
      const mutationResponse = (
        mutation === UpdateNavigationItem
          ? data.updateCmsNavigationItem
          : data.createCmsNavigationItem
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
        mutation: DeleteNavigationItem,
        variables: { id: navigationItem.id },
        update: (cache) => {
          const data = cache.readQuery({ query: NavigationItemsAdminQuery });
          data.cmsNavigationItems = data.cmsNavigationItems
            .filter((item) => item.id !== navigationItem.id);
          cache.writeQuery({ query: NavigationItemsAdminQuery, data });
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
    const sortItems = navigationItems.map((navigationItem) => ({
      id: navigationItem.id,
      cms_navigation_item: {
        position: navigationItem.position,
        navigation_section_id: navigationItem.navigation_section_id,
      },
    }));

    this.requestsInProgress.sortingNavigationItems = true;
    try {
      return await this.apolloClient.mutate({
        mutation: SortNavigationItems,
        variables: { sortItems },
        update: (cache) => {
          const data = cache.readQuery({ query: NavigationItemsAdminQuery });
          const newNavigationItems = data.cmsNavigationItems.map((item) => {
            const sortItem = sortItems.find((si) => si.id === item.id);
            if (sortItem == null) {
              return item;
            }

            return { ...item, ...sortItem.cms_navigation_item };
          });

          cache.writeQuery({
            query: NavigationItemsAdminQuery,
            data: {
              ...data,
              cmsNavigationItems: newNavigationItems,
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
