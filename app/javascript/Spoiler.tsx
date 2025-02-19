import { useState, ReactNode } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import spoilerStyles from 'styles/spoiler.module.scss';

export type SpoilerProps = {
  content: ReactNode;
};

function Spoiler({ content }: SpoilerProps): JSX.Element {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => setVisible((prevVisible) => !prevVisible);

  return (
    <span
      className={classNames('spoiler', spoilerStyles.spoiler, {
        'spoiler-hidden': !visible,
        [spoilerStyles.spoilerHidden]: !visible,
      })}
      aria-hidden={!visible}
      onClick={toggleVisible}
      onKeyDown={toggleVisible}
      role="button"
      tabIndex={-1}
    >
      {content}
      <span className={`spoiler-hover ${spoilerStyles.spoilerHover}`}>{t('spoiler.hoverText')}</span>
    </span>
  );
}

export default Spoiler;
