function iconForContentType(contentType: string) {
  if (contentType.match(/^audio\//)) {
    return 'file-earmark-music';
  }

  if (contentType.match(/^video\//)) {
    return 'file-earmark-play';
  }

  switch (contentType) {
    case 'application/pdf':
      return 'file-earmark-pdf';
    case 'application/zip':
    case 'application/x-bzip':
    case 'application/x-bzip-2':
    case 'application/x-tar':
    case 'application/x-7z-compressed':
      return 'file-earmark-zip';
    case 'application/msword':
      return 'file-earmark-word';
    case 'application/vnd.ms-excel':
      return 'file-earmark-excel';
    case 'application/vnd.ms-powerpoint':
      return 'file-earmark-ppt';
    case 'text/plain':
    case 'application/rtf':
      return 'file-earmark-text';
    default:
      return 'file-earmark';
  }
}

export type FilePreviewProps = {
  url?: string;
  contentType?: string;
  filename?: string;
  size?: string;
};

function FilePreview({ url, contentType, filename, size }: FilePreviewProps) {
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
      className={`bi-${iconForContentType(contentType)}`}
      style={{ fontSize: effectiveSize }}
      aria-hidden
    />
  );
}

export default FilePreview;
