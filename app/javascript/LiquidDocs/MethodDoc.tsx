import AssignName from './AssignName';
import TagDoc from './TagDoc';
import { YardMethod } from './DocData';

export type MethodDocProps = {
  method: YardMethod;
  prefix?: string;
};

function MethodDoc({ method, prefix }: MethodDocProps): JSX.Element {
  if (method.tags.some((tag) => tag.tag_name === 'api')) {
    return <></>;
  }

  const sortedTags = method.tags.sort((a, b) => {
    // examples go last
    if (a.tag_name === 'example' && b.tag_name !== 'example') {
      return 1;
    }

    if (b.tag_name === 'example' && a.tag_name !== 'example') {
      return -1;
    }

    return 0;
  });

  return (
    <li key={method.name} className="list-group-item">
      <p>
        <code className="fw-bold">
          <AssignName assign={method} prefix={prefix} />
        </code>
      </p>

      {method.docstring && <p>{method.docstring}</p>}

      <ul className="list-unstyled">
        {sortedTags.map((tag, i) => (
          <TagDoc tag={tag} key={`${tag.tag_name}-${i}`} method={method} prefix={prefix} />
        ))}
      </ul>
    </li>
  );
}

export default MethodDoc;
