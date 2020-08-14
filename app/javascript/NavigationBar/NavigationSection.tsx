import React, { ReactNode } from 'react';

import PopperDropdown, { PopperDropdownChildrenRenderFunction } from '../UIComponents/PopperDropdown';
import useAutoClosingDropdownRef from './useAutoClosingDropdownRef';

export type NavigationSectionProps = {
  children: JSX.Element | PopperDropdownChildrenRenderFunction,
  label: ReactNode,
};

function NavigationSection({ children, label }: NavigationSectionProps) {
  const dropdownRef = useAutoClosingDropdownRef();

  return (
    <PopperDropdown
      ref={dropdownRef}
      renderReference={({ ref, toggle }) => (
        <li className="nav-item dropdown" role="presentation" ref={ref}>
          <button className="btn btn-link nav-link dropdown-toggle" onClick={toggle} type="button">{label}</button>
        </li>
      )}
      style={{ zIndex: 1100 }}
    >
      {children}
    </PopperDropdown>
  );
}

export default NavigationSection;
