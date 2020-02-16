import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { useMutation } from '@apollo/react-hooks';

import BucketInput from './BucketInput';
import ErrorDisplay from '../../ErrorDisplay';
import { ForceConfirmSignup } from './mutations.gql';
import useAsyncFunction from '../../useAsyncFunction';

function ForceConfirmSignupModal({ signup, onComplete, onCancel }) {
  const [bucketKey, setBucketKey] = useState(null);
  const [forceConfirmMutate] = useMutation(ForceConfirmSignup);
  const [forceConfirm, error, inProgress] = useAsyncFunction(forceConfirmMutate);

  const onClickOK = async () => {
    await forceConfirm({
      variables: { signupId: signup.id, bucketKey },
    });
    onComplete();
  };

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

        <p className="text-danger">
          Caution: this operation ignores registration bucket capacity (and therefore can overfill
          the event run).  Doing this may have
          unexpected effects if other attendees drop out of the event.  Adjusting the event capacity
          after doing this is strongly recommended.
        </p>

        <ErrorDisplay graphQLError={error} />
      </div>
    );
  };

  const disableOK = (bucketKey == null) || inProgress;

  return (
    <Modal visible={signup != null}>
      <div className="modal-header">
        Force signup into run
      </div>
      <div className="modal-body">
        {renderBody()}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onClickOK}
          disabled={disableOK}
        >
          OK
        </button>
      </div>
    </Modal>
  );
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
