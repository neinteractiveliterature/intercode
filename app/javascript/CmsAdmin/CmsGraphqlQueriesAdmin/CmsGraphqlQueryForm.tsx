import React, { Suspense, useContext, useCallback } from 'react';
import { parse } from 'graphql/language/parser';
import { execute, GraphQLRequest } from '@apollo/client';
import { Fetcher } from 'graphiql/dist/components/GraphiQL';

import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';
import BootstrapFormTextarea from '../../BuiltInFormControls/BootstrapFormTextarea';
import LoadingIndicator from '../../LoadingIndicator';
import { lazyWithBundleHashCheck } from '../../checkBundleHash';
import { useIntercodeApolloLink } from '../../useIntercodeApolloClient';
import AuthenticityTokensContext from '../../AuthenticityTokensContext';
import { usePartialState } from '../../useStatePropertyUpdater';

const GraphiQL = lazyWithBundleHashCheck(
  () => import(/* webpackChunkName: 'graphiql' */ 'graphiql'),
);

function noop() {}

type CmsGraphqlQueryFormFields = {
  identifier: string;
  admin_notes?: string | null;
  query?: string;
};

export type CmsGraphqlQueryFormProps<T extends CmsGraphqlQueryFormFields> = {
  value: T;
  onChange?: React.Dispatch<React.SetStateAction<T>>;
  readOnly?: boolean;
};

function CmsGraphqlQueryForm<T extends CmsGraphqlQueryFormFields>({
  value,
  onChange,
  readOnly,
}: CmsGraphqlQueryFormProps<T>) {
  const { graphql: authenticityToken } = useContext(AuthenticityTokensContext);
  const [identifier, setIdentifier] = usePartialState(value, onChange ?? noop, 'identifier');
  const [adminNotes, setAdminNotes] = usePartialState(value, onChange ?? noop, 'admin_notes');
  const [query, setQuery] = usePartialState(value, onChange ?? noop, 'query');
  const link = useIntercodeApolloLink(authenticityToken);

  // Serious shenanigans going on in here, we have to majorly circumvent type checking
  const fetcher: Fetcher = useCallback(
    (operation) => {
      const request: GraphQLRequest = (operation as unknown) as GraphQLRequest;
      // eslint-disable-next-line no-param-reassign
      request.query = parse(operation.query);
      return execute(link, request) as any;
    },
    [link],
  );

  return (
    <>
      <BootstrapFormInput
        name="identifier"
        label="Identifier"
        className="form-control text-monospace"
        value={identifier}
        onTextChange={setIdentifier}
        readOnly={readOnly}
      />

      <BootstrapFormTextarea
        name="admin_notes"
        label="Admin notes"
        value={adminNotes ?? ''}
        onTextChange={setAdminNotes}
        readOnly={readOnly}
      />

      <div className="border" style={{ height: '40em' }}>
        <Suspense fallback={<LoadingIndicator />}>
          <GraphiQL
            query={query}
            onEditQuery={setQuery}
            fetcher={fetcher}
            readOnly={readOnly}
            editorTheme="intercode"
          />
        </Suspense>
      </div>
    </>
  );
}

export default CmsGraphqlQueryForm;
