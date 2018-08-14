import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import PopperDropdown from './PopperDropdown';

class HelpPopover extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  static defaultProps = {
    children: null,
    className: null,
  };

  render = () => {
    const { children, className } = this.props;

    return (
      <PopperDropdown
        placement="auto"
        renderReference={({ ref, toggle }) => (
          <span
            role="button"
            tabIndex={0}
            className={classNames('d-inline', className)}
            ref={ref}
            onClick={toggle}
            onKeyDown={(event) => {
              if (event.keyCode === 13 || event.keyCode === 32) {
                event.preventDefault();
                toggle();
              }
            }}
          >
            <i className="fa fa-question-circle" style={{ cursor: 'pointer' }}>
              <span className="sr-only">
                Help
              </span>
            </i>
          </span>
        )}
      >
        {({
          placement,
          visible,
          arrowProps,
          ref,
          style,
        }) => (
          <div
            className={classNames(
              'card',
              'popover',
              `bs-popover-${placement}`,
              { 'd-none': !visible },
            )}
            ref={ref}
            style={style}
            data-placement={placement}
          >
            <div className="card-body">
              {children}
            </div>
            <span ref={arrowProps.ref} style={arrowProps.style} className="arrow" />
          </div>
        )}
      </PopperDropdown>
    );
  }
}


export default HelpPopover;
