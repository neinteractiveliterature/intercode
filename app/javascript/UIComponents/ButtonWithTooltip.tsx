import { ReactNode, useCallback, useState } from 'react';
import * as React from 'react';

import { useIntercodePopper } from './PopperUtils';
import Tooltip from './Tooltip';

export type ButtonWithTooltipProps = {
  children: ReactNode;
  buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement>;
  tooltipContent: ReactNode;
};

function ButtonWithTooltip({ children, buttonProps, tooltipContent }: ButtonWithTooltipProps) {
  const [dropdownButton, setDropdownButton] = useState<HTMLButtonElement | null>(null);
  const [tooltip, setTooltip] = useState<HTMLDivElement | null>(null);
  const [arrow, setArrow] = useState<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  const { styles, attributes, state, update } = useIntercodePopper(tooltip, dropdownButton, arrow);

  const show = useCallback(() => {
    setVisible(true);
    if (update) {
      update();
    }
  }, [update]);

  return (
    <>
      <button
        ref={setDropdownButton}
        type="button"
        onFocus={show}
        onBlur={() => setVisible(false)}
        onMouseOver={show}
        onMouseOut={() => setVisible(false)}
        {...buttonProps}
      >
        {children}
      </button>
      <Tooltip
        popperRef={setTooltip}
        arrowRef={setArrow}
        state={state}
        attributes={attributes}
        styles={styles}
        visible={visible}
      >
        {tooltipContent}
      </Tooltip>
    </>
  );
}

export default ButtonWithTooltip;
