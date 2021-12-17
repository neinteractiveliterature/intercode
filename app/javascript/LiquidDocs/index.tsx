import { createContext, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';

import AssignDoc from './AssignDoc';
import AssignDocLink from './AssignDocLink';
import DocData from './DocData';
import findLiquidTagName from './findLiquidTagName';
import FilterDoc from './FilterDoc';
import FilterDocLink from './FilterDocLink';
import LiquidTagDoc from './LiquidTagDoc';
import LiquidTagDocLink from './LiquidTagDocLink';
import useLiquidAssignsQueryFromLocation from './useLiquidAssignsQueryFromLocation';

function sortByName<T extends { name: string }>(items: T[]) {
  return [...items].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
}

const LiquidDocsContext = createContext({});

function LiquidDocs(): JSX.Element {
  const [{ data, loading, error }, notifierEventKey] = useLiquidAssignsQueryFromLocation();

  const sortedAssigns = useMemo(
    () => (loading || error || !data ? [] : sortByName(data.cmsParent.liquidAssigns)),
    [error, data, loading],
  );

  const sortedFilters = useMemo(() => sortByName(DocData.filter_methods), []);

  const sortedTags = useMemo(
    () => sortByName(DocData.classes.filter((klass) => klass.tags.some((tag) => tag.tag_name === 'liquid_tag_name'))),
    [],
  );

  if (loading) {
    return <LoadingIndicator iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <LiquidDocsContext.Provider value={{ notifierEventKey }}>
      <Routes>
        {sortedAssigns.map((assign) => (
          <Route path={`/liquid_docs/assigns/${assign.name}(\\..*)?`} key={`route-${assign.name}`}>
            <AssignDoc assign={assign} />
          </Route>
        ))}
        {sortedFilters.map((filter) => (
          <Route path={`/liquid_docs/filters/${filter.name}(\\..*)?`} key={`route-${filter.name}`}>
            <FilterDoc filter={filter} />
          </Route>
        ))}
        {sortedTags.map((liquidTag) => (
          <Route path={`/liquid_docs/tags/${findLiquidTagName(liquidTag)}(\\..*)?`} key={`route-${liquidTag.name}`}>
            <LiquidTagDoc liquidTag={liquidTag} />
          </Route>
        ))}

        <Route path="/liquid_docs">
          <>
            <nav aria-label="breadcrumb mb-4">
              <ol className="breadcrumb">
                <li className="breadcrumb-item active" aria-current="page">
                  Documentation home
                </li>
              </ol>
            </nav>

            <section className="mb-4">
              <h2 className="mb-2">Assigns</h2>

              {sortedAssigns.map((assign) => (
                <AssignDocLink compact assign={assign} key={assign.name} />
              ))}
            </section>

            <section className="mb-4">
              <h2 className="mb-2">Filters</h2>
              <ul className="list-group">
                {sortedFilters.map((filter) => (
                  <FilterDocLink filter={filter} key={filter.name} />
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-2">Tags</h2>

              {sortedTags.map((liquidTag) => (
                <LiquidTagDocLink liquidTag={liquidTag} key={liquidTag.name} />
              ))}
            </section>
          </>
        </Route>
      </Routes>
    </LiquidDocsContext.Provider>
  );
}

export default LiquidDocs;
