import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { Mutation } from 'react-apollo';

import BucketInput from './BucketInput';
import ErrorDisplay from '../../ErrorDisplay';
import { ForceConfirmSignup } from './mutations.gql';

class ForceConfirmSignupModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bucketKey: null,
      requestInProgress: false,
    };
  }

  onClickOK = async (forceConfirm) => {
    this.setState({ requestInProgress: true });
    try {
      await forceConfirm({
        variables: {
          signupId: this.props.signup.id,
          bucketKey: this.state.bucketKey,
        },
      });
      this.props.onComplete();
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ requestInProgress: false });
    }
  }

  bucketKeyChanged = (bucketKey) => this.setState({ bucketKey })

  renderBody = () => {
    const { signup } = this.props;

    if (!signup) {
      return <div />;
    }

    return (
      <div>
        <BucketInput
          signup={signup}
          caption={`Please choose a signup bucket for ${signup.user_con_profile.name_without_nickname}.`}
          name="bucketKey"
          value={this.state.bucketKey}
          onChange={this.bucketKeyChanged}
        />

        <p className="text-danger">
          Caution: this operation ignores registration bucket capacity (and therefore can overfill
          the event run).  Doing this may have
          unexpected effects if other attendees drop out of the event.  Adjusting the event capacity
          after doing this is strongly recommended.
        </p>

        <ErrorDisplay graphQLError={this.state.error} />
      </div>
    );
  }

  render = () => {
    const { signup } = this.props;

    const disableOK = (this.state.bucketKey == null) || this.state.requestInProgress;

    return (
      <Modal visible={signup != null}>
        <div className="modal-header">
          Force signup into run
        </div>
        <div className="modal-body">
          {this.renderBody()}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={this.props.onCancel}>Cancel</button>
          <Mutation mutation={ForceConfirmSignup}>
            {(forceConfirm) => (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => this.onClickOK(forceConfirm)}
                disabled={disableOK}
              >
                OK
              </button>
            )}
          </Mutation>
        </div>
      </Modal>
    );
  }
}

ForceConfirmSignupModal.propTypes = {
  signup: PropTypes.shape({
    id: PropTypes.number.isRequired,
    user_con_profile: PropTypes.shape({
      name_without_nickname: PropTypes.string.isRequired,
    }).isRequired,
    requested_bucket_key: PropTypes.string,
    run: PropTypes.shape({
      event: PropTypes.shape({
        registration_policy: PropTypes.shape({
          buckets: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
          })).isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
  }),
  onComplete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

ForceConfirmSignupModal.defaultProps = {
  signup: null,
};

export default ForceConfirmSignupModal;
