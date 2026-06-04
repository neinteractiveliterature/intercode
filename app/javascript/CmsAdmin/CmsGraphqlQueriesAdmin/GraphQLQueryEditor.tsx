import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { buildClientSchema, getIntrospectionQuery, GraphQLSchema } from 'graphql';
import { graphql, updateSchema } from 'cm6-graphql';
import { json } from '@codemirror/lang-json';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
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
    if (!csrfToken) return;
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

  const [response, setResponse] = useState('');
  const [running, setRunning] = useState(false);
  const queryValueRef = useRef(defaultQuery ?? '');
  const variablesValueRef = useRef('');

  const fillHeight = useMemo(
    () => EditorView.theme({ '&': { height: '100%' }, '.cm-scroller': { overflow: 'auto' } }),
    [],
  );

  const queryExtensions = useMemo(
    () => [graphql(), fillHeight, EditorView.contentAttributes.of({ 'aria-labelledby': 'graphql-query-label' })],
    [fillHeight],
  );
  const variablesExtensions = useMemo(
    () => [json(), EditorView.contentAttributes.of({ 'aria-labelledby': 'graphql-variables-label' })],
    [],
  );
  const responseExtensions = useMemo(
    () => [json(), EditorState.readOnly.of(true), EditorView.editable.of(false), fillHeight],
    [fillHeight],
  );

  const [queryEditorRef, editorView] = useStandardCodeMirror({
    extensions: queryExtensions,
    value: defaultQuery ?? '',
    onChange: useCallback(
      (value: string) => {
        queryValueRef.current = value;
        onEditQuery?.(value);
      },
      [onEditQuery],
    ),
  });

  const [responseEditorRef] = useStandardCodeMirror({
    extensions: responseExtensions,
    value: response,
  });

  const [variablesEditorRef] = useStandardCodeMirror({
    extensions: variablesExtensions,
    value: '',
    onChange: useCallback((value: string) => {
      variablesValueRef.current = value;
    }, []),
    lines: 4,
  });

  useEffect(() => {
    if (schema && editorView) {
      updateSchema(editorView, schema);
    }
  }, [schema, editorView]);

  const runQuery = useCallback(async () => {
    setRunning(true);
    try {
      let parsedVariables: Record<string, unknown> | undefined;
      const variablesText = variablesValueRef.current.trim();
      if (variablesText) {
        parsedVariables = JSON.parse(variablesText);
      }
      const res = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
          ...getIntercodeUserTimezoneHeader(),
        },
        credentials: 'same-origin',
        body: JSON.stringify({ query: queryValueRef.current, variables: parsedVariables }),
      });
      setResponse(JSON.stringify(await res.json(), null, 2));
    } catch (err) {
      setResponse(String(err));
    } finally {
      setRunning(false);
    }
  }, [csrfToken]);

  return (
    <div className="d-flex gap-2 h-100">
      <div className="d-flex flex-column gap-2 flex-grow-1" style={{ minWidth: 0 }}>
        <div className="d-flex flex-column flex-grow-1" style={{ minHeight: 0 }}>
          {/* eslint-disable-next-line i18next/no-literal-string */}
          <div id="graphql-query-label" className="form-label mb-1 fw-semibold small">
            Query
          </div>
          <div className="border rounded overflow-hidden flex-grow-1" style={{ minHeight: '12rem' }}>
            <div ref={queryEditorRef} className="h-100" />
          </div>
        </div>
        <div>
          {/* eslint-disable-next-line i18next/no-literal-string */}
          <div id="graphql-variables-label" className="form-label mb-1 fw-semibold small">
            Variables (JSON)
          </div>
          <div className="border rounded overflow-hidden" ref={variablesEditorRef} />
        </div>
      </div>
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ flexShrink: 0 }}>
        <button type="button" className="btn btn-primary btn-sm" onClick={runQuery} disabled={running}>
          {/* eslint-disable-next-line i18next/no-literal-string */}
          {running ? 'Running…' : '▶ Run query'}
        </button>
      </div>
      <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0 }}>
        {/* eslint-disable-next-line i18next/no-literal-string */}
        <div className="fw-semibold small mb-1">Response</div>
        <div className="border rounded overflow-hidden flex-grow-1" ref={responseEditorRef} />
      </div>
    </div>
  );
}
