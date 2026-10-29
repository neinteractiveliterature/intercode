import { Link, useLocation, useParams } from 'react-router';

import MethodDoc from './MethodDoc';
import { useLiquidDocs } from './loader';
import FourOhFourPage from '../FourOhFourPage';

function FilterDoc(): React.JSX.Element {
  const { name } = useParams();
  const { filters } = useLiquidDocs();
  const location = useLocation();
  const filter = name ? filters[name] : undefined;

  if (!filter) {
    return <FourOhFourPage />;
  }

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">
            <Link to={`/liquid_docs${location.search}`}>Documentation home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {filter.name}
          </li>
        </ol>
      </nav>

      <section id={filter.name} className="card my-4">
        <div className="card-body">
          <MethodDoc
            method={{
              ...filter,
              name: `input | ${filter.name}`,
            }}
          />
        </div>
      </section>
    </>
  );
}

export default FilterDoc;
