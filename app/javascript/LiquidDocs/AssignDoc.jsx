import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

import AssignDocHeader from './AssignDocHeader';
import buildMemberPrefix from './buildMemberPrefix';
import escapeRegExp from './escapeRegExp';
import findClass from './findClass';
import findMethodReturnClass from './findMethodReturnClass';
import MethodDoc from './MethodDoc';

function AssignDoc({ assign, prefix = null, alreadyRenderedClasses = [] }) {
  const assignClass = findClass(assign.drop_class_name);
  if (!assignClass) {
    return null;
  }

  const sortedMethods = assignClass.methods.sort((a, b) => a.name.localeCompare(b.name, { sensitivity: 'base' }));

  return (
    <Switch>
      {
        sortedMethods.map((method) => {
          const { returnClassName, assignName } = findMethodReturnClass(method);
          const returnClass = findClass(returnClassName);

          if (returnClass) {
            return (
              <Route
                path={`/assigns/${escapeRegExp(prefix || '')}${assign.name}\\.${escapeRegExp(assignName)}(\\..*)?`}
                key={method.name}
                render={() => (
                  <AssignDoc
                    assign={{ name: assignName, drop_class_name: returnClassName }}
                    prefix={buildMemberPrefix(assign.name, prefix)}
                    alreadyRenderedClasses={alreadyRenderedClasses}
                  />
                )}
              />
            );
          }

          return null;
        })
      }

      <Route
        path={`/assigns/${escapeRegExp(prefix || '')}${assign.name}`}
        exact
        render={() => (
          <section id={assignClass.name} className="card my-4">
            <div className="card-header">
              <AssignDocHeader assign={assign} prefix={prefix} />
            </div>

            <ul className="list-group list-group-flush">
              {sortedMethods.map(method => (
                <MethodDoc
                  method={method}
                  prefix={buildMemberPrefix(assign.name, prefix)}
                  alreadyRenderedClasses={[...alreadyRenderedClasses, assignClass.name]}
                  key={method.name}
                />
              ))}
            </ul>
          </section>
        )}
      />
    </Switch>
  );
}

AssignDoc.propTypes = {
  assign: PropTypes.shape({
    name: PropTypes.string.isRequired,
    drop_class_name: PropTypes.string.isRequired,
  }).isRequired,
  prefix: PropTypes.string,
  alreadyRenderedClasses: PropTypes.arrayOf(PropTypes.string),
};

AssignDoc.defaultProps = {
  prefix: null,
  alreadyRenderedClasses: [],
};

export default AssignDoc;
