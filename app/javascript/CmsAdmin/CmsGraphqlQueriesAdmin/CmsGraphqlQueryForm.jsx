import React, { Suspense, useMemo } from 'react';
import PropTypes from 'prop-types';
import { parse } from 'graphql/language/parser';
import { useApolloClient } from '@apollo/react-hooks';

import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';
import BootstrapFormTextarea from '../../BuiltInFormControls/BootstrapFormTextarea';
import { mutator, Transforms } from '../../ComposableFormUtils';
import LoadingIndicator from '../../LoadingIndicator';
import { lazyWithBundleHashCheck } from '../../checkBundleHash';

const GraphiQL = lazyWithBundleHashCheck(() => import(/* webpackChunkName: 'graphiql' */ 'graphiql'));

function CmsGraphqlQueryForm({ value, onChange, readOnly }) {
  const client = useApolloClient();
  const valueMutator = onChange && mutator({
    getState: () => value,
    setState: onChange,
    transforms: {
      identifier: Transforms.identity,
      admin_notes: Transforms.identity,
      query: Transforms.identity,
    },
  });
  const fetcher = useMemo(
    () => ({ query, ...otherParams }) => client.query({
      query: parse(query),
      ...otherParams,
    }),
    [client],
  );

  return (
    <>
      <BootstrapFormInput
        name="identifier"
        label="Identifier"
        className="form-control text-monospace"
        value={value.identifier}
        onTextChange={valueMutator && valueMutator.identifier}
        readOnly={readOnly}
      />

      <BootstrapFormTextarea
        name="admin_notes"
        label="Admin notes"
        value={value.admin_notes}
        onTextChange={valueMutator && valueMutator.admin_notes}
        readOnly={readOnly}
      />

      <div className="border" style={{ height: '40em' }}>
        <Suspense fallback={<LoadingIndicator />}>
          <GraphiQL
            query={value.query}
            onEditQuery={valueMutator && valueMutator.query}
            fetcher={fetcher}
            readOnly={readOnly}
          />
        </Suspense>
      </div>
    </>
  );
}

CmsGraphqlQueryForm.propTypes = {
  value: PropTypes.shape({
    identifier: PropTypes.string.isRequired,
    admin_notes: PropTypes.string.isRequired,
    query: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
};

CmsGraphqlQueryForm.defaultProps = {
  readOnly: false,
  onChange: null,
};

export default CmsGraphqlQueryForm;
