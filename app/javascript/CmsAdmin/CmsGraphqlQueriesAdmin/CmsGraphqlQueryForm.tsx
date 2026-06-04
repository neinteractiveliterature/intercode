import { Suspense } from 'react';
import * as React from 'react';
import {
  BootstrapFormInput,
  BootstrapFormTextarea,
  usePropertySetters,
  LoadingIndicator,
} from '@neinteractiveliterature/litform';

import { lazyWithAppEntrypointHeadersCheck } from '../../checkAppEntrypointHeadersMatch';

const GraphQLQueryEditor = lazyWithAppEntrypointHeadersCheck(() => import('./GraphQLQueryEditor'));

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
  const [setIdentifier, setAdminNotes, setQuery] = usePropertySetters(onChange, 'identifier', 'admin_notes', 'query');

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

      <div className="border p-2" style={{ height: '40em' }}>
        <Suspense fallback={<LoadingIndicator iconSet="bootstrap-icons" />}>
          <GraphQLQueryEditor defaultQuery={value.query} onEditQuery={readOnly ? undefined : setQuery} />
        </Suspense>
        <input type="hidden" name="query" value={value.query} />
      </div>
    </>
  );
}

export default CmsGraphqlQueryForm;
