import { useState, useCallback } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { ApolloError } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import BucketInput from './BucketInput';
import useAsyncFunction from '../../useAsyncFunction';
import { useChangeSignupBucketMutation } from './mutations.generated';
import { SignupFieldsFragment } from './queries.generated';

export type ChangeBucketModalProps = {
  signup?: SignupFieldsFragment;
  onComplete: () => void;
  onCancel: () => void;
};

function ChangeBucketModal({ signup, onComplete, onCancel }: ChangeBucketModalProps): JSX.Element {
  const [changeBucketMutate] = useChangeSignupBucketMutation();
  const [changeBucket, error, requestInProgress] = useAsyncFunction(changeBucketMutate);
  const [bucketKey, setBucketKey] = useState<string | null>();
  const [prevSignupId, setPrevSignupId] = useState<string>();
  const { t } = useTranslation();

  const okClicked = useCallback(async () => {
    if (!bucketKey || !signup) {
      return;
    }

    await changeBucket({
      variables: {
        signupId: signup.id,
        bucketKey,
      },
    });
    onComplete();
  }, [changeBucket, onComplete, signup, bucketKey]);

  if (prevSignupId !== signup?.id) {
    setBucketKey(signup?.bucket_key);
    setPrevSignupId(signup?.id);
  }

  const renderBody = () => {
    if (!signup) {
      return <div />;
    }

    return (
      <div>
        <BucketInput
          signup={signup}
          caption={t('events.signupAdmin.changeBucketInputCaption', {
            name: signup.user_con_profile.name_without_nickname,
          })}
          name="bucketKey"
          value={bucketKey}
          onChange={setBucketKey}
        />
        <ErrorDisplay graphQLError={error as ApolloError} />
      </div>
    );
  };

  return (
    <Modal visible={signup != null}>
      <div className="modal-header">{t('events.signupAdmin.changeBucketHeader')}</div>
      <div className="modal-body">{renderBody()}</div>
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onCancel} type="button">
          {t('buttons.cancel')}
        </button>
        <button
          className="btn btn-primary"
          onClick={okClicked}
          disabled={bucketKey == null || requestInProgress}
          type="button"
        >
          {t('buttons.ok')}
        </button>
      </div>
    </Modal>
  );
}

export default ChangeBucketModal;
