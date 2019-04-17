import React from 'react';
import PropTypes from 'prop-types';
import { ApolloConsumer } from 'react-apollo';
import GraphiQL from 'graphiql';
import { parse } from 'graphql/language/parser';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import BootstrapFormTextarea from '../BuiltInFormControls/BootstrapFormTextarea';
import { mutator, Transforms } from '../ComposableFormUtils';

function SyncCmsGraphqlQueryForm({ value, onChange }) {
  const valueMutator = mutator({
    getState: () => value,
    setState: onChange,
    transforms: {
      identifier: Transforms.identity,
      admin_notes: Transforms.identity,
      query: Transforms.identity,
    },
  });

  return (
    <>
      <BootstrapFormInput
        name="identifier"
        label="Identifier"
        className="form-control text-monospace"
        value={value.identifier}
        onTextChange={valueMutator.identifier}
      />

      <BootstrapFormTextarea
        name="admin_notes"
        label="Admin notes"
        value={value.admin_notes}
        onTextChange={valueMutator.admin_notes}
      />

      <ApolloConsumer>
        {client => (
          <div className="border" style={{ height: '40em' }}>
            <GraphiQL
              query={value.query}
              onEditQuery={valueMutator.query}
              fetcher={({ query, ...otherParams }) => client.query({
                query: parse(query),
                ...otherParams,
              })}
            />
          </div>
        )}
      </ApolloConsumer>
    </>
  );
}

SyncCmsGraphqlQueryForm.propTypes = {
  value: PropTypes.shape({
    identifier: PropTypes.string.isRequired,
    admin_notes: PropTypes.string.isRequired,
    query: PropTypes.string.isRequired,
  }),
  onChange: PropTypes.func.isRequired,
};

export default SyncCmsGraphqlQueryForm;
