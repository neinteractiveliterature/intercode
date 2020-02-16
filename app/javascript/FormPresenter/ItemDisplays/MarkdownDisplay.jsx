import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';

import { PreviewMarkdownQuery } from '../../BuiltInFormControls/previewQueries.gql';
import LoadingIndicator from '../../LoadingIndicator';
import ErrorDisplay from '../../ErrorDisplay';

function MarkdownDisplay({ markdown }) {
  const { data, loading, error } = useQuery(PreviewMarkdownQuery, {
    variables: { markdown: markdown || '' },
  });

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  // eslint-disable-next-line react/no-danger
  return <span dangerouslySetInnerHTML={{ __html: data.previewMarkdown }} />;
}

MarkdownDisplay.propTypes = {
  markdown: PropTypes.string,
};

MarkdownDisplay.defaultProps = {
  markdown: null,
};

export default MarkdownDisplay;
