import React from 'react';

import { useApolloClient } from '@apollo/react-hooks';
import CodeInput from './CodeInput';
import { PreviewMarkdownQuery } from './previewQueries.gql';

const MarkdownInput = (props) => {
  const client = useApolloClient();

  return (
    <CodeInput
      {...props}
      mode="liquid-markdown"
      getPreviewContent={async (markdown) => {
        const response = await client.query({
          query: PreviewMarkdownQuery,
          variables: { markdown },
          fetchPolicy: 'no-cache',
        });

        return response.data.previewMarkdown;
      }}
    />
  );
};

export default MarkdownInput;
