import { CSSProperties, ReactNode, useState } from 'react';
import classNames from 'classnames';
import { useLitformPopperWithAutoClosing, useToggleOpen } from '@neinteractiveliterature/litform';

import useAutoCloseOnNavigate from '../NavigationBar/useAutoCloseOnNavigate';

export type DropdownMenuProps = {
  buttonContent: ReactNode;
  buttonClassName?: string;
  buttonStyle?: CSSProperties;
  children: ReactNode;
  dropdownClassName?: string;
  dropdownStyle?: CSSProperties;
  popperOptions?: Parameters<typeof useLitformPopperWithAutoClosing>[4];
  shouldAutoCloseOnNavigate?: Parameters<typeof useAutoCloseOnNavigate>[1];
};

export function DropdownMenu({
  children,
  buttonContent,
  buttonClassName,
  buttonStyle,
  dropdownClassName,
  dropdownStyle,
  popperOptions,
  shouldAutoCloseOnNavigate,
}: DropdownMenuProps) {
  const [dropdownButton, setDropdownButton] = useState<HTMLButtonElement | null>(null);
  const [dropdownMenu, setDropdownMenu] = useState<HTMLDivElement | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const { styles, attributes, update } = useLitformPopperWithAutoClosing(
    dropdownMenu,
    dropdownButton,
    undefined,
    setDropdownOpen,
    {
      placement: 'bottom-start',
      modifiers: [
        { name: 'offset', options: { offset: [0, 2] } },
        ...(popperOptions?.modifiers ?? []),
      ],
      ...popperOptions,
    },
  );

  const toggleOpen = useToggleOpen(setDropdownOpen, update);
  useAutoCloseOnNavigate(setDropdownOpen, shouldAutoCloseOnNavigate);

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
        className={classNames('dropdown-menu m-0', dropdownClassName, { show: dropdownOpen })}
        ref={setDropdownMenu}
        style={{ ...styles.popper, ...dropdownStyle }}
        {...attributes.popper}
      >
        {children}
      </div>
    </>
  );
}
