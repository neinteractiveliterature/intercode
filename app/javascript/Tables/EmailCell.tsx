import { CellContext } from '@tanstack/react-table';

function EmailCell<TData, TValue extends string>({ cell }: CellContext<TData, TValue>): JSX.Element {
  return (
    <a
      href={`mailto:${cell.getValue()}`}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      {cell.getValue()}
    </a>
  );
}

export default EmailCell;
