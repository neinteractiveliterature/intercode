import React, { Suspense, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { parse } from 'graphql/language/parser';
import { execute } from 'apollo-link';

import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';
import BootstrapFormTextarea from '../../BuiltInFormControls/BootstrapFormTextarea';
import { mutator, Transforms } from '../../ComposableFormUtils';
import LoadingIndicator from '../../LoadingIndicator';
import { lazyWithBundleHashCheck } from '../../checkBundleHash';
import { useIntercodeApolloLink } from '../../useIntercodeApolloClient';
import AuthenticityTokensContext from '../../AuthenticityTokensContext';

const GraphiQL = lazyWithBundleHashCheck(() => import(/* webpackChunkName: 'graphiql' */ 'graphiql'));

function CmsGraphqlQueryForm({ value, onChange, readOnly }) {
  const { graphql: authenticityToken } = useContext(AuthenticityTokensContext);
  const valueMutator = onChange && mutator({
    getState: () => value,
    setState: onChange,
    transforms: {
      identifier: Transforms.identity,
      admin_notes: Transforms.identity,
      query: Transforms.identity,
    },
  });
  const link = useIntercodeApolloLink(authenticityToken);

  const fetcher = useCallback(
    (operation) => {
      // eslint-disable-next-line no-param-reassign
      operation.query = parse(operation.query);
      return execute(link, operation);
    },
    [link],
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
            editorTheme="intercode"
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
