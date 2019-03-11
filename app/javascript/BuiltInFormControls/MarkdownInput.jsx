import React from 'react';
import { ApolloConsumer } from 'react-apollo';

import CodeInput from './CodeInput';
import { PreviewMarkdownQuery } from './previewQueries.gql';

const MarkdownInput = props => (
  <ApolloConsumer>
    {client => (
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
    )}
  </ApolloConsumer>
);

export default MarkdownInput;
