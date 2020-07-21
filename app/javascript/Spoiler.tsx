import React, { useState, ReactNode } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

export type SpoilerProps = {
  content: ReactNode,
};

function Spoiler({ content }: SpoilerProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => setVisible((prevVisible) => !prevVisible);

  return (
    <span
      className={classNames('spoiler', { 'spoiler-hidden': !visible })}
      aria-hidden={!visible}
      onClick={toggleVisible}
      onKeyDown={toggleVisible}
      role="button"
      tabIndex={-1}
    >
      {content}
      <span className="spoiler-hover">{t('spoiler.hoverText', 'Click to reveal')}</span>
    </span>
  );
}

export default Spoiler;
