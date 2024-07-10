import { Link, Routes, Route, useLocation } from 'react-router-dom';

import AssignDocHeader from './AssignDocHeader';
import buildMemberPrefix from './buildMemberPrefix';
import escapeRegExp from './escapeRegExp';
import findClass from './findClass';
import findMethodReturnClass from './findMethodReturnClass';
import MethodDoc from './MethodDoc';
import { LiquidAssignsQueryFromLocationData } from './useLiquidAssignsQueryFromLocation';

export type AssignDocProps = {
  assign: LiquidAssignsQueryFromLocationData['cmsParent']['liquidAssigns'][0];
  prefix?: string;
};

function AssignDoc({ assign, prefix }: AssignDocProps): JSX.Element {
  const location = useLocation();

  const assignClass = findClass(assign.drop_class_name);
  if (!assignClass) {
    return <></>;
  }

  const sortedMethods = assignClass.methods.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
  );
  const prefixParts = (prefix || '').split('.').filter((part) => part.length > 0);

  return (
    <Routes>
      {sortedMethods.map((method) => {
        const { returnClassName, assignName } = findMethodReturnClass(method);
        const returnClass = findClass(returnClassName);

        if (returnClass && returnClassName) {
          return (
            <Route
              path={`/liquid_docs/assigns/${escapeRegExp(prefix || '')}${assign.name}\\.${escapeRegExp(
                assignName,
              )}(\\..*)?`}
              key={method.name}
              element={
                <AssignDoc
                  assign={{
                    __typename: 'LiquidAssign',
                    name: assignName,
                    drop_class_name: returnClassName,
                  }}
                  prefix={buildMemberPrefix(assign.name, prefix)}
                />
              }
            />
          );
        }

        return null;
      })}

      <Route
        path={`/liquid_docs/assigns/${escapeRegExp(prefix || '')}${assign.name}`}
        element={
          <>
            <nav aria-label="breadcrumb mb-4">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to={`/liquid_docs${location.search}`}>Documentation home</Link>
                </li>
                {prefixParts.map((part, i) => (
                   
                  <li className="breadcrumb-item text-nowrap" key={i}>
                    <Link to={`/liquid_docs/assigns/${prefixParts.slice(0, i + 1).join('.')}${location.search}`}>
                      {part}
                    </Link>
                  </li>
                ))}
                <li className="breadcrumb-item active" aria-current="page">
                  {assign.name}
                </li>
              </ol>
            </nav>

            <section id={assignClass.name} className="card my-4">
              <div className="card-header">
                <AssignDocHeader assign={assign} prefix={prefix} />
              </div>

              {assign.cms_variable_value_json ? (
                <div className="card-body">
                  <h4>Value</h4>
                  <code>{assign.cms_variable_value_json}</code>
                </div>
              ) : null}

              <ul className="list-group list-group-flush">
                {sortedMethods.map((method) => (
                  <MethodDoc method={method} prefix={buildMemberPrefix(assign.name, prefix)} key={method.name} />
                ))}
              </ul>
            </section>
          </>
        }
      />
    </Routes>
  );
}

export default AssignDoc;
