import React, { useMemo } from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import AssignDoc from './AssignDoc';
import AssignDocLink from './AssignDocLink';
import DocData from '../../../liquid_doc.json';
import findLiquidTagName from './findLiquidTagName';
import FilterDoc from './FilterDoc';
import FilterDocLink from './FilterDocLink';
import { LiquidAssignsQuery, NotifierLiquidAssignsQuery } from './queries.gql';
import LiquidTagDoc from './LiquidTagDoc';
import LiquidTagDocLink from './LiquidTagDocLink';
import LoadingIndicator from '../LoadingIndicator';
import ErrorDisplay from '../ErrorDisplay';

function sortByName(items) {
  return [...items].sort((a, b) => a.name.localeCompare(b.name, { sensitivity: 'base' }));
}

const LiquidDocsContext = React.createContext({});

function LiquidDocs() {
  const location = useLocation();
  const notifierEventKey = location.search
    ? new URLSearchParams(location.search).get('notifier_event_key')
    : null;

  const { data, error, loading } = useQuery(
    notifierEventKey ? NotifierLiquidAssignsQuery : LiquidAssignsQuery,
    {
      variables: notifierEventKey ? { eventKey: notifierEventKey } : {},
    },
  );

  const sortedAssigns = useMemo(
    () => ((loading || error) ? [] : sortByName(data.liquidAssigns)),
    [error, data, loading],
  );

  const sortedFilters = useMemo(
    () => sortByName(DocData.filter_methods),
    [],
  );

  const sortedTags = useMemo(
    () => sortByName(
      DocData.classes.filter(
        (klass) => klass.tags.some((tag) => tag.tag_name === 'liquid_tag_name'),
      ),
    ),
    [],
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <LiquidDocsContext.Provider value={{ notifierEventKey }}>
      <Switch>
        {sortedAssigns.map((assign) => (
          <Route
            path={`/liquid_docs/assigns/${assign.name}(\\..*)?`}
            key={`route-${assign.name}`}
          >
            <AssignDoc assign={assign} />
          </Route>
        ))}
        {sortedFilters.map((filter) => (
          <Route
            path={`/liquid_docs/filters/${filter.name}(\\..*)?`}
            key={`route-${filter.name}`}
          >
            <FilterDoc filter={filter} />
          </Route>
        ))}
        {sortedTags.map((liquidTag) => (
          <Route
            path={`/liquid_docs/tags/${findLiquidTagName(liquidTag)}(\\..*)?`}
            render={() => (
              <LiquidTagDoc liquidTag={liquidTag} />
            )}
            key={`route-${liquidTag.name}`}
          />
        ))}

        <Route path="/liquid_docs" exact>
          <>
            <nav aria-label="breadcrumb mb-4">
              <ol className="breadcrumb">
                <li className="breadcrumb-item active" aria-current="page">Documentation home</li>
              </ol>
            </nav>

            <section className="mb-4">
              <h2 className="mb-2">Assigns</h2>

              {
                sortedAssigns.map((assign) => (
                  <AssignDocLink compact assign={assign} key={assign.name} />
                ))
              }
            </section>

            <section className="mb-4">
              <h2 className="mb-2">Filters</h2>
              <ul className="list-group">
                {
                  sortedFilters.map((filter) => (
                    <FilterDocLink compact filter={filter} key={filter.name} />
                  ))
                }
              </ul>
            </section>

            <section>
              <h2 className="mb-2">Tags</h2>

              {
                sortedTags.map((liquidTag) => (
                  <LiquidTagDocLink compact liquidTag={liquidTag} key={liquidTag.name} />
                ))
              }
            </section>
          </>
        </Route>

        <Redirect to={`/liquid_docs${location.search}`} />
      </Switch>
    </LiquidDocsContext.Provider>
  );
}

export default LiquidDocs;
