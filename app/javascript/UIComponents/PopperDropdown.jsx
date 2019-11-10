import React, {
  useState, useEffect, useRef, useImperativeHandle, forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import ReactDOM, { findDOMNode } from 'react-dom';
import { Manager, Reference, Popper } from 'react-popper';
import classNames from 'classnames';
import onClickOutside from 'react-onclickoutside';

function PopperDropdownContent({
  visible, getPopperRef, style, placement, suppressWrapperDiv, children,
}) {
  if (suppressWrapperDiv) {
    return children;
  }

  return (
    <div
      className={classNames('dropdown-menu', { show: visible })}
      ref={getPopperRef}
      style={style}
      data-placement={placement}
    >
      {children}
    </div>
  );
}

PopperDropdownContent.propTypes = {
  visible: PropTypes.bool.isRequired,
  getPopperRef: PropTypes.func.isRequired,
  style: PropTypes.shape({}).isRequired,
  placement: PropTypes.string.isRequired,
  suppressWrapperDiv: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

const PopperDropdownContentWithOnClickOutside = onClickOutside(PopperDropdownContent);

function PopperDropdown({
  // eslint-disable-next-line react/prop-types
  children, onToggle, placement, renderReference, visible,
}, ref) {
  const [internalVisible, setInternalVisible] = useState(visible);
  useEffect(() => { setInternalVisible(visible); }, [visible]);
  const managerNode = useRef(null);

  useImperativeHandle(ref, () => ({ setVisible: setInternalVisible }));

  const handleClickOutside = (event) => {
    // eslint-disable-next-line react/no-find-dom-node
    if (managerNode.current && findDOMNode(managerNode.current).contains(event.target)) {
      return;
    }

    setInternalVisible(false);
  };

  const targetClicked = (event) => {
    if (onToggle) {
      setInternalVisible((prevVisible) => onToggle(prevVisible, event));
    } else {
      setInternalVisible((prevVisible) => !prevVisible);
    }
  };

  const effectivePlacement = placement || 'bottom-start';
  const popoverParent = document.querySelectorAll('.non-cms-page')[0] || document.body;

  return (
    <Manager ref={managerNode}>
      <Reference>
        {({ ref: popperRef }) => renderReference({
          ref: popperRef,
          toggle: targetClicked,
          setVisible: setInternalVisible,
        })}
      </Reference>
      {ReactDOM.createPortal(
        (
          <Popper
            placement={internalVisible ? effectivePlacement : 'invalid'}
            modifiers={{
              preventOverflow: { boundariesElement: popoverParent },
            }}
          >
            {({ ref: popperRef, style, ...otherProps }) => (
              <PopperDropdownContentWithOnClickOutside
                getPopperRef={popperRef}
                style={style}
                placement={effectivePlacement}
                visible={internalVisible || false}
                handleClickOutside={handleClickOutside}
                suppressWrapperDiv={typeof children === 'function'}
              >
                {
                  typeof children === 'function'
                    ? children({
                      ref: popperRef,
                      style,
                      visible: internalVisible || false,
                      toggle: targetClicked,
                      setVisible: setInternalVisible,
                      ...otherProps,
                      placement: effectivePlacement,
                    })
                    : children
                }
              </PopperDropdownContentWithOnClickOutside>
            )}
          </Popper>
        ),
        popoverParent,
      )}
    </Manager>
  );
}

const PopperDropdownWithRefForwarding = forwardRef(PopperDropdown);

PopperDropdownWithRefForwarding.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  onToggle: PropTypes.func,
  placement: PropTypes.string,
  renderReference: PropTypes.func.isRequired,
  visible: PropTypes.bool,
};

PopperDropdownWithRefForwarding.defaultProps = {
  onToggle: null,
  placement: 'bottom-start',
  visible: null,
};

export default PopperDropdownWithRefForwarding;
