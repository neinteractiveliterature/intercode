import { Link, useLocation } from 'react-router-dom';

import MethodDoc from './MethodDoc';
import { YardMethod } from './DocData';

export type FilterDocHeaderProps = {
  filter: YardMethod;
};

function FilterDoc({ filter }: FilterDocHeaderProps): JSX.Element {
  const location = useLocation();

  return (
    <>
      <nav aria-label="breadcrumb mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to={`/liquid_docs${location.search}`}>Documentation home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {filter.name}
          </li>
        </ol>
      </nav>

      <section id={filter.name} className="card my-4">
        <MethodDoc
          method={{
            ...filter,
            name: `input | ${filter.name}`,
          }}
        />
      </section>
    </>
  );
}

export default FilterDoc;
