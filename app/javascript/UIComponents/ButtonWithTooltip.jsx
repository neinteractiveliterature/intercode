import React from 'react';
import PropTypes from 'prop-types';

import PopperDropdown from './PopperDropdown';
import Tooltip from './Tooltip';

function ButtonWithTooltip({ children, buttonProps, tooltipContent }) {
  return (
    <PopperDropdown
      placement="bottom"
      renderReference={({ ref, setVisible }) => (
        <button
          ref={ref}
          type="button"
          onFocus={() => setVisible(true)}
          onBlur={() => setVisible(false)}
          onMouseOver={() => setVisible(true)}
          onMouseOut={() => setVisible(false)}
          {...buttonProps}
        >
          {children}
        </button>
      )}
    >
      {({ ref, ...popperProps }) => (
        <Tooltip withRef={ref} {...popperProps}>
          {tooltipContent}
        </Tooltip>
      )}
    </PopperDropdown>
  );
}

ButtonWithTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  buttonProps: PropTypes.shape({}).isRequired,
  tooltipContent: PropTypes.node.isRequired,
};

export default ButtonWithTooltip;
