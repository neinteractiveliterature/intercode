import EventRatingIcon from '../../EventRatings/EventRatingIcon';
import { SignupStatus } from './StylingUtils';

export type SignupStatusBadgeProps = {
  signupStatus?: SignupStatus | null;
  myRating?: number;
};

function SignupStatusBadge({ signupStatus, myRating }: SignupStatusBadgeProps): JSX.Element {
  if (signupStatus === SignupStatus.Confirmed) {
    return <i className="bi-person-circle me-1" title="Confirmed signup" />;
  }

  if (signupStatus === SignupStatus.Waitlisted) {
    return <i className="bi-hourglass-split me-1" title="Waitlisted" />;
  }

  if (signupStatus === SignupStatus.RequestPending) {
    return <i className="bi-pause-circle-fill me-1" title="Signup request pending" />;
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
