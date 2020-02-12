import React, { useMemo } from 'react';
import chunk from 'lodash-es/chunk';
import bytes from 'bytes';
import { useMutation, useQuery } from 'react-apollo-hooks';

import { CmsFilesAdminQuery } from './queries.gql';
import { DeleteCmsFile, RenameCmsFile } from './mutations.gql';
import FilePreview from './FilePreview';
import FileUploadForm from './FileUploadForm';
import { useDeleteMutation } from '../../MutationUtils';
import { useConfirm } from '../../ModalDialogs/Confirm';
import ErrorDisplay from '../../ErrorDisplay';
import usePageTitle from '../../usePageTitle';
import InPlaceEditor from '../../BuiltInFormControls/InPlaceEditor';
import PageLoadingIndicator from '../../PageLoadingIndicator';

function CmsFilesAdmin() {
  const { data, loading, error } = useQuery(CmsFilesAdminQuery);
  const deleteFileMutate = useDeleteMutation(DeleteCmsFile, {
    query: CmsFilesAdminQuery,
    arrayPath: ['cmsFiles'],
    idVariablePath: ['id'],
  });
  const [renameFileMutate] = useMutation(RenameCmsFile);
  const confirm = useConfirm();

  usePageTitle('CMS Files');

  const fileChunks = useMemo(
    () => {
      if (loading || error) {
        return [];
      }

      return chunk(data.cmsFiles, 4);
    },
    [data, loading, error],
  );

  const deleteFile = (id) => deleteFileMutate({ variables: { id } });
  const renameFile = (id, filename) => renameFileMutate({ variables: { id, filename } });

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      {fileChunks.map((files) => (
        <div className="card-deck mb-4" key={files[0].id}>
          {files.map((cmsFile) => (
            <div className="card" key={cmsFile.id}>
              <div className="card-header">
                {cmsFile.current_ability_can_delete && (
                  <div className="float-right">
                    <button
                      type="button"
                      className="btn btn-outline-danger px-2 py-1"
                      onClick={() => confirm({
                        prompt: `Are you sure you want to delete ${cmsFile.filename}?`,
                        action: () => deleteFile(cmsFile.id),
                        renderError: (deleteError) => <ErrorDisplay graphQLError={deleteError} />,
                      })}
                    >
                      <i className="fa fa-trash" aria-hidden="true" />
                    </button>
                  </div>
                )}
                <small className="text-break font-weight-bold">
                  <InPlaceEditor
                    value={cmsFile.filename}
                    onChange={(filename) => renameFile(cmsFile.id, filename)}
                  />
                </small>
              </div>
              <div className="card-body text-center py-2">
                <a href={cmsFile.url}>
                  <FilePreview
                    url={cmsFile.url}
                    contentType={cmsFile.content_type}
                    filename={cmsFile.filename}
                  />
                </a>
              </div>
              <div className="card-footer text-right">
                <small>
                  {'Size: '}
                  {bytes.format(cmsFile.size)}
                </small>
              </div>
            </div>
          ))}
        </div>
      ))}

      {data.currentAbility.can_create_cms_files && <FileUploadForm />}
    </>
  );
}

export default CmsFilesAdmin;
