import React from 'react';
import PropTypes from 'prop-types';
import { ConfirmModal } from 'react-bootstrap4-modal';
import { graphql } from 'react-apollo';

import { DeletePage } from './pageAdminDropdownMutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import PopperDropdown from './PopperDropdown';

@graphql(DeletePage, { name: 'deletePage' })
class PageAdminDropdown extends React.Component {
  static propTypes = {
    editUrl: PropTypes.string.isRequired,
    pageListUrl: PropTypes.string.isRequired,
    showDelete: PropTypes.bool.isRequired,
    deletePage: PropTypes.func.isRequired,
    pageId: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { confirmingDelete: false };
  }

  deletePageClicked = () => { this.setState({ confirmingDelete: true }); }

  deleteCanceled = () => { this.setState({ confirmingDelete: false }); }

  deleteConfirmed = async () => {
    try {
      await this.props.deletePage({ variables: { input: { id: this.props.pageId } } });
      window.location.href = this.props.pageListUrl;
    } catch (error) {
      this.setState({ confirmingDelete: false, error });
    }
  }

  render = () => {
    const {
      editUrl,
      pageListUrl,
      showDelete,
    } = this.props;

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
              <button className="dropdown-item text-danger" onClick={this.deletePageClicked} type="button">
                Delete page
              </button>
            ) : null
          }
        </PopperDropdown>
        <ConfirmModal
          visible={this.state.confirmingDelete}
          onOK={this.deleteConfirmed}
          onCancel={this.deleteCanceled}
        >
          Are you sure you want to delete this page?
        </ConfirmModal>
        <ErrorDisplay graphQLError={this.state.error} />
      </div>
    );
  }
}

export default PageAdminDropdown;
