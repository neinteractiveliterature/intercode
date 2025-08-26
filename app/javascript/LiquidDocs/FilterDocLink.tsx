import { Link, useLocation } from 'react-router';

import FilterDocHeader from './FilterDocHeader';
import { YardMethod } from './DocData';

export type FilterDocLinkProps = {
  filter: YardMethod;
};

function FilterDocLink({ filter }: FilterDocLinkProps): React.JSX.Element {
  const location = useLocation();

  return (
    <Link to={`/liquid_docs/filters/${filter.name}${location.search}`} className="card-link m-0 text-body">
      <div className="card mb-2">
        <div className="card-header">
          <FilterDocHeader filter={filter} />
        </div>
      </div>
    </Link>
  );
}

export default FilterDocLink;
