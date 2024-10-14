import { useState, useCallback, useEffect } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { ApolloError } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { Link, useFetcher } from 'react-router';
import { ActionFunction, json, useNavigate } from 'react-router';
import { client } from '../../../useIntercodeApolloClient';
import { ChangeSignupBucketDocument } from '../mutations.generated';
import BucketInput from '../BucketInput';
import { useSingleSignupLoader } from '../loaders';

export const action: ActionFunction = async ({ request, params: { id } }) => {
  try {
    const formData = await request.formData();
    const { data } = await client.mutate({
      mutation: ChangeSignupBucketDocument,
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

function ChangeBucketModal(): JSX.Element {
  const data = useSingleSignupLoader();
  const [bucketKey, setBucketKey] = useState<string | null>();
  const [prevSignupId, setPrevSignupId] = useState<string>();
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const error = fetcher.data instanceof Error ? fetcher.data : undefined;
  const signup = data.convention.signup;
  const navigate = useNavigate();

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data && !error) {
      navigate('..');
    }
  }, [error, fetcher.data, fetcher.state, navigate]);

  const okClicked = useCallback(async () => {
    if (!bucketKey || !signup) {
      return;
    }

    fetcher.submit({ bucket_key: bucketKey }, { action: '.', method: 'PATCH' });
  }, [fetcher, signup, bucketKey]);

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
        <Link className="btn btn-secondary" to=".." type="button">
          {t('buttons.cancel')}
        </Link>
        <button
          className="btn btn-primary"
          onClick={okClicked}
          disabled={bucketKey == null || fetcher.state != 'idle'}
          type="button"
        >
          {t('buttons.ok')}
        </button>
        <ErrorDisplay graphQLError={error as ApolloError} />
      </div>
    </Modal>
  );
}

export const Component = ChangeBucketModal;
