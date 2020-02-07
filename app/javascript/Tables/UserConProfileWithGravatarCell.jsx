import React from 'react';
import PropTypes from 'prop-types';

import Gravatar from '../Gravatar';

function UserConProfileWithGravatarCell({ value }) {
  return (
    <>
      <Gravatar
        url={value.gravatar_url}
        enabled={value.gravatar_enabled}
        pixelSize={16}
      />
      {' '}
      {value.name_inverted}
    </>
  );
}

UserConProfileWithGravatarCell.propTypes = {
  value: PropTypes.shape({
    gravatar_enabled: PropTypes.bool,
    gravatar_url: PropTypes.string,
    name_inverted: PropTypes.string.isRequired,
  }).isRequired,
};

export default UserConProfileWithGravatarCell;
