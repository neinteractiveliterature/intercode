import React, {
  useState, useEffect, useRef, useImperativeHandle, forwardRef, Ref, CSSProperties,
  ReactNode,
} from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';
import {
  Manager, Reference, Popper, PopperProps, PopperChildrenProps,
} from 'react-popper';
import classNames from 'classnames';
import onClickOutside from 'react-onclickoutside';

export type PopperDropdownContentProps = {
  visible: boolean,
  popperRef: Ref<any>,
  style: CSSProperties,
  placement: PopperProps['placement'],
  suppressWrapperDiv?: boolean,
  children: ReactNode,
};

function PopperDropdownContent({
  visible, popperRef, style, placement, suppressWrapperDiv, children,
}: PopperDropdownContentProps) {
  if (suppressWrapperDiv) {
    return <>{children}</>;
  }

  return (
    <div
      className={classNames('dropdown-menu', { show: visible })}
      ref={popperRef}
      style={style}
      data-placement={placement}
    >
      {children}
    </div>
  );
}

const PopperDropdownContentWithOnClickOutside = onClickOutside(PopperDropdownContent);

export type PopperDropdownChildrenProps = PopperChildrenProps & {
  visible: boolean,
  toggle: React.MouseEventHandler,
  setVisible: React.Dispatch<boolean>,
};

export type PopperDropdownChildrenRenderFunction = (
  (props: PopperDropdownChildrenProps) => JSX.Element
);

export type PopperDropdownProps = {
  children: JSX.Element | PopperDropdownChildrenRenderFunction,
  onToggle?: (prevVisible: boolean | undefined, event: React.BaseSyntheticEvent) => any,
  placement: PopperProps['placement'],
  renderReference: (options: {
    ref: Ref<any>,
    toggle: (event: React.BaseSyntheticEvent) => void,
    setVisible: React.Dispatch<boolean>,
    visible: boolean,
  }) => JSX.Element,
  style?: CSSProperties,
  visible?: boolean,
  modifiers?: PopperProps['modifiers'],
};

function PopperDropdown({
  children, onToggle, placement, renderReference, style, visible, modifiers,
}: PopperDropdownProps, ref: Ref<any>) {
  const [internalVisible, setInternalVisible] = useState(visible);
  useEffect(() => { setInternalVisible(visible); }, [visible]);
  const managerNode = useRef(null);

  useImperativeHandle(ref, () => ({ setVisible: setInternalVisible }));

  const handleClickOutside = (event: React.MouseEvent) => {
    // eslint-disable-next-line react/no-find-dom-node
    if (managerNode.current && findDOMNode(managerNode.current)?.contains(event.target as Node)) {
      return;
    }

    setInternalVisible(false);
  };

  const targetClicked = (event: React.SyntheticEvent) => {
    if (onToggle) {
      setInternalVisible((prevVisible) => onToggle(prevVisible, event));
    } else {
      setInternalVisible((prevVisible) => !prevVisible);
    }
  };

  const effectivePlacement = placement || 'bottom-start';

  return (
    <Manager ref={managerNode}>
      <Reference>
        {({ ref: popperRef }) => renderReference({
          ref: popperRef,
          toggle: targetClicked,
          setVisible: setInternalVisible,
          visible: internalVisible || false,
        })}
      </Reference>
      {ReactDOM.createPortal(
        (
          <Popper
            placement={internalVisible ? effectivePlacement : undefined}
            modifiers={{
              preventOverflow: { boundariesElement: 'viewport' },
              ...(modifiers || {}),
            }}
          >
            {({ ref: popperRef, style: popperStyle, ...otherProps }) => {
              const effectiveStyle = { ...(style || {}), ...popperStyle };

              return (
                <PopperDropdownContentWithOnClickOutside
                  popperRef={popperRef}
                  style={effectiveStyle}
                  placement={effectivePlacement}
                  visible={internalVisible || false}
                  handleClickOutside={handleClickOutside}
                  suppressWrapperDiv={typeof children === 'function'}
                >
                  {
                    typeof children === 'function'
                      ? children({
                        ref: popperRef,
                        style: effectiveStyle,
                        visible: internalVisible || false,
                        toggle: targetClicked,
                        setVisible: setInternalVisible,
                        ...otherProps,
                        placement: effectivePlacement,
                      })
                      : children
                  }
                </PopperDropdownContentWithOnClickOutside>
              );
            }}
          </Popper>
        ),
        document.body,
      )}
    </Manager>
  );
}

const PopperDropdownWithRefForwarding = forwardRef(PopperDropdown);

export default PopperDropdownWithRefForwarding;
