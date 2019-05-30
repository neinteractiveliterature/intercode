import React from 'react';
import PropTypes from 'prop-types';

import PlainTextDisplay from '../../PlainTextDisplay';
import { PreviewMarkdownQuery } from '../../BuiltInFormControls/previewQueries.gql';
import QueryWithStateDisplay from '../../QueryWithStateDisplay';

function parseURL(value) {
  try {
    return new URL(value);
  } catch (error) {
    try {
      return new URL(`http://${value}`);
    } catch (error2) {
      return null;
    }
  }
}

function FreeTextItemDisplay({ formItem, value }) {
  if (formItem.properties.format === 'markdown') {
    return (
      <QueryWithStateDisplay query={PreviewMarkdownQuery} variables={{ markdown: value }}>
        {({ data }) => (
          // eslint-disable-next-line react/no-danger
          <span dangerouslySetInnerHTML={{ __html: data.previewMarkdown }} />
        )}
      </QueryWithStateDisplay>
    );
  }

  if (formItem.properties.format === 'url') {
    try {
      const url = parseURL(value);
      return (<a href={url.toString()}>{url.toString()}</a>);
    } catch {
      // fall through to displaying as plain text
    }
  }

  return <PlainTextDisplay value={value} />;
}

FreeTextItemDisplay.propTypes = {
  formItem: PropTypes.shape({
    identifier: PropTypes.string.isRequired,
    properties: PropTypes.shape({
      caption: PropTypes.string.isRequired,
      format: PropTypes.string,
    }).isRequired,
  }).isRequired,
  value: PropTypes.string,
};

FreeTextItemDisplay.defaultProps = {
  value: null,
};

export default FreeTextItemDisplay;
