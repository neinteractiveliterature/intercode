import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { useMutation } from '@apollo/react-hooks';

import BucketInput from './BucketInput';
import ErrorDisplay from '../../ErrorDisplay';
import { ChangeSignupBucket } from './mutations.gql';
import useAsyncFunction from '../../useAsyncFunction';

function ChangeBucketModal({ signup, onComplete, onCancel }) {
  const [changeBucketMutate] = useMutation(ChangeSignupBucket);
  const [changeBucket, error, requestInProgress] = useAsyncFunction(changeBucketMutate);
  const [bucketKey, setBucketKey] = useState(null);
  const [prevSignupId, setPrevSignupId] = useState(null);

  const okClicked = useCallback(
    async () => {
      await changeBucket({
        variables: {
          signupId: signup.id,
          bucketKey,
        },
      });
      onComplete();
    },
    [changeBucket, onComplete, signup, bucketKey],
  );

  if (prevSignupId !== (signup || {}).id) {
    setBucketKey((signup || {}).bucket_key);
    setPrevSignupId((signup || {}).id);
  }

  const renderBody = () => {
    if (!signup) {
      return <div />;
    }

    return (
      <div>
        <BucketInput
          signup={signup}
          caption={`Please choose a signup bucket for ${signup.user_con_profile.name_without_nickname}.`}
          name="bucketKey"
          value={bucketKey}
          onChange={setBucketKey}
        />

        <ErrorDisplay graphQLError={error} />
      </div>
    );
  };

  return (
    <Modal visible={signup != null}>
      <div className="modal-header">
        Change signup bucket
      </div>
      <div className="modal-body">
        {renderBody()}
      </div>
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onCancel} type="button">Cancel</button>
        <button
          className="btn btn-primary"
          onClick={okClicked}
          disabled={(bucketKey == null) || requestInProgress}
          type="button"
        >
          OK
        </button>
      </div>
    </Modal>
  );
}

ChangeBucketModal.propTypes = {
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

ChangeBucketModal.defaultProps = {
  signup: null,
};

export default ChangeBucketModal;
