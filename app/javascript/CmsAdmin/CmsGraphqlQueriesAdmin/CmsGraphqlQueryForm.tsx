import { Suspense, useMemo } from 'react';
import * as React from 'react';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import {
  BootstrapFormInput,
  BootstrapFormTextarea,
  usePropertySetters,
  LoadingIndicator,
} from '@neinteractiveliterature/litform';

import { lazyWithAppEntrypointHeadersCheck } from '../../checkAppEntrypointHeadersMatch';
import { getIntercodeUserTimezoneHeader } from '../../useIntercodeApolloClient';
import AuthenticityTokensManager from '../../AuthenticityTokensContext';

const GraphiQL = lazyWithAppEntrypointHeadersCheck(() => import(/* webpackChunkName: 'graphiql' */ 'graphiql'));

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
}: CmsGraphqlQueryFormProps<T>): React.JSX.Element {
  const { graphql: authenticityToken } = AuthenticityTokensManager.instance.tokens;
  const [setIdentifier, setAdminNotes, setQuery] = usePropertySetters(onChange, 'identifier', 'admin_notes', 'query');

  const fetcher = useMemo(() => {
    return createGraphiQLFetcher({
      url: '/graphql',
      headers: { 'X-CSRF-Token': authenticityToken ?? '', ...getIntercodeUserTimezoneHeader() },
    });
  }, [authenticityToken]);

  return (
    <>
      <BootstrapFormInput
        name="identifier"
        label="Identifier"
        className="form-control font-monospace"
        value={value.identifier}
        onTextChange={setIdentifier}
        readOnly={readOnly}
      />

      <BootstrapFormTextarea
        name="admin_notes"
        label="Admin notes"
        value={value.admin_notes ?? ''}
        onTextChange={setAdminNotes}
        readOnly={readOnly}
      />

      <div className="border" style={{ height: '40em' }}>
        <Suspense fallback={<LoadingIndicator iconSet="bootstrap-icons" />}>
          <GraphiQL
            query={value.query}
            onEditQuery={setQuery}
            fetcher={fetcher}
            readOnly={readOnly}
            editorTheme="intercode"
          />
        </Suspense>
        <input type="hidden" name="query" value={value.query} />
      </div>
    </>
  );
}

export default CmsGraphqlQueryForm;
