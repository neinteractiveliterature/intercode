import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import CodeInput from './CodeInput';

const previewLiquidQuery = gql`
query($liquid: String!) {
  previewLiquid(content: $liquid)
}
`;

const LiquidInput = props => (
  <ApolloConsumer>
    {client => (
      <CodeInput
        {...props}
        mode="liquid-html"
        getPreviewContent={async (liquid) => {
          const response = await client.query({
            query: previewLiquidQuery,
            variables: { liquid },
          });

          return response.data.previewLiquid;
        }}
      />
    )}
  </ApolloConsumer>
);

export default LiquidInput;
