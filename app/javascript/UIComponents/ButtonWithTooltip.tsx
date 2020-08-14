import React, { ReactNode } from 'react';

import PopperDropdown from './PopperDropdown';
import Tooltip from './Tooltip';

export type ButtonWithTooltipProps = {
  children: ReactNode,
  buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement>,
  tooltipContent: ReactNode,
};

function ButtonWithTooltip({ children, buttonProps, tooltipContent }: ButtonWithTooltipProps) {
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

export default ButtonWithTooltip;
