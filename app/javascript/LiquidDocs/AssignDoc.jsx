import React from 'react';
import PropTypes from 'prop-types';
import {
  Link, Switch, Route, useLocation,
} from 'react-router-dom';

import AssignDocHeader from './AssignDocHeader';
import buildMemberPrefix from './buildMemberPrefix';
import escapeRegExp from './escapeRegExp';
import findClass from './findClass';
import findMethodReturnClass from './findMethodReturnClass';
import MethodDoc from './MethodDoc';

function AssignDoc({ assign, prefix = null }) {
  const location = useLocation();

  const assignClass = findClass(assign.drop_class_name);
  if (!assignClass) {
    return null;
  }

  const sortedMethods = assignClass.methods.sort((a, b) => a.name.localeCompare(b.name, { sensitivity: 'base' }));
  const prefixParts = (prefix || '').split('.').filter((part) => part.length > 0);

  return (
    <Switch>
      {
        sortedMethods.map((method) => {
          const { returnClassName, assignName } = findMethodReturnClass(method);
          const returnClass = findClass(returnClassName);

          if (returnClass) {
            return (
              <Route
                path={`/liquid_docs/assigns/${escapeRegExp(prefix || '')}${assign.name}\\.${escapeRegExp(assignName)}(\\..*)?`}
                key={method.name}
              >
                <AssignDoc
                  assign={{ name: assignName, drop_class_name: returnClassName }}
                  prefix={buildMemberPrefix(assign.name, prefix)}
                />
              </Route>
            );
          }

          return null;
        })
      }

      <Route path={`/liquid_docs/assigns/${escapeRegExp(prefix || '')}${assign.name}`} exact>
        <nav aria-label="breadcrumb mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to={`/liquid_docs${location.search}`}>Documentation home</Link>
            </li>
            {
              prefixParts.map((part, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <li className="breadcrumb-item text-nowrap" key={i}>
                  <Link to={`/liquid_docs/assigns/${prefixParts.slice(0, i + 1).join('.')}${location.search}`}>
                    {part}
                  </Link>
                </li>
              ))
            }
            <li className="breadcrumb-item active" aria-current="page">{assign.name}</li>
          </ol>
        </nav>

        <section id={assignClass.name} className="card my-4">
          <div className="card-header">
            <AssignDocHeader assign={assign} prefix={prefix} />
          </div>

          {
            assign.cms_variable_value_json
              ? (
                <div className="card-body">
                  <h4>Value</h4>
                  <code>{assign.cms_variable_value_json}</code>
                </div>
              )
              : null
          }

          <ul className="list-group list-group-flush">
            {sortedMethods.map((method) => (
              <MethodDoc
                method={method}
                prefix={buildMemberPrefix(assign.name, prefix)}
                key={method.name}
              />
            ))}
          </ul>
        </section>
      </Route>
    </Switch>
  );
}

AssignDoc.propTypes = {
  assign: PropTypes.shape({
    name: PropTypes.string.isRequired,
    drop_class_name: PropTypes.string.isRequired,
    cms_variable_value_json: PropTypes.string,
  }).isRequired,
  prefix: PropTypes.string,
};

AssignDoc.defaultProps = {
  prefix: null,
};

export default AssignDoc;
