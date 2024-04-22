import { useMemo } from 'react';
import EventRatingIcon from '../../EventRatings/EventRatingIcon';
import { SignupRankedChoice } from '../../graphqlTypes.generated';
import RankedChoicePriorityIndicator from '../MySignupQueue/RankedChoicePriorityIndicator';
import { SignupStatus } from './StylingUtils';
import sortBy from 'lodash/sortBy';

export type SignupStatusBadgeProps = {
  signupStatus?: SignupStatus | null;
  myRating?: number;
  mySignupRankedChoices: Pick<SignupRankedChoice, 'priority'>[];
};

function SignupStatusBadge({ signupStatus, myRating, mySignupRankedChoices }: SignupStatusBadgeProps): JSX.Element {
  const signupRankedChoicesOrdered = useMemo(
    () => sortBy(mySignupRankedChoices, (choice) => choice.priority),
    [mySignupRankedChoices],
  );

  if (signupStatus === SignupStatus.Confirmed) {
    return <i className="bi-person-circle me-1" title="Confirmed signup" />;
  }

  if (signupStatus === SignupStatus.Waitlisted) {
    return <i className="bi-hourglass-split me-1" title="Waitlisted" />;
  }

  if (signupStatus === SignupStatus.RequestPending) {
    return <i className="bi-pause-circle-fill me-1" title="Signup request pending" />;
  }

  if (signupStatus === SignupStatus.InMyQueue) {
    return (
      <>
        {signupRankedChoicesOrdered.map((choice) => (
          <RankedChoicePriorityIndicator key={choice.priority} priority={choice.priority} fontSize={12} />
        ))}
      </>
    );
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
