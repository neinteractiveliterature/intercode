import React from 'react';
import PropTypes from 'prop-types';
import { performRequest } from '../HTTPUtils';

class ResourceForm extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    baseUrl: PropTypes.string.isRequired,
    resourceId: PropTypes.number,
    getSubmitRequestBody: PropTypes.func.isRequired,
    renderSubmitSection: PropTypes.func,
    submitText: PropTypes.string,
    submitDisabled: PropTypes.bool,
  };

  static defaultProps = {
    resourceId: null,
    submitDisabled: false,
    submitText: "Save",
    renderSubmitSection: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isSubmitting: false,
    };
  }

  isUpdate = () => this.props.resourceId

  resourceUrl = () => {
    if (this.isUpdate()) {
      return `${this.props.baseUrl}/${this.props.resourceId}`;
    }

    return this.props.baseUrl;
  }

  submitClicked = (e) => {
    e.preventDefault();

    this.setState({ isSubmitting: true }, () => {
      performRequest(this.resourceUrl(), {
        method: (this.isUpdate() ? 'PATCH' : 'POST'),
        body: this.props.getSubmitRequestBody(),
      }).then(() => {
        window.location.href = this.props.baseUrl;
      }).catch((error) => {
        this.setState({ error: error.response.data, isSubmitting: false });
      });
    });
  }

  renderError = () => {
    if (this.state.error) {
      return (
        <div className="alert alert-danger">{this.state.error}</div>
      );
    }

    return null;
  }

  renderSubmitSection = () => {
    const submitDisabled = (this.props.submitDisabled || this.state.isSubmitting);

    if (this.props.renderSubmitSection) {
      return this.props.renderSubmitSection(this.submitClicked, submitDisabled);
    }

    return (
      <div className="form-group">
        <input
          type="submit"
          className="btn btn-primary"
          onClick={this.submitClicked}
          value={this.props.submitText}
          disabled={this.props.submitDisabled || this.state.isSubmitting}
        />
      </div>
    );
  }

  render = () => (
    <form className="form">
      {this.renderError()}
      {this.props.children}
      {this.renderSubmitSection()}
    </form>
  )
}

export default ResourceForm;
