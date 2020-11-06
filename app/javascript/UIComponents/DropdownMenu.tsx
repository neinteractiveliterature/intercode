import { CSSProperties, ReactNode, useState } from 'react';
import classNames from 'classnames';

import { useIntercodePopperWithAutoClosing, useToggleOpen } from './PopperUtils';
import useAutoCloseOnNavigate from '../NavigationBar/useAutoCloseOnNavigate';

export type DropdownMenuProps = {
  buttonContent: ReactNode;
  buttonClassName?: string;
  buttonStyle?: CSSProperties;
  children: ReactNode;
  dropdownClassName?: string;
  dropdownStyle?: CSSProperties;
  popperOptions?: Parameters<typeof useIntercodePopperWithAutoClosing>[4];
};

export function DropdownMenu({
  children,
  buttonContent,
  buttonClassName,
  buttonStyle,
  dropdownClassName,
  dropdownStyle,
  popperOptions,
}: DropdownMenuProps) {
  const [dropdownButton, setDropdownButton] = useState<HTMLButtonElement | null>(null);
  const [dropdownMenu, setDropdownMenu] = useState<HTMLDivElement | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const { styles, attributes, update } = useIntercodePopperWithAutoClosing(
    dropdownMenu,
    dropdownButton,
    undefined,
    setDropdownOpen,
    {
      placement: 'bottom-start',
      ...popperOptions,
    },
  );

  const toggleOpen = useToggleOpen(setDropdownOpen, update);
  useAutoCloseOnNavigate(setDropdownOpen);

  return (
    <>
      <button
        type="button"
        className={buttonClassName ?? 'btn dropdown-toggle'}
        ref={setDropdownButton}
        onClick={toggleOpen}
        style={buttonStyle}
      >
        {buttonContent}
      </button>
      <div
        className={classNames('dropdown-menu', dropdownClassName, { show: dropdownOpen })}
        ref={setDropdownMenu}
        style={{ ...styles.popper, ...dropdownStyle }}
        {...attributes.popper}
      >
        {children}
      </div>
    </>
  );
}
