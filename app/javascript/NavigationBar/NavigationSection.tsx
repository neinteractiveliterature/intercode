import classNames from 'classnames';
import { ReactNode, useState } from 'react';
import { useLitformFloatingWithAutoClosing, useToggleOpen } from '@neinteractiveliterature/litform';

import useAutoCloseOnNavigate from './useAutoCloseOnNavigate';

export type NavigationSectionProps = {
  children: ReactNode;
  label: ReactNode;
};

function NavigationSection({ children, label }: NavigationSectionProps): React.JSX.Element {
  const [dropdownLi, setDropdownLi] = useState<HTMLLIElement | null>(null);
  const [dropdownMenu, setDropdownMenu] = useState<HTMLDivElement | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const { styles, attributes, update } = useLitformFloatingWithAutoClosing(
    dropdownMenu,
    dropdownLi,
    undefined,
    setDropdownOpen,
    {
      offset: 2,
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
        className={classNames('dropdown-menu m-0', { show: dropdownOpen })}
        ref={setDropdownMenu}
        style={{
          zIndex: 1100,
          ...styles.floating,
        }}
        {...attributes.floating}
      >
        {children}
      </div>
    </>
  );
}

export default NavigationSection;
