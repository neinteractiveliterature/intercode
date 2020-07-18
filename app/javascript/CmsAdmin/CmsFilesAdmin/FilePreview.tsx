import React from 'react';

function iconForContentType(contentType: string) {
  if (contentType.match(/^audio\//)) {
    return 'file-audio-o';
  }

  if (contentType.match(/^video\//)) {
    return 'file-video-o';
  }

  switch (contentType) {
    case 'application/pdf':
      return 'file-pdf-o';
    case 'application/zip':
    case 'application/x-bzip':
    case 'application/x-bzip-2':
    case 'application/x-tar':
    case 'application/x-7z-compressed':
      return 'file-zip-o';
    case 'application/msword':
      return 'file-word-o';
    case 'application/vnd.ms-excel':
      return 'file-excel-o';
    case 'application/vnd.ms-powerpoint':
      return 'file-powerpoint-o';
    case 'text/plain':
    case 'application/rtf':
      return 'file-text-o';
    default:
      return 'file-o';
  }
}

export type FilePreviewProps = {
  url?: string,
  contentType?: string,
  filename?: string,
  size?: string,
};

function FilePreview({
  url, contentType, filename, size,
}: FilePreviewProps) {
  if (!contentType) {
    return null;
  }

  const effectiveSize = size ?? '100px';

  if (contentType.startsWith('image/')) {
    if (url == null) {
      return null;
    }

    return (
      <img
        src={url}
        className="img-responsive"
        style={{ maxWidth: effectiveSize, maxHeight: effectiveSize }}
        alt={filename}
      />
    );
  }

  return (
    <i
      className={`fa fa-${iconForContentType(contentType)}`}
      style={{ fontSize: effectiveSize }}
      aria-hidden
    />
  );
}

export default FilePreview;
