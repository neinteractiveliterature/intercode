import React from 'react';
import EventRatingIcon from '../../EventRatings/EventRatingIcon';
import { SignupStatus } from './StylingUtils';

export type SignupStatusBadgeProps = {
  signupStatus?: SignupStatus | null,
  myRating?: number | null,
};

function SignupStatusBadge({ signupStatus, myRating }: SignupStatusBadgeProps) {
  if (signupStatus === SignupStatus.Confirmed) {
    return <i className="fa fa-user-circle mr-1" title="Confirmed signup" />;
  }

  if (signupStatus === SignupStatus.Waitlisted) {
    return <i className="fa fa-hourglass-half mr-1" title="Waitlisted" />;
  }

  if (signupStatus === SignupStatus.RequestPending) {
    return <i className="fa fa-pause-circle mr-1" title="Signup request pending" />;
  }

  if (myRating) {
    return <span className="mr-1"><EventRatingIcon rating={myRating} selected /></span>;
  }

  return null;
}

export default SignupStatusBadge;
