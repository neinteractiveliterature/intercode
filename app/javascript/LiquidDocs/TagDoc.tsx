import AssignDocLink from './AssignDocLink';
import findClass from './findClass';
import findMethodReturnClass from './findMethodReturnClass';
import { YardMethod, YardTag } from './DocData';
import humanize from '../humanize';
import { useLiquidDocs } from './loader';

export type BaseTagDocProps = {
  tag: YardTag;
};

const ExampleTagDoc = ({ tag }: BaseTagDocProps) => (
  <li>
    <div className="card mt-4 border-success">
      <div className="card-header bg-success-light">
        {tag.name ? (
          <>
            <strong>Example:</strong> {tag.name}
          </>
        ) : (
          <strong>Example</strong>
        )}
      </div>

      <div className="card-body">
        <code>{tag.text}</code>
      </div>
    </div>
  </li>
);

export type ReturnTagWithClassDocProps = BaseTagDocProps & {
  assignName: string;
  returnClassName: string;
  prefix?: string;
};

const ReturnTagWithClassDoc = ({ tag, assignName, returnClassName, prefix }: ReturnTagWithClassDocProps) => (
  <>
    <p className="mb-1">
      <strong>Return:</strong> <em>{(tag.types ?? []).join(', ')}</em>
    </p>
    <div className="d-flex align-items-start">
      <div className="h3 me-1">↳</div>
      <AssignDocLink
        assign={{ __typename: 'LiquidAssign', name: assignName, drop_class_name: returnClassName }}
        compact
        prefix={prefix}
      />
    </div>
  </>
);

const SeeTagDoc = ({ tag }: BaseTagDocProps) => (
  <li>
    <strong>See:</strong> {tag.name ? <a href={tag.name}>{tag.text}</a> : tag.text}
  </li>
);

const FallbackTagDoc = ({ tag }: BaseTagDocProps) => (
  <li>
    <strong>{humanize(tag.tag_name)}</strong>
    {tag.types ? (
      <>
        {' '}
        <em>[{tag.types.join(', ')}]</em>
      </>
    ) : null}
    {tag.text ? <> &mdash; {tag.text}</> : null}
  </li>
);

export type TagDocProps = BaseTagDocProps & {
  method?: YardMethod;
  prefix?: string;
};

function TagDoc({ tag, method, prefix }: TagDocProps): JSX.Element {
  const { docData } = useLiquidDocs();

  if (tag.tag_name === 'example') {
    return <ExampleTagDoc tag={tag} />;
  }

  if (tag.tag_name === 'return' && method) {
    const { returnClassName, assignName } = findMethodReturnClass(method);

    if (returnClassName && findClass(docData, returnClassName)) {
      return (
        <ReturnTagWithClassDoc tag={tag} assignName={assignName} returnClassName={returnClassName} prefix={prefix} />
      );
    }
  }

  if (tag.tag_name === 'see') {
    return <SeeTagDoc tag={tag} />;
  }

  return <FallbackTagDoc tag={tag} />;
}

export default TagDoc;
