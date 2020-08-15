import React, { ReactNode, HTMLAttributes } from 'react';
import useUniqueId from '../useUniqueId';
import useDebouncedState from '../useDebouncedState';

export type SearchInputProps = {
  value?: string;
  onChange: (value: string) => void;
  label: ReactNode;
  wait?: number;
  name?: string;
  inputProps?: HTMLAttributes<HTMLInputElement>;
  inputGroupProps?: HTMLAttributes<HTMLDivElement>;
};

function SearchInput({
  value,
  onChange,
  wait,
  name,
  label,
  inputProps,
  inputGroupProps,
}: SearchInputProps) {
  const [transientValue, setTransientValue] = useDebouncedState(value ?? '', onChange, wait ?? 100);
  const inputId = useUniqueId(`${name || 'search'}-`);

  return (
    <div className="form-group mb-0">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div className="input-group" {...(inputGroupProps || {})}>
        <input
          id={inputId}
          type="search"
          className="form-control search-input-control"
          style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
          value={transientValue ?? ''}
          name={name}
          onChange={(event) => setTransientValue(event.target.value)}
          {...(inputProps || {})}
        />
        <span className="input-group-append search-input-addon">
          <span className="input-group-text">
            <i className="fa fa-search" />
          </span>
        </span>
      </div>
    </div>
  );
}

export default SearchInput;
