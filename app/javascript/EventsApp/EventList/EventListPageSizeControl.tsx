import * as React from 'react';

export type EventListPageSizeControlProps = {
  pageSize: number;
  onPageSizeChange: React.Dispatch<number>;
};

function EventListPageSizeControl({ pageSize, onPageSizeChange }: EventListPageSizeControlProps): JSX.Element {
  return (
    <div className="form-inline align-items-start">
      <select
        className="form-select mx-1"
        value={pageSize.toString()}
        onChange={(event) => {
          onPageSizeChange(Number.parseInt(event.target.value, 10));
        }}
      >
        {[10, 20, 50, 100, 200].map((pageSizeOption) => (
          <option value={pageSizeOption.toString()} key={pageSizeOption}>
            {pageSizeOption} per page
          </option>
        ))}
      </select>
    </div>
  );
}

export default EventListPageSizeControl;
