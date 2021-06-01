import { useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useGraphQLConfirm, ErrorDisplay } from '@neinteractiveliterature/litform';

import MenuIcon from '../NavigationBar/MenuIcon';
import { DropdownMenu } from '../UIComponents/DropdownMenu';
import { useDeletePageMutation } from '../CmsAdmin/CmsPagesAdmin/mutations.generated';
import { PageAdminDropdownQueryData, usePageAdminDropdownQuery } from './queries.generated';

export type PageAdminDropdownProps = {
  showEdit: boolean;
  showDelete: boolean;
  pageId: number;
};

function getEffectiveLayout(
  cmsPage: PageAdminDropdownQueryData['cmsPage'],
  cmsParent: PageAdminDropdownQueryData['cmsParent'],
) {
  const specificLayout = cmsPage.cms_layout;
  if (specificLayout) {
    return specificLayout;
  }

  if (cmsParent.__typename === 'Convention') {
    return cmsParent.default_layout;
  }

  return cmsParent.root_site_default_layout;
}

function PageAdminDropdown({ showEdit, showDelete, pageId }: PageAdminDropdownProps) {
  const history = useHistory();
  const confirm = useGraphQLConfirm();
  const [deletePage] = useDeletePageMutation();
  const { data, loading, error } = usePageAdminDropdownQuery({ variables: { id: pageId } });

  const deleteConfirmed = useCallback(async () => {
    await deletePage({ variables: { id: pageId } });
    history.replace('/cms_pages');
  }, [deletePage, pageId, history]);

  if (loading) {
    return null;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const { cmsParent, cmsPage } = data!;

  const layoutId = getEffectiveLayout(cmsPage, cmsParent)?.id;

  return (
    <div>
      <DropdownMenu
        buttonClassName="btn btn-dark dropdown-toggle"
        buttonContent={
          <i className="fa fa-pencil-square-o">
            <span className="visually-hidden">Admin options</span>
          </i>
        }
        popperOptions={{ placement: 'bottom-end' }}
      >
        {showEdit ? (
          <>
            <Link to={`/cms_pages/${pageId}/edit`} className="dropdown-item">
              <MenuIcon icon="fa-file-text-o" />
              Edit page
            </Link>
            <Link to={`/cms_layouts/${layoutId}/edit`} className="dropdown-item">
              <MenuIcon icon="fa-columns" />
              Edit layout
            </Link>
            {cmsPage.referenced_partials.map((partial) => (
              <Link
                to={`/cms_partials/${partial.id}/edit`}
                className="dropdown-item"
                key={partial.id}
              >
                <MenuIcon icon="fa-paperclip" />
                Edit partial “{partial.name}”
              </Link>
            ))}
          </>
        ) : (
          <>
            <Link to={`/cms_pages/${pageId}/view_source`} className="dropdown-item">
              <MenuIcon icon="fa-file-text-o" />
              View page source
            </Link>
            <Link to={`/cms_layouts/${layoutId}/view_source`} className="dropdown-item">
              <MenuIcon icon="fa-columns" />
              View layout source
            </Link>
            {cmsPage.referenced_partials.map((partial) => (
              <Link
                to={`/cms_partials/${partial.id}/view_source`}
                className="dropdown-item"
                key={partial.id}
              >
                <MenuIcon icon="fa-paperclip" />
                View partial “{partial.name}”
              </Link>
            ))}
          </>
        )}
        <Link to="/cms_pages" className="dropdown-item">
          <MenuIcon icon="fa-files-o" />
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
            <MenuIcon icon="fa-trash-o" colorClass="text-danger" />
            Delete page
          </button>
        ) : null}
      </DropdownMenu>
    </div>
  );
}

export default PageAdminDropdown;
