import { useCallback, useEffect } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import { usePopper } from 'react-popper';

export function useAutoClosingPopper(
  setVisible: React.Dispatch<boolean>,
  referenceElement: HTMLElement | undefined | null,
  popperElement: HTMLElement | undefined | null,
) {
  const hide = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onClickOutsideRef = useOnclickOutside(hide);
  useEffect(() => {
    if (referenceElement) {
      onClickOutsideRef(referenceElement);
    }
    if (popperElement) {
      onClickOutsideRef(popperElement);
    }
  }, [onClickOutsideRef, referenceElement, popperElement]);
}

export function useIntercodePopper(
  popperElement: HTMLElement | undefined | null,
  referenceElement: HTMLElement | undefined | null,
  arrowElement: HTMLElement | undefined | null,
  options?: Parameters<typeof usePopper>[2],
) {
  return usePopper(referenceElement, popperElement, {
    placement: 'bottom',
    strategy: 'fixed',
    modifiers: arrowElement
      ? [{ name: 'arrow', options: { element: arrowElement } }, ...(options?.modifiers ?? [])]
      : options?.modifiers,
    ...options,
  });
}

export function useIntercodePopperWithAutoClosing(
  popperElement: HTMLElement | undefined | null,
  referenceElement: HTMLElement | undefined | null,
  arrowElement: HTMLElement | undefined | null,
  setVisible: React.Dispatch<boolean>,
  options?: Parameters<typeof usePopper>[2],
) {
  useAutoClosingPopper(setVisible, referenceElement, popperElement);
  return useIntercodePopper(popperElement, referenceElement, arrowElement, options);
}

export function useToggleOpen(
  setDropdownOpen: (updater: (prev: boolean) => boolean) => void,
  update: ReturnType<typeof usePopper>['update'],
) {
  const toggleOpen = useCallback(() => {
    setDropdownOpen((prev) => !prev);
    if (update) {
      update();
    }
  }, [update, setDropdownOpen]);

  return toggleOpen;
}
