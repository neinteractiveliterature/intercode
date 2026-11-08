import { type RowData } from '@tanstack/react-table';
import { type AppCellContext } from './tableFeatures';

function EmailCell<TData extends RowData, TValue extends string>({
  cell,
}: AppCellContext<TData, TValue>): React.JSX.Element {
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
