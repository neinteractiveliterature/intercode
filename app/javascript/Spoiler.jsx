import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function Spoiler({ content }) {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => setVisible((prevVisible) => !prevVisible);

  return (
    <span
      className={classNames('spoiler', { 'spoiler-hidden': !visible })}
      aria-hidden={!visible}
      onClick={toggleVisible}
      onKeyDown={toggleVisible}
      role="button"
      tabIndex="-1"
    >
      {content}
      <span className="spoiler-hover">Click to reveal</span>
    </span>
  );
}

Spoiler.propTypes = {
  content: PropTypes.string,
};

Spoiler.defaultProps = {
  content: null,
};

export default Spoiler;
