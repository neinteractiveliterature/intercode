import {
  useState, useRef, useLayoutEffect, useEffect,
} from 'react';
import classnames from 'classnames';

const COLLAPSE_DURATION = 350;

export default function useCollapse(elementRef) {
  const [collapsed, setCollapsed] = useState(true);
  const [prevCollapsed, setPrevCollapsed] = useState(true);
  const [collapsing, setCollapsing] = useState(false);
  const collapseTimeoutId = useRef(null);
  const [heightOverride, setHeightOverride] = useState(null);

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
    setHeightOverride(null);
    setCollapsing(false);
    collapseTimeoutId.current = null;
  };

  useLayoutEffect(
    () => {
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
          collapseTimeoutId.current = null;
        }

        requestAnimationFrame(() => {
          if (collapsed) {
            // force a reflow; stolen from Reactstrap
            // eslint-disable-next-line no-unused-vars
            const unused = elementRef.current.scrollHeight;
            setHeightOverride(0);
          }

          collapseTimeoutId.current = setTimeout(finishCollapse, COLLAPSE_DURATION);
        });
      }
    },
    [collapsed, elementRef, prevCollapsed],
  );

  useEffect(() => () => {
    if (collapseTimeoutId.current) {
      clearTimeout(collapseTimeoutId.current);
      collapseTimeoutId.current = null;
    }
  }, []);

  const collapseProps = {
    className: classnames({
      collapsing,
      collapse: !collapsing,
      show: !(collapsed || collapsing),
    }),
    style: { height: heightOverride },
  };

  return {
    collapsed, toggleCollapsed, setCollapsed, collapseProps,
  };
}
