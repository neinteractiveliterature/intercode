import React, { useState, useRef, useEffect, HTMLAttributes } from 'react';
import classnames from 'classnames';

const COLLAPSE_DURATION = 350;

export type UseCollapseResult = {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleCollapsed: () => void;
  collapseProps: HTMLAttributes<HTMLElement>;
};

export default function useCollapse<T extends HTMLElement>(elementRef: React.RefObject<T>): UseCollapseResult {
  const [collapsed, setCollapsed] = useState(true);
  const [prevCollapsed, setPrevCollapsed] = useState(true);
  const [collapsing, setCollapsing] = useState(false);
  const collapseTimeoutId = useRef<number>();
  const [heightOverride, setHeightOverride] = useState<number>();

  const toggleCollapsed = () => {
    if (!collapsed && elementRef.current) {
      // set the height override early so we don't break CSS transitions by transitioning from auto
      setHeightOverride(elementRef.current.scrollHeight);
    }
    setCollapsing(true);
    setPrevCollapsed(collapsed);
    setCollapsed(!collapsed);
  };

  const finishCollapse = () => {
    setHeightOverride(undefined);
    setCollapsing(false);
    collapseTimeoutId.current = undefined;
  };

  useEffect(() => {
    if (!elementRef.current) {
      return;
    }

    if (collapsed !== prevCollapsed) {
      if (!collapsed) {
        // measure the height after the DOM has updated
        setHeightOverride(elementRef.current.scrollHeight);
      }

      if (collapseTimeoutId.current) {
        clearTimeout(collapseTimeoutId.current);
        collapseTimeoutId.current = undefined;
      }

      requestAnimationFrame(() => {
        if (collapsed) {
          // force a reflow; stolen from Reactstrap
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const unused = elementRef.current?.scrollHeight;
          setHeightOverride(0);
        }

        collapseTimeoutId.current = window.setTimeout(finishCollapse, COLLAPSE_DURATION);
      });
    }

    return () => {
      if (collapseTimeoutId.current) {
        clearTimeout(collapseTimeoutId.current);
        collapseTimeoutId.current = undefined;
      }
    };
  }, [collapsed, elementRef, prevCollapsed]);

  const collapseProps = {
    className: classnames({
      collapsing,
      collapse: !collapsing,
      show: !(collapsed || collapsing),
    }),
    style: { height: heightOverride },
  };

  return {
    collapsed,
    toggleCollapsed,
    setCollapsed,
    collapseProps,
  };
}
