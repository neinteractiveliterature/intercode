function iconForContentType(contentType: string) {
  if (contentType.match(/^audio\//)) {
    return 'file-earmark-music';
  }

  if (contentType.match(/^video\//)) {
    return 'file-earmark-play';
  }

  if (contentType.match(/^image\//)) {
    return 'file-earmark-image';
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
  url?: string | null;
  contentType?: string | null;
  filename?: string | null;
  size?: string | null;
};

function FilePreview({ url, contentType, filename, size }: FilePreviewProps): React.JSX.Element {
  const effectiveSize = size ?? '100px';

  if (url != null) {
    return (
      <img
        src={url}
        className="img-responsive"
        style={{ maxWidth: effectiveSize, maxHeight: effectiveSize }}
        alt={filename ?? undefined}
      />
    );
  }

  return (
    <i
      className={`bi-${iconForContentType(contentType ?? 'application/octet-stream')}`}
      style={{ fontSize: effectiveSize }}
      aria-hidden
    />
  );
}

export default FilePreview;
