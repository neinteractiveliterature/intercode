import React, { CSSProperties, forwardRef, ReactNode, useImperativeHandle, useState } from 'react';
import classNames from 'classnames';
import { useLitformPopperWithAutoClosing, useToggleOpen } from '@neinteractiveliterature/litform';

import useAutoCloseOnNavigate from '../NavigationBar/useAutoCloseOnNavigate';
import { createPortal } from 'react-dom';

export type DropdownMenuRef = {
  dropdownOpen: boolean;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

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

export const DropdownMenu = forwardRef(function DropdownMenuInner(
  {
    children,
    buttonContent,
    buttonClassName,
    buttonStyle,
    dropdownClassName,
    dropdownStyle,
    popperOptions,
    shouldAutoCloseOnNavigate,
  }: DropdownMenuProps,
  ref,
): React.JSX.Element {
  const [dropdownButton, setDropdownButton] = useState<HTMLButtonElement | null>(null);
  const [dropdownMenu, setDropdownMenu] = useState<HTMLDivElement | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({ dropdownOpen, setDropdownOpen }) satisfies DropdownMenuRef);

  const { styles, attributes, update } = useLitformPopperWithAutoClosing(
    dropdownMenu,
    dropdownButton,
    undefined,
    setDropdownOpen,
    {
      placement: 'bottom-start',
      modifiers: [{ name: 'offset', options: { offset: [0, 2] } }, ...(popperOptions?.modifiers ?? [])],
      ...popperOptions,
    },
  );

  const toggleOpen = useToggleOpen(setDropdownOpen, update);
  useAutoCloseOnNavigate(setDropdownOpen, shouldAutoCloseOnNavigate);

  const content = (
    <div
      className={classNames('dropdown-menu m-0', dropdownClassName, { show: dropdownOpen })}
      ref={setDropdownMenu}
      style={{ ...styles.popper, ...dropdownStyle }}
      {...attributes.popper}
    >
      {children}
    </div>
  );

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
      {typeof document === 'undefined' ? content : createPortal(content, document.body)}
    </>
  );
});
