import { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGraphQLConfirm } from '@neinteractiveliterature/litform';

import MenuIcon from '../NavigationBar/MenuIcon';
import { DropdownMenu } from '../UIComponents/DropdownMenu';
import { useDeletePageMutation } from '../CmsAdmin/CmsPagesAdmin/mutations.generated';
import { PageAdminDropdownQueryData, usePageAdminDropdownQuery } from './queries.generated';
import { LoadQueryWithVariablesWrapper } from '../GraphqlLoadingWrappers';
import { useApolloClient } from '@apollo/client';

export type PageAdminDropdownProps = {
  showEdit: boolean;
  showDelete: boolean;
  pageId: string;
};

function getEffectiveLayout(
  cmsPage: PageAdminDropdownQueryData['cmsParent']['cmsPage'],
  cmsParent: PageAdminDropdownQueryData['cmsParent'],
) {
  const specificLayout = cmsPage.cms_layout;
  if (specificLayout) {
    return specificLayout;
  }

  if (cmsParent.__typename === 'Convention') {
    return cmsParent.defaultLayout;
  }

  return cmsParent.root_site_default_layout;
}

export default LoadQueryWithVariablesWrapper(
  usePageAdminDropdownQuery,
  ({ pageId }: PageAdminDropdownProps) => ({ id: pageId }),
  function PageAdminDropdown({ showEdit, showDelete, pageId, data }): JSX.Element {
    const navigate = useNavigate();
    const confirm = useGraphQLConfirm();
    const [deletePage] = useDeletePageMutation();
    const apolloClient = useApolloClient();

    const deleteConfirmed = useCallback(async () => {
      await deletePage({ variables: { id: pageId } });
      navigate('/cms_pages', { replace: true });
      await apolloClient.resetStore();
    }, [deletePage, apolloClient, pageId, navigate]);

    const { cmsParent } = data;
    const { cmsPage } = cmsParent;

    const layoutId = getEffectiveLayout(cmsPage, cmsParent)?.id;

    return (
      <div>
        <DropdownMenu
          buttonClassName="btn btn-dark dropdown-toggle"
          buttonContent={
            <i className="bi-pencil-square">
              <span className="visually-hidden">Admin options</span>
            </i>
          }
          popperOptions={{ placement: 'bottom-end' }}
        >
          {showEdit ? (
            <>
              <Link to={`/cms_pages/${pageId}/edit`} className="dropdown-item">
                <MenuIcon icon="bi-file-earmark-text" />
                Edit page
              </Link>
              <Link to={`/cms_layouts/${layoutId}/edit`} className="dropdown-item">
                <MenuIcon icon="bi-layout-split" />
                Edit layout
              </Link>
              {cmsPage.referenced_partials.map((partial) => (
                <Link to={`/cms_partials/${partial.id}/edit`} className="dropdown-item" key={partial.id}>
                  <MenuIcon icon="bi-paperclip" />
                  Edit partial “{partial.name}”
                </Link>
              ))}
            </>
          ) : (
            <>
              <Link to={`/cms_pages/${pageId}/view_source`} className="dropdown-item">
                <MenuIcon icon="bi-file-earmark-text" />
                View page source
              </Link>
              <Link to={`/cms_layouts/${layoutId}/view_source`} className="dropdown-item">
                <MenuIcon icon="bi-layout-split" />
                View layout source
              </Link>
              {cmsPage.referenced_partials.map((partial) => (
                <Link to={`/cms_partials/${partial.id}/view_source`} className="dropdown-item" key={partial.id}>
                  <MenuIcon icon="bi-paperclip" />
                  View partial “{partial.name}”
                </Link>
              ))}
            </>
          )}
          <Link to="/cms_pages" className="dropdown-item">
            <MenuIcon icon="bi-files" />
            View all pages
          </Link>
          {showDelete ? (
            <button
              className="dropdown-item text-danger"
              onClick={() =>
                confirm({
                  action: deleteConfirmed,
                  prompt: 'Are you sure you want to delete this page?',
                })
              }
              type="button"
            >
              <MenuIcon icon="bi-trash" colorClass="text-danger" />
              Delete page
            </button>
          ) : null}
        </DropdownMenu>
      </div>
    );
  },
);
