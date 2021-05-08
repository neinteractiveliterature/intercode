import EventRatingIcon from '../../EventRatings/EventRatingIcon';
import { SignupStatus } from './StylingUtils';

export type SignupStatusBadgeProps = {
  signupStatus?: SignupStatus | null;
  myRating?: number;
};

function SignupStatusBadge({ signupStatus, myRating }: SignupStatusBadgeProps) {
  if (signupStatus === SignupStatus.Confirmed) {
    return <i className="fa fa-user-circle me-1" title="Confirmed signup" />;
  }

  if (signupStatus === SignupStatus.Waitlisted) {
    return <i className="fa fa-hourglass-half me-1" title="Waitlisted" />;
  }

  if (signupStatus === SignupStatus.RequestPending) {
    return <i className="fa fa-pause-circle me-1" title="Signup request pending" />;
  }

  if (myRating) {
    return (
      <span className="me-1">
        <EventRatingIcon rating={myRating} selected />
      </span>
    );
  }

  return <></>;
}

export default SignupStatusBadge;
