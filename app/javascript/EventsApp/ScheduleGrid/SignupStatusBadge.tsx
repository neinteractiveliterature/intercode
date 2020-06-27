import React from 'react';
import EventRatingIcon from '../../EventRatings/EventRatingIcon';

export type SignupStatusBadgeProps = {
  signupStatus?: 'confirmed' | 'waitlisted' | 'request_pending' | null,
  myRating?: number | null,
};

function SignupStatusBadge({ signupStatus, myRating }: SignupStatusBadgeProps) {
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
    return <span className="mr-1"><EventRatingIcon rating={myRating} selected /></span>;
  }

  return null;
}

export default SignupStatusBadge;
