import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { buildClientSchema, getIntrospectionQuery, GraphQLSchema } from 'graphql';
import { graphql, updateSchema } from 'cm6-graphql';
import { useStandardCodeMirror } from '@neinteractiveliterature/litform';
import { AuthenticityTokensContext } from '../../AuthenticityTokensContext';
import { getIntercodeUserTimezoneHeader } from '../../useIntercodeApolloClient';

type GraphQLQueryEditorProps = {
  defaultQuery?: string;
  onEditQuery?: (query: string) => void;
};

function useIntrospectedSchema(csrfToken: string): GraphQLSchema | undefined {
  const [schema, setSchema] = useState<GraphQLSchema | undefined>(undefined);

  useEffect(() => {
    fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        ...getIntercodeUserTimezoneHeader(),
      },
      credentials: 'same-origin',
      body: JSON.stringify({ query: getIntrospectionQuery() }),
    })
      .then((r) => r.json())
      .then((result) => {
        if (result?.data) setSchema(buildClientSchema(result.data));
      })
      .catch(console.error);
  }, [csrfToken]);

  return schema;
}

export default function GraphQLQueryEditor({ defaultQuery, onEditQuery }: GraphQLQueryEditorProps) {
  const manager = useContext(AuthenticityTokensContext);
  const csrfToken = manager.tokens?.graphql ?? '';
  const schema = useIntrospectedSchema(csrfToken);

  const [variables, setVariables] = useState('');
  const [response, setResponse] = useState('');
  const [running, setRunning] = useState(false);
  const queryRef = useRef(defaultQuery ?? '');

  const extensions = useMemo(() => [graphql()], []);

  const [editorRef, editorView] = useStandardCodeMirror({
    extensions,
    value: defaultQuery ?? '',
    onChange: useCallback(
      (value: string) => {
        queryRef.current = value;
        onEditQuery?.(value);
      },
      [onEditQuery],
    ),
  });

  // Push the schema into the editor once it loads
  useEffect(() => {
    if (schema && editorView) {
      updateSchema(editorView, schema);
    }
  }, [schema, editorView]);

  const runQuery = useCallback(async () => {
    setRunning(true);
    try {
      let parsedVariables: Record<string, unknown> | undefined;
      if (variables.trim()) {
        parsedVariables = JSON.parse(variables);
      }
      const res = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
          ...getIntercodeUserTimezoneHeader(),
        },
        credentials: 'same-origin',
        body: JSON.stringify({ query: queryRef.current, variables: parsedVariables }),
      });
      setResponse(JSON.stringify(await res.json(), null, 2));
    } catch (err) {
      setResponse(String(err));
    } finally {
      setRunning(false);
    }
  }, [csrfToken, variables]);

  return (
    <div className="d-flex flex-column gap-2 h-100">
      <div className="flex-grow-1 border rounded overflow-hidden" style={{ minHeight: '12rem' }}>
        <div ref={editorRef} className="h-100" />
      </div>
      <div>
        {/* eslint-disable-next-line i18next/no-literal-string */}
        <label htmlFor="graphql-variables" className="form-label mb-1 fw-semibold small">
          Variables (JSON)
        </label>
        <textarea
          id="graphql-variables"
          aria-label="Variables (JSON)"
          className="form-control form-control-sm font-monospace"
          rows={3}
          value={variables}
          onChange={(e) => setVariables(e.target.value)}
          placeholder="{}"
          spellCheck={false}
        />
      </div>
      <div>
        { }
        <button type="button" className="btn btn-primary btn-sm" onClick={runQuery} disabled={running}>
          {/* eslint-disable-next-line i18next/no-literal-string */}
          {running ? 'Running…' : '▶ Run query'}
        </button>
      </div>
      {response && (
        <>
          {/* eslint-disable-next-line i18next/no-literal-string */}
          <div className="fw-semibold small">Response</div>
          <pre
            className="border rounded p-2 bg-light overflow-auto mb-0"
            style={{ maxHeight: '16rem', fontSize: '0.75rem' }}
          >
            {response}
          </pre>
        </>
      )}
    </div>
  );
}
