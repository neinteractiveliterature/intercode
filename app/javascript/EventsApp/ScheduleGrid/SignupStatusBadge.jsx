import React from 'react';
import PropTypes from 'prop-types';

function SignupStatusBadge({ signupStatus }) {
  if (signupStatus === 'confirmed') {
    return <i className="fa fa-user-circle mr-1" title="Confirmed signup" />;
  }

  if (signupStatus === 'waitlisted') {
    return <i className="fa fa-hourglass-half mr-1" title="Waitlisted" />;
  }

  if (signupStatus === 'request_pending') {
    return <i className="fa fa-pause-circle mr-1" title="Signup request pending" />;
  }

  return null;
}

SignupStatusBadge.propTypes = {
  signupStatus: PropTypes.string,
};

SignupStatusBadge.defaultProps = {
  signupStatus: null,
};

export default SignupStatusBadge;
