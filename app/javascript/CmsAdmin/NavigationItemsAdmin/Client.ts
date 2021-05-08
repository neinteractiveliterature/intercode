import { ApolloClient, FetchResult } from '@apollo/client';
import { NavigationItemsAdminQuery } from './queries';
import {
  AdminNavigationItemFieldsFragment,
  NavigationItemsAdminQueryData,
} from './queries.generated';
import {
  CreateNavigationItemDocument,
  CreateNavigationItemMutationData,
  CreateNavigationItemMutationVariables,
  DeleteNavigationItemDocument,
  DeleteNavigationItemMutationData,
  DeleteNavigationItemMutationVariables,
  SortNavigationItemsDocument,
  SortNavigationItemsMutationData,
  SortNavigationItemsMutationVariables,
  UpdateNavigationItemDocument,
  UpdateNavigationItemMutationData,
  UpdateNavigationItemMutationVariables,
} from './mutations.generated';
import { CmsNavigationItemInput } from '../../graphqlTypes.generated';

type CadmusNavbarAdminItem = {
  id: number;
  position?: number;
  title?: string;
  navigation_section_id?: number;
  page_id?: number;
};

function graphqlNavigationItemToCadmusNavbarAdminObject(
  navigationItem: AdminNavigationItemFieldsFragment,
): CadmusNavbarAdminItem {
  return {
    id: navigationItem.id,
    position: navigationItem.position ?? undefined,
    title: navigationItem.title ?? undefined,
    navigation_section_id: (navigationItem.navigation_section || {}).id,
    page_id: (navigationItem.page || {}).id,
  };
}

class Client {
  apolloClient: ApolloClient<any>;

  requestsInProgress: {
    savingNavigationItem: boolean;
    deletingNavigationItem: boolean;
    loadingNavigationItems: boolean;
    loadingPages: boolean;
    sortingNavigationItems: boolean;
  };

  errorSubscribers: ((error: Error) => void)[];

  constructor(apolloClient: ApolloClient<any>) {
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

  addErrorSubscriber(subscriber: (error: Error) => void) {
    this.errorSubscribers.push(subscriber);
  }

  onError(error: Error) {
    this.errorSubscribers.forEach((errorSubscriber) => {
      errorSubscriber(error);
    });
  }

  async fetchNavigationItems() {
    this.requestsInProgress.loadingNavigationItems = true;
    try {
      const { data } = await this.apolloClient.query({ query: NavigationItemsAdminQuery });
      return data.cmsNavigationItems.map(graphqlNavigationItemToCadmusNavbarAdminObject);
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

  async saveNavigationItem(navigationItem: CadmusNavbarAdminItem) {
    this.requestsInProgress.savingNavigationItem = true;
    let mutate: () => Promise<FetchResult>;
    let operation: 'create' | 'update';
    const navigationItemInput: CmsNavigationItemInput = {
      title: navigationItem.title,
      navigation_section_id: navigationItem.navigation_section_id,
      page_id: navigationItem.page_id,
      position: navigationItem.position,
    };

    try {
      if (navigationItem.id) {
        operation = 'update';
        mutate = () =>
          this.apolloClient.mutate<
            UpdateNavigationItemMutationData,
            UpdateNavigationItemMutationVariables
          >({
            mutation: UpdateNavigationItemDocument,
            variables: { id: navigationItem.id, navigationItem: navigationItemInput },
          });
      } else {
        operation = 'create';
        mutate = () =>
          this.apolloClient.mutate<
            CreateNavigationItemMutationData,
            CreateNavigationItemMutationVariables
          >({
            mutation: CreateNavigationItemDocument,
            variables: { navigationItem: navigationItemInput },
            update: (cache, { data: resultData }) => {
              const data = cache.readQuery<NavigationItemsAdminQueryData>({
                query: NavigationItemsAdminQuery,
              });
              const newNavigationItem = resultData?.createCmsNavigationItem?.cms_navigation_item;
              if (!data || !newNavigationItem) {
                return;
              }
              cache.writeQuery<NavigationItemsAdminQueryData>({
                query: NavigationItemsAdminQuery,
                data: {
                  ...data,
                  cmsNavigationItems: [...data.cmsNavigationItems, newNavigationItem],
                },
              });
            },
          });
      }

      const { data } = await mutate();
      const mutationResponse =
        operation === 'update' ? data!.updateCmsNavigationItem : data!.createCmsNavigationItem;

      await this.apolloClient.resetStore();
      return graphqlNavigationItemToCadmusNavbarAdminObject(mutationResponse.cms_navigation_item);
    } catch (error) {
      this.onError(error);
      throw error;
    } finally {
      this.requestsInProgress.savingNavigationItem = false;
    }
  }

  async deleteNavigationItem(navigationItem: CadmusNavbarAdminItem) {
    this.requestsInProgress.deletingNavigationItem = true;

    try {
      const response = await this.apolloClient.mutate<
        DeleteNavigationItemMutationData,
        DeleteNavigationItemMutationVariables
      >({
        mutation: DeleteNavigationItemDocument,
        variables: { id: navigationItem.id },
        update: (cache) => {
          const data = cache.readQuery<NavigationItemsAdminQueryData>({
            query: NavigationItemsAdminQuery,
          });
          if (!data) {
            return;
          }
          cache.writeQuery({
            query: NavigationItemsAdminQuery,
            data: {
              ...data,
              cmsNavigationItems: data.cmsNavigationItems.filter(
                (item) => item.id !== navigationItem.id,
              ),
            },
          });
        },
      });
      await this.apolloClient.resetStore();
      return response;
    } catch (error) {
      this.onError(error);
      throw error;
    } finally {
      this.requestsInProgress.deletingNavigationItem = false;
    }
  }

  async sortNavigationItems(navigationItems: CadmusNavbarAdminItem[]) {
    const sortItems = navigationItems.map((navigationItem) => ({
      id: navigationItem.id,
      cms_navigation_item: {
        position: navigationItem.position,
        navigation_section_id: navigationItem.navigation_section_id,
      },
    }));

    this.requestsInProgress.sortingNavigationItems = true;
    try {
      const response = await this.apolloClient.mutate<
        SortNavigationItemsMutationData,
        SortNavigationItemsMutationVariables
      >({
        mutation: SortNavigationItemsDocument,
        variables: { sortItems },
        update: (cache) => {
          const data = cache.readQuery<NavigationItemsAdminQueryData>({
            query: NavigationItemsAdminQuery,
          });
          if (!data) {
            return;
          }
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

      await this.apolloClient.resetStore();
      return response;
    } catch (error) {
      this.onError(error);
      throw error;
    } finally {
      this.requestsInProgress.sortingNavigationItems = false;
    }
  }
}

export default Client;
