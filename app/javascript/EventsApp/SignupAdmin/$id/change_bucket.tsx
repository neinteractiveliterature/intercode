import { useState, useCallback, useEffect } from 'react';
import { Modal } from 'react-bootstrap4-modal';

import { useTranslation } from 'react-i18next';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { Link, useFetcher } from 'react-router';
import { data, useNavigate } from 'react-router';
import { apolloClientContext } from 'AppContexts';
import { ChangeSignupBucketDocument } from '../mutations.generated';
import BucketInput from '../BucketInput';
import { useSingleSignupLoader } from '../loaders';
import type { Route } from './+types/change_bucket';

export const clientAction = async ({ context, request, params: { id } }: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
  try {
    const formData = await request.formData();
    const result = await client.mutate({
      mutation: ChangeSignupBucketDocument,
      variables: {
        signupId: id ?? '',
        bucketId: formData.get('bucket_id')?.toString() ?? '',
      },
    });
    return data(result.data);
  } catch (error) {
    return error;
  }
};

function ChangeBucketModal(): React.JSX.Element {
  const data = useSingleSignupLoader();
  const [bucketId, setBucketId] = useState<string | null>();
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
    if (!bucketId || !signup) {
      return;
    }

    fetcher.submit({ bucket_id: bucketId }, { action: '.', method: 'PATCH' });
  }, [fetcher, signup, bucketId]);

  if (prevSignupId !== signup?.id) {
    setBucketId(signup?.bucket?.id);
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
          name="bucketId"
          value={bucketId}
          onChange={setBucketId}
        />
        <ErrorDisplay graphQLError={error} />
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
          disabled={bucketId == null || fetcher.state != 'idle'}
          type="button"
        >
          {t('buttons.ok')}
        </button>
        <ErrorDisplay graphQLError={error} />
      </div>
    </Modal>
  );
}

export default ChangeBucketModal;
