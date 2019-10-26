import React from 'react';
import PropTypes from 'prop-types';
import { getRatingIconClass, RATING_NAMES } from '../../EventRatings/EventRatingIcon';

function SignupStatusBadge({ signupStatus, myRating }) {
  if (signupStatus === 'confirmed') {
    return <i className="fa fa-user-circle mr-1" title="Confirmed signup" />;
  }

  if (signupStatus === 'waitlisted') {
    return <i className="fa fa-hourglass-half mr-1" title="Waitlisted" />;
  }

  if (signupStatus === 'request_pending') {
    return <i className="fa fa-pause-circle mr-1" title="Signup request pending" />;
  }

  if (myRating) {
    return <i className={`fa ${getRatingIconClass(myRating, true)} mr-1`} title={RATING_NAMES[myRating]} />;
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
