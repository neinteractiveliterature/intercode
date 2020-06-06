import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { PageAdminDropdownQuery } from './queries.gql';
import { DeletePage } from '../CmsAdmin/CmsPagesAdmin/mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import PopperDropdown from '../UIComponents/PopperDropdown';
import { useGraphQLConfirm } from '../ModalDialogs/Confirm';
import MenuIcon from '../NavigationBar/MenuIcon';

function PageAdminDropdown({ showEdit, showDelete, pageId }) {
  const history = useHistory();
  const confirm = useGraphQLConfirm();
  const [deletePage] = useMutation(DeletePage);
  const { data, loading, error } = useQuery(PageAdminDropdownQuery, { variables: { id: pageId } });

  const deleteConfirmed = useCallback(
    async () => {
      await deletePage({ variables: { id: pageId } });
      history.replace('/cms_pages');
    },
    [deletePage, pageId, history],
  );

  if (loading) {
    return null;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const layoutId = data.cmsPage.cms_layout
    ? data.cmsPage.cms_layout.id
    : data.cmsParent.default_layout.id;

  return (
    <div>
      <PopperDropdown
        renderReference={({ ref, toggle }) => (
          <button type="button" className="btn btn-dark dropdown-toggle" ref={ref} onClick={toggle}>
            <i className="fa fa-pencil-square-o">
              <span className="sr-only">
                Admin options
              </span>
            </i>
          </button>
        )}
        placement="bottom-end"
      >
        {showEdit
          ? (
            <>
              <Link to={`/cms_pages/${pageId}/edit`} className="dropdown-item">
                <MenuIcon icon="fa-file-text-o" />
                Edit page
              </Link>
              <Link to={`/cms_layouts/${layoutId}/edit`} className="dropdown-item">
                <MenuIcon icon="fa-columns" />
                Edit layout
              </Link>
              {data.cmsPage.referenced_partials.map((partial) => (
                <Link to={`/cms_partials/${partial.id}/edit`} className="dropdown-item">
                  <MenuIcon icon="fa-paperclip" />
                  Edit partial “
                  {partial.name}
                  ”
                </Link>
              ))}
            </>
          )
          : (
            <>
              <Link to={`/cms_pages/${pageId}/view_source`} className="dropdown-item">
                <MenuIcon icon="fa-file-text-o" />
                View page source
              </Link>
              <Link to={`/cms_layouts/${layoutId}/view_source`} className="dropdown-item">
                <MenuIcon icon="fa-columns" />
                View layout source
              </Link>
              {data.cmsPage.referenced_partials.map((partial) => (
                <Link to={`/cms_partials/${partial.id}/view_source`} className="dropdown-item">
                  <MenuIcon icon="fa-paperclip" />
                  View partial “
                  {partial.name}
                  ”
                </Link>
              ))}
            </>
          )}
        <Link to="/cms_pages" className="dropdown-item">
          <MenuIcon icon="fa-files-o" />
          View all pages
        </Link>
        {
          showDelete ? (
            <button
              className="dropdown-item text-danger"
              onClick={() => confirm({
                action: deleteConfirmed,
                prompt: 'Are you sure you want to delete this page?',
              })}
              type="button"
            >
              <MenuIcon icon="fa-trash-o" colorClass="text-danger" />
              Delete page
            </button>
          ) : null
        }
      </PopperDropdown>
    </div>
  );
}

PageAdminDropdown.propTypes = {
  showEdit: PropTypes.bool.isRequired,
  showDelete: PropTypes.bool.isRequired,
  pageId: PropTypes.number.isRequired,
};

export default PageAdminDropdown;
