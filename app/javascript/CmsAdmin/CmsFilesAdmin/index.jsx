import React, { useMemo } from 'react';
import { chunk } from 'lodash';
import bytes from 'bytes';

import { CmsFilesAdminQuery } from './queries.gql';
import { DeleteCmsFile } from './mutations.gql';
import FilePreview from './FilePreview';
import FileUploadForm from './FileUploadForm';
import useQuerySuspended from '../../useQuerySuspended';
import { useDeleteMutation } from '../../MutationUtils';
import { useConfirm } from '../../ModalDialogs/Confirm';
import ErrorDisplay from '../../ErrorDisplay';

function CmsFilesAdmin() {
  const { data, error } = useQuerySuspended(CmsFilesAdminQuery);
  const deleteFileMutate = useDeleteMutation(DeleteCmsFile, {
    query: CmsFilesAdminQuery,
    arrayPath: ['cmsFiles'],
    idVariablePath: ['id'],
  });
  const confirm = useConfirm();

  const fileChunks = useMemo(
    () => {
      if (error) {
        return [];
      }

      return chunk(data.cmsFiles, 4);
    },
    [data, error],
  );

  const deleteFile = id => deleteFileMutate({ variables: { id } });

  return (
    <>
      {fileChunks.map(files => (
        <div className="card-deck mb-4" key={files[0].id}>
          {files.map(cmsFile => (
            <div className="card" key={cmsFile.id}>
              <div className="card-header">
                <div className="float-right">
                  <button
                    type="button"
                    className="btn btn-outline-danger px-2 py-1"
                    onClick={() => confirm({
                      prompt: `Are you sure you want to delete ${cmsFile.filename}?`,
                      action: () => deleteFile(cmsFile.id),
                      renderError: deleteError => <ErrorDisplay graphQLError={deleteError} />,
                    })}
                  >
                    <i className="fa fa-trash" aria-hidden="true" />
                  </button>
                </div>
                <small className="text-break font-weight-bold">{cmsFile.filename}</small>
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

      <FileUploadForm />
    </>
  );
}

export default CmsFilesAdmin;
