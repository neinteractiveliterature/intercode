import { useCallback, useRef } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import { usePopper } from 'react-popper';

export function useAutoClosingPopper(
  setVisible: React.Dispatch<boolean>,
  referenceElement: HTMLElement | undefined | null,
  popperElement: HTMLElement | undefined | null,
) {
  const referenceRef = useRef<HTMLElement | null>(null);
  const popperRef = useRef<HTMLElement | null>(null);
  const hide = useCallback(() => setVisible(false), [setVisible]);

  referenceRef.current = referenceElement ?? null;
  popperRef.current = popperElement ?? null;

  useOnclickOutside(hide, { refs: [popperRef, referenceRef] });
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
    modifiers: arrowElement ? [{ name: 'arrow', options: { element: arrowElement } }] : [],
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
