import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo-hooks';

import { DeletePage } from './pageAdminDropdownMutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import PopperDropdown from './PopperDropdown';
import { useConfirm } from '../ModalDialogs/Confirm';

function PageAdminDropdown({
  editUrl, pageListUrl, showDelete, pageId,
}) {
  const confirm = useConfirm();
  const deletePage = useMutation(DeletePage);

  const deleteConfirmed = useCallback(
    async () => {
      await deletePage({ variables: { input: { id: pageId } } });
      window.location.href = pageListUrl;
    },
    [deletePage, pageId, pageListUrl],
  );

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
        <a href={editUrl} className="dropdown-item">Edit page</a>
        <a href={pageListUrl} className="dropdown-item">View all pages</a>
        {
          showDelete ? (
            <button
              className="dropdown-item text-danger"
              onClick={() => confirm({
                action: deleteConfirmed,
                prompt: 'Are you sure you want to delete this page?',
                renderError: error => <ErrorDisplay graphQLError={error} />,
              })}
              type="button"
            >
              Delete page
            </button>
          ) : null
        }
      </PopperDropdown>
    </div>
  );
}

PageAdminDropdown.propTypes = {
  editUrl: PropTypes.string.isRequired,
  pageListUrl: PropTypes.string.isRequired,
  showDelete: PropTypes.bool.isRequired,
  pageId: PropTypes.number.isRequired,
};

export default PageAdminDropdown;
