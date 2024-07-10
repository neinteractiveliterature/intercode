import { useState } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { ApolloError } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import BucketInput from './BucketInput';
import useAsyncFunction from '../../useAsyncFunction';
import { SignupFieldsFragment } from './queries.generated';
import { useForceConfirmSignupMutation } from './mutations.generated';

export type ForceConfirmSignupModalProps = {
  signup?: SignupFieldsFragment;
  onComplete: () => void;
  onCancel: () => void;
};

function ForceConfirmSignupModal({ signup, onComplete, onCancel }: ForceConfirmSignupModalProps): JSX.Element {
  const [bucketKey, setBucketKey] = useState<string | null>();
  const [forceConfirmMutate] = useForceConfirmSignupMutation();
  const [forceConfirm, error, inProgress] = useAsyncFunction(forceConfirmMutate);
  const { t } = useTranslation();

  const onClickOK = async () => {
    if (!signup || !bucketKey) {
      return;
    }

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
          caption={t('events.signupAdmin.forceConfirmSignup.bucketInputCaption', {
            name: signup.user_con_profile.name_without_nickname,
          })}
          name="bucketKey"
          value={bucketKey}
          onChange={setBucketKey}
        />
        <p className="text-danger">{t('events.signupAdmin.forceConfirmSignup.overfillWarning')}</p>
        <ErrorDisplay graphQLError={error as ApolloError} />
      </div>
    );
  };

  const disableOK = bucketKey == null || inProgress;

  return (
    <Modal visible={signup != null}>
      <div className="modal-header">{t('events.signupAdmin.forceConfirmSignup.header')}</div>
      <div className="modal-body">{renderBody()}</div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          {t('buttons.cancel')}
        </button>
        <button type="button" className="btn btn-primary" onClick={onClickOK} disabled={disableOK}>
          {t('buttons.ok')}
        </button>
      </div>
    </Modal>
  );
}

export default ForceConfirmSignupModal;
