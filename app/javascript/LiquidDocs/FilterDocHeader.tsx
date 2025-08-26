import { YardMethod } from './DocData';

export type FilterDocHeaderProps = {
  filter: YardMethod;
};

function FilterDocHeader({ filter }: FilterDocHeaderProps): React.JSX.Element {
  return (
    <>
      <div>
        <code>
          {'{{ input | '}
          {filter.name}
          {' }}'}
        </code>
      </div>
      {filter.docstring ? <p className="mt-2 mb-0">{filter.docstring}</p> : null}
    </>
  );
}

export default FilterDocHeader;
