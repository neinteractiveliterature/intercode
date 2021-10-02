import { ApolloClient, FetchResult } from '@apollo/client';
import { CadmusNavbarAdminClient } from 'cadmus-navbar-admin/lib/CadmusNavbarAdminClient';
import { NavigationItem } from 'cadmus-navbar-admin/lib/NavigationItem';
import { EditingNavigationItem } from 'cadmus-navbar-admin/lib/EditingNavigationItemContext';
import { parseIntOrNull } from '@neinteractiveliterature/litform';
import NavigationItemStore from 'cadmus-navbar-admin/lib/NavigationItemStore';
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

function graphqlNavigationItemToCadmusNavbarAdminObject(
  navigationItem: AdminNavigationItemFieldsFragment,
): NavigationItem {
  return {
    id: navigationItem.id.toString(),
    position: navigationItem.position ?? 0,
    title: navigationItem.title ?? '',
    navigation_section_id: navigationItem.navigation_section?.id?.toString(),
    page_id: navigationItem.page?.id?.toString(),
  };
}

class Client implements CadmusNavbarAdminClient {
  apolloClient: ApolloClient<unknown>;

  requestsInProgress: {
    savingNavigationItem: boolean;
    deletingNavigationItem: boolean;
    loadingNavigationItems: boolean;
    loadingPages: boolean;
    sortingNavigationItems: boolean;
  };

  errorSubscribers: ((error: Error) => void)[];

  constructor(apolloClient: ApolloClient<unknown>) {
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

  addErrorSubscriber(subscriber: (error: Error) => void): void {
    this.errorSubscribers.push(subscriber);
  }

  onError(error: Error): void {
    this.errorSubscribers.forEach((errorSubscriber) => {
      errorSubscriber(error);
    });
  }

  async fetchNavigationItems(): Promise<NavigationItem[]> {
    this.requestsInProgress.loadingNavigationItems = true;
    try {
      const { data } = await this.apolloClient.query<NavigationItemsAdminQueryData>({
        query: NavigationItemsAdminQuery,
      });
      return data.cmsParent.cmsNavigationItems.map(graphqlNavigationItemToCadmusNavbarAdminObject);
    } catch (error) {
      this.onError(error);
      throw error;
    } finally {
      this.requestsInProgress.loadingNavigationItems = false;
    }
  }

  async fetchPages(): Promise<
    (Omit<NavigationItemsAdminQueryData['cmsParent']['cmsPages'][number], 'id' | 'name'> & {
      id: string;
      name: string;
    })[]
  > {
    this.requestsInProgress.loadingPages = true;
    try {
      const { data } = await this.apolloClient.query<NavigationItemsAdminQueryData>({
        query: NavigationItemsAdminQuery,
      });
      return data.cmsParent.cmsPages.map((page) => ({
        ...page,
        id: page.id.toString(),
        name: page.name ?? 'Untitled page',
      }));
    } catch (error) {
      this.onError(error);
      throw error;
    } finally {
      this.requestsInProgress.loadingPages = false;
    }
  }

  async saveNavigationItem(navigationItem: EditingNavigationItem): Promise<NavigationItem> {
    this.requestsInProgress.savingNavigationItem = true;
    let mutate: () => Promise<FetchResult>;
    let operation: 'create' | 'update';
    const navigationItemInput: CmsNavigationItemInput = {
      title: navigationItem.title,
      navigation_section_id: parseIntOrNull(navigationItem.navigation_section_id ?? ''),
      page_id: parseIntOrNull(navigationItem.page_id ?? ''),
      position: navigationItem.position,
    };
    const navigationItemId = parseIntOrNull(navigationItem.id ?? '');

    try {
      if (navigationItemId != null) {
        operation = 'update';
        mutate = () =>
          this.apolloClient.mutate<
            UpdateNavigationItemMutationData,
            UpdateNavigationItemMutationVariables
          >({
            mutation: UpdateNavigationItemDocument,
            variables: { id: navigationItemId, navigationItem: navigationItemInput },
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
                  cmsParent: {
                    ...data.cmsParent,
                    cmsNavigationItems: [...data.cmsParent.cmsNavigationItems, newNavigationItem],
                  },
                },
              });
            },
          });
      }

      const { data } = await mutate();
      if (!data) {
        throw new Error('No data returned from mutation');
      }
      const mutationResponse =
        operation === 'update' ? data.updateCmsNavigationItem : data.createCmsNavigationItem;

      await this.apolloClient.resetStore();
      return graphqlNavigationItemToCadmusNavbarAdminObject(mutationResponse.cms_navigation_item);
    } catch (error) {
      this.onError(error);
      throw error;
    } finally {
      this.requestsInProgress.savingNavigationItem = false;
    }
  }

  async deleteNavigationItem(navigationItem: NavigationItem): Promise<void> {
    this.requestsInProgress.deletingNavigationItem = true;
    const navigationItemId = parseIntOrNull(navigationItem.id);
    if (navigationItemId == null) {
      throw new Error(`Invalid navigation item ID: ${JSON.stringify(navigationItem.id)}`);
    }

    try {
      await this.apolloClient.mutate<
        DeleteNavigationItemMutationData,
        DeleteNavigationItemMutationVariables
      >({
        mutation: DeleteNavigationItemDocument,
        variables: { id: navigationItemId },
        update: (cache) => {
          const data = cache.readQuery<NavigationItemsAdminQueryData>({
            query: NavigationItemsAdminQuery,
          });
          if (!data) {
            return;
          }
          cache.writeQuery<NavigationItemsAdminQueryData>({
            query: NavigationItemsAdminQuery,
            data: {
              ...data,
              cmsParent: {
                ...data.cmsParent,
                cmsNavigationItems: data.cmsParent.cmsNavigationItems.filter(
                  (item) => item.id !== navigationItemId,
                ),
              },
            },
          });
        },
      });
      await this.apolloClient.resetStore();
    } catch (error) {
      this.onError(error);
      throw error;
    } finally {
      this.requestsInProgress.deletingNavigationItem = false;
    }
  }

  async sortNavigationItems(navigationItems: NavigationItemStore): Promise<void> {
    const sortItems = navigationItems.map((navigationItem) => ({
      id: Number.parseInt(navigationItem.id, 10),
      cms_navigation_item: {
        position: navigationItem.position,
        navigation_section_id: parseIntOrNull(navigationItem.navigation_section_id ?? ''),
      },
    }));

    this.requestsInProgress.sortingNavigationItems = true;
    try {
      await this.apolloClient.mutate<
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
          const newNavigationItems = data.cmsParent.cmsNavigationItems.map((item) => {
            const sortItem = sortItems.find((si) => si.id === item.id);
            if (sortItem == null) {
              return item;
            }

            return { ...item, ...sortItem.cms_navigation_item };
          });

          cache.writeQuery<NavigationItemsAdminQueryData>({
            query: NavigationItemsAdminQuery,
            data: {
              ...data,
              cmsParent: {
                ...data.cmsParent,
                cmsNavigationItems: newNavigationItems,
              },
            },
          });
        },
      });

      await this.apolloClient.resetStore();
    } catch (error) {
      this.onError(error);
      throw error;
    } finally {
      this.requestsInProgress.sortingNavigationItems = false;
    }
  }
}

export default Client;
