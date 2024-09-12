import { ActionFunction, json, useNavigate } from 'react-router';
import { client } from '../../../useIntercodeApolloClient';
import { ForceConfirmSignupDocument } from '../mutations.generated';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useFetcher } from 'react-router-dom';
import { useSingleSignupLoader } from '../loaders';
import BucketInput from '../BucketInput';
import { ErrorDisplay } from '@neinteractiveliterature/litform';
import { ApolloError } from '@apollo/client';
import Modal from 'react-bootstrap4-modal';

export const action: ActionFunction = async ({ request, params: { id } }) => {
  try {
    const formData = await request.formData();
    const { data } = await client.mutate({
      mutation: ForceConfirmSignupDocument,
      variables: {
        signupId: id ?? '',
        bucketKey: formData.get('bucket_key')?.toString(),
      },
    });
    return json(data);
  } catch (error) {
    return error;
  }
};

function ForceConfirmSignupModal(): JSX.Element {
  const data = useSingleSignupLoader();
  const [bucketKey, setBucketKey] = useState<string | null>();
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const error = fetcher.data instanceof Error ? fetcher.data : undefined;
  const navigate = useNavigate();
  const signup = data.convention.signup;

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data && !error) {
      navigate('..');
    }
  }, [error, fetcher.data, fetcher.state, navigate]);

  const onClickOK = async () => {
    if (!signup || !bucketKey) {
      return;
    }

    fetcher.submit({ bucket_key: bucketKey }, { action: '../force_confirm', method: 'PATCH' });
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

  const disableOK = bucketKey == null || fetcher.state != 'idle';

  return (
    <Modal visible={signup != null}>
      <div className="modal-header">{t('events.signupAdmin.forceConfirmSignup.header')}</div>
      <div className="modal-body">{renderBody()}</div>
      <div className="modal-footer">
        <Link type="button" className="btn btn-secondary" to="..">
          {t('buttons.cancel')}
        </Link>
        <button type="button" className="btn btn-primary" onClick={onClickOK} disabled={disableOK}>
          {t('buttons.ok')}
        </button>
      </div>
    </Modal>
  );
}

export const Component = ForceConfirmSignupModal;
