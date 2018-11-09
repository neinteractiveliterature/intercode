import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { Mutation } from 'react-apollo';
import BucketInput from './BucketInput';
import ErrorDisplay from '../ErrorDisplay';
import { ChangeSignupBucket } from './mutations.gql';

class ChangeBucketModal extends React.Component {
  static propTypes = {
    signup: PropTypes.shape({
      id: PropTypes.number.isRequired,
      user_con_profile: PropTypes.shape({
        name_without_nickname: PropTypes.string.isRequired,
      }).isRequired,
      bucket_key: PropTypes.string,
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

  static defaultProps = {
    signup: null,
  };

  static getDerivedStateFromProps = nextProps => ({
    bucketKey: (nextProps.signup || {}).bucket_key,
  })

  constructor(props) {
    super(props);

    this.state = {
      requestInProgress: false,
    };
  }

  onClickOK = async (changeBucket) => {
    this.setState({ requestInProgress: true, error: null });
    try {
      await changeBucket({
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

  bucketKeyChanged = bucketKey => this.setState({ bucketKey })

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
          Change signup bucket
        </div>
        <div className="modal-body">
          {this.renderBody()}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={this.props.onCancel}>Cancel</button>
          <Mutation mutation={ChangeSignupBucket}>
            {changeBucket => (
              <button
                className="btn btn-primary"
                onClick={() => this.onClickOK(changeBucket)}
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

export default ChangeBucketModal;
