import React from 'react';
import PropTypes from 'prop-types';

function iconForContentType(contentType) {
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

function FilePreview({
  url, contentType, filename, size,
}) {
  if (!contentType) {
    return null;
  }

  if (contentType.startsWith('image/')) {
    if (url == null) {
      return null;
    }

    return (
      <img
        src={url}
        className="img-responsive"
        style={{ maxWidth: size, maxHeight: size }}
        alt={filename}
      />
    );
  }

  return (
    <i
      className={`fa fa-${iconForContentType(contentType)}`}
      style={{ fontSize: size }}
      aria-hidden
    />
  );
}

FilePreview.propTypes = {
  contentType: PropTypes.string,
  url: PropTypes.string,
  filename: PropTypes.string,
  size: PropTypes.string,
};

FilePreview.defaultProps = {
  contentType: null,
  url: null,
  filename: null,
  size: '100px',
};

export default FilePreview;
