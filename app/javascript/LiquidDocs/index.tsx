import AssignDocLink from './AssignDocLink';
import FilterDocLink from './FilterDocLink';
import LiquidTagDocLink from './LiquidTagDocLink';
import { useLiquidDocs } from './loader';

function LiquidDocs(): React.JSX.Element {
  const { sortedAssigns, sortedFilters, sortedTags } = useLiquidDocs();

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb mb-4">
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
  );
}

export const Component = LiquidDocs;
