import classNames from 'classnames';
import React, { ReactNode, useState } from 'react';

import { useIntercodePopperWithAutoClosing, useToggleOpen } from '../UIComponents/PopperUtils';
import useAutoCloseOnNavigate from './useAutoCloseOnNavigate';

export type NavigationSectionProps = {
  children: ReactNode;
  label: ReactNode;
};

function NavigationSection({ children, label }: NavigationSectionProps) {
  const [dropdownLi, setDropdownLi] = useState<HTMLLIElement | null>(null);
  const [dropdownMenu, setDropdownMenu] = useState<HTMLDivElement | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const { styles, attributes, update } = useIntercodePopperWithAutoClosing(
    dropdownMenu,
    dropdownLi,
    undefined,
    setDropdownOpen,
    {
      placement: 'bottom-start',
    },
  );

  const toggle = useToggleOpen(setDropdownOpen, update);
  useAutoCloseOnNavigate(setDropdownOpen);

  return (
    <>
      <li className="nav-item dropdown" role="presentation" ref={setDropdownLi}>
        <button className="btn btn-link nav-link dropdown-toggle" onClick={toggle} type="button">
          {label}
        </button>
      </li>
      <div
        className={classNames('dropdown-menu', { show: dropdownOpen })}
        ref={setDropdownMenu}
        style={{
          zIndex: 1100,
          ...styles.popper,
        }}
        {...attributes.popper}
      >
        {children}
      </div>
    </>
  );
}

export default NavigationSection;
