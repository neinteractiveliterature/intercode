import bytes from 'bytes';
import { ErrorDisplay, useConfirm, CopyToClipboardButton } from '@neinteractiveliterature/litform';
import { useTranslation } from 'react-i18next';

import FilePreview from './FilePreview';
import usePageTitle from '../../usePageTitle';
import InPlaceEditor from '../../BuiltInFormControls/InPlaceEditor';
import { CmsFilesAdminQueryDocument } from './queries.generated';
import { useCallback } from 'react';
import FileUploadForm from '../../BuiltInForms/FileUploadForm';
import type { Blob } from '@rails/activestorage';
import { redirect } from 'react-router';
import { CreateCmsFileDocument, DeleteCmsFileDocument, RenameCmsFileDocument } from './mutations.generated';
import { useSubmit } from 'react-router';
import { Route } from './+types/index';
import { apolloClientContext } from 'AppContexts';

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();

  try {
    if (request.method === 'DELETE') {
      const id = formData.get('id')?.toString() ?? '';
      await context.get(apolloClientContext).mutate({
        mutation: DeleteCmsFileDocument,
        variables: { id },
        refetchQueries: [{ query: CmsFilesAdminQueryDocument }],
        awaitRefetchQueries: true,
      });
    } else if (request.method === 'PATCH') {
      const id = formData.get('id')?.toString() ?? '';
      const filename = formData.get('filename')?.toString() ?? '';
      await context.get(apolloClientContext).mutate({
        mutation: RenameCmsFileDocument,
        variables: { id, filename },
        refetchQueries: [{ query: CmsFilesAdminQueryDocument }],
        awaitRefetchQueries: true,
      });
    } else if (request.method === 'POST') {
      const signedBlobId = formData.get('signedBlobId')?.toString() ?? '';
      await context.get(apolloClientContext).mutate({
        mutation: CreateCmsFileDocument,
        variables: { signedBlobId },
        refetchQueries: [{ query: CmsFilesAdminQueryDocument }],
        awaitRefetchQueries: true,
      });
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (e) {
    return e;
  }

  return redirect('/cms_files');
}

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.get(apolloClientContext).query({ query: CmsFilesAdminQueryDocument });
  return data;
}

function CmsFilesAdmin({ loaderData: data }: Route.ComponentProps): JSX.Element {
  const confirm = useConfirm();
  const { t } = useTranslation();
  const submit = useSubmit();

  usePageTitle('CMS Files');

  const renameFile = (id: string, filename: string) => submit({ id, filename }, { method: 'PATCH' });

  const onUpload = useCallback(
    async (blob: Blob) => {
      submit({ signedBlobId: blob.signed_id }, { method: 'POST' });
    },
    [submit],
  );

  return (
    <>
      <div className="cms-file-card-deck mb-4">
        {data?.cmsParent.cmsFiles.map((cmsFile) => (
          <div className="card" key={cmsFile.id}>
            <div className="card-header">
              {cmsFile.current_ability_can_delete && (
                <div className="float-end">
                  <button
                    type="button"
                    className="btn btn-outline-danger px-2 py-1"
                    onClick={() =>
                      confirm({
                        prompt: `Are you sure you want to delete ${cmsFile.file.filename}?`,
                        action: () => submit({ id: cmsFile.id }, { method: 'DELETE' }),
                        renderError: (deleteError) => <ErrorDisplay graphQLError={deleteError} />,
                      })
                    }
                    aria-label={t('buttons.delete')}
                  >
                    <i className="bi-trash-fill" aria-hidden="true" />
                  </button>
                </div>
              )}
              <small className="text-break fw-bold">
                <InPlaceEditor
                  value={cmsFile.file.filename}
                  onChange={(filename: string) => renameFile(cmsFile.id, filename)}
                />
              </small>
              <CopyToClipboardButton
                className="btn btn-sm btn-outline-primary"
                defaultText={t('cms.files.copyEmbedCode')}
                copiedText={t('copyToClipboard.defaultSuccess')}
                text={`{% file_url ${cmsFile.file.filename} %}`}
                iconSet="bootstrap-icons"
              />
            </div>
            <div className="card-body text-center py-2">
              <a href={cmsFile.file.url} aria-label={cmsFile.file.filename}>
                <FilePreview
                  url={cmsFile.file.thumbnailUrl}
                  contentType={cmsFile.file.content_type}
                  filename={cmsFile.file.filename}
                />
              </a>
            </div>
            <div className="card-footer text-end">
              <small>
                {'Size: '}
                {bytes.format(cmsFile.file.byte_size)}
              </small>
            </div>
          </div>
        ))}
      </div>
      {data?.currentAbility.can_create_cms_files && <FileUploadForm onUpload={onUpload} />}
    </>
  );
}

export default CmsFilesAdmin;
