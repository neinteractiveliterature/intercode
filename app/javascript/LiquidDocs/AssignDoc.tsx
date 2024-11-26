import { Link, useLocation, useParams } from 'react-router';

import AssignDocHeader from './AssignDocHeader';
import findClass from './findClass';
import findMethodReturnClass from './findMethodReturnClass';
import MethodDoc from './MethodDoc';
import { LiquidDocsLoaderResult, useLiquidDocs } from './loader';
import { YardClass } from './DocData';
import FourOhFourPage from '../FourOhFourPage';

function getPathPartBaseName(pathPart: string): string {
  return pathPart.replace(/\[index\]$/, '');
}

function traverseMethods(
  name: string,
  yardClass: YardClass,
  path: string[],
  docData: LiquidDocsLoaderResult['docData'],
) {
  if (path.length > 0) {
    const baseName = getPathPartBaseName(path[0]);
    const method = yardClass.methods.find((method) => method.name === baseName);
    if (!method) {
      return undefined;
    }

    const { returnClassName, assignName } = findMethodReturnClass(method);
    const returnClass = findClass(docData, returnClassName);
    if (!returnClass) {
      return undefined;
    }

    return traverseMethods(assignName, returnClass, path.slice(1), docData);
  } else {
    return { yardClass, name };
  }
}

function findAssign(
  path: string[],
  assigns: LiquidDocsLoaderResult['assigns'],
  docData: LiquidDocsLoaderResult['docData'],
): LiquidDocsLoaderResult['sortedAssigns'][number] | undefined {
  const assign = assigns[getPathPartBaseName(path[0])];
  const assignClass = findClass(docData, assign.drop_class_name);
  if (!assignClass) {
    return undefined;
  }

  if (path.length > 1) {
    const traversalResult = traverseMethods(assign.name, assignClass, path.slice(1), docData);
    if (!traversalResult) {
      return undefined;
    }

    return {
      __typename: 'LiquidAssign',
      drop_class_name: traversalResult.yardClass.name,
      name: traversalResult.name,
    };
  } else {
    return assign;
  }
}

function AssignDoc(): JSX.Element {
  const { name } = useParams();
  const { docData, assigns } = useLiquidDocs();
  const location = useLocation();

  const nameParts = name?.split('.').filter((part) => part.length > 0) ?? [];
  const assign = findAssign(nameParts, assigns, docData);

  const prefixParts = nameParts.slice(0, -1);

  const assignClass = findClass(docData, assign?.drop_class_name);
  if (!assignClass || !assign) {
    return <FourOhFourPage />;
  }

  const sortedMethods = assignClass.methods.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
  );

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">
            <Link to={`/liquid_docs${location.search}`}>Documentation home</Link>
          </li>
          {prefixParts.map((part, i) => (
            <li className="breadcrumb-item text-nowrap" key={i}>
              <Link to={`/liquid_docs/assigns/${prefixParts.slice(0, i + 1).join('.')}${location.search}`}>{part}</Link>
            </li>
          ))}
          <li className="breadcrumb-item active" aria-current="page">
            {assign.name}
          </li>
        </ol>
      </nav>

      <section id={assignClass.name} className="card my-4">
        <div className="card-header">
          <AssignDocHeader assign={assign} prefix={prefixParts.length > 0 ? `${prefixParts.join('.')}.` : ''} />
        </div>

        {assign.cms_variable_value_json ? (
          <div className="card-body">
            <h4>Value</h4>
            <code>{assign.cms_variable_value_json}</code>
          </div>
        ) : null}

        <ul className="list-group list-group-flush">
          {sortedMethods.map((method) => (
            <MethodDoc method={method} prefix={`${nameParts.join('.')}.`} key={method.name} />
          ))}
        </ul>
      </section>
    </>
  );
}

export default AssignDoc;
