import { ApolloClient, FetchResult } from '@apollo/client';
import { CadmusNavbarAdminClient } from 'cadmus-navbar-admin/lib/CadmusNavbarAdminClient';
import { NavigationItem } from 'cadmus-navbar-admin/lib/NavigationItem';
import { EditingNavigationItem } from 'cadmus-navbar-admin/lib/EditingNavigationItemContext';
import NavigationItemStore from 'cadmus-navbar-admin/lib/NavigationItemStore';
import { NavigationItemsAdminQuery } from './queries';
import { AdminNavigationItemFieldsFragment, NavigationItemsAdminQueryData } from './queries.generated';
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
import { CmsNavigationItemInput, UpdateCmsNavigationItemInput } from '../../graphqlTypes.generated';

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
    let mutate: () => Promise<FetchResult<CreateNavigationItemMutationData | UpdateNavigationItemMutationData>>;
    const navigationItemInput: CmsNavigationItemInput = {
      title: navigationItem.title,
      navigationSectionId: navigationItem.navigation_section_id,
      pageId: navigationItem.page_id,
      position: navigationItem.position,
    };
    const navigationItemId = navigationItem.id;

    try {
      if (navigationItemId != null) {
        mutate = () =>
          this.apolloClient.mutate<UpdateNavigationItemMutationData, UpdateNavigationItemMutationVariables>({
            mutation: UpdateNavigationItemDocument,
            variables: { id: navigationItemId, navigationItem: navigationItemInput },
          });
      } else {
        mutate = () =>
          this.apolloClient.mutate<CreateNavigationItemMutationData, CreateNavigationItemMutationVariables>({
            mutation: CreateNavigationItemDocument,
            variables: { navigationItem: navigationItemInput },
          });
      }

      const { data } = await mutate();
      if (!data) {
        throw new Error('No data returned from mutation');
      }
      const mutationResponse =
        'updateCmsNavigationItem' in data ? data.updateCmsNavigationItem : data.createCmsNavigationItem;

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
    const navigationItemId = navigationItem.id;

    try {
      await this.apolloClient.mutate<DeleteNavigationItemMutationData, DeleteNavigationItemMutationVariables>({
        mutation: DeleteNavigationItemDocument,
        variables: { id: navigationItemId },
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
    const sortItems: UpdateCmsNavigationItemInput[] = navigationItems.map((navigationItem) => ({
      id: navigationItem.id,
      cms_navigation_item: {
        position: navigationItem.position,
        navigationSectionId: navigationItem.navigation_section_id,
      },
    }));

    this.requestsInProgress.sortingNavigationItems = true;
    try {
      await this.apolloClient.mutate<SortNavigationItemsMutationData, SortNavigationItemsMutationVariables>({
        mutation: SortNavigationItemsDocument,
        variables: { sortItems },
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
