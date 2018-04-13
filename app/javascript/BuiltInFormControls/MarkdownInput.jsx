import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import CodeInput from './CodeInput';

const previewMarkdownQuery = gql`
query($markdown: String!) {
  previewMarkdown(markdown: $markdown)
}
`;

const MarkdownInput = props => (
  <ApolloConsumer>
    {client => (
      <CodeInput
        {...props}
        mode="liquid-markdown"
        getPreviewContent={async (markdown) => {
          const response = await client.query({
            query: previewMarkdownQuery,
            variables: { markdown },
          });

          return response.data.previewMarkdown;
        }}
      />
    )}
  </ApolloConsumer>
);

export default MarkdownInput;
