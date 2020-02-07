import React from 'react';
import PropTypes from 'prop-types';

import Gravatar from '../Gravatar';

function UserConProfileWithGravatarCell({ original }) {
  return (
    <>
      <Gravatar
        url={original.gravatar_url}
        enabled={original.gravatar_enabled}
        pixelSize={16}
      />
      {' '}
      {original.name_inverted}
    </>
  );
}

UserConProfileWithGravatarCell.propTypes = {
  original: PropTypes.shape({
    gravatar_enabled: PropTypes.bool,
    gravatar_url: PropTypes.string,
    name_inverted: PropTypes.string.isRequired,
  }).isRequired,
};

export default UserConProfileWithGravatarCell;

