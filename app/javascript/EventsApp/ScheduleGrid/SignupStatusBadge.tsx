import { useMemo } from 'react';
import EventRatingIcon from '../../EventRatings/EventRatingIcon';
import { SignupRankedChoice, SignupRankedChoiceState } from '../../graphqlTypes.generated';
import RankedChoicePriorityIndicator from '../MySignupQueue/RankedChoicePriorityIndicator';
import { SignupStatus } from './StylingUtils';
import sortBy from 'lodash/sortBy';
import { useTranslation } from 'react-i18next';

export type SignupStatusBadgeProps = {
  signupStatus?: SignupStatus | null;
  myRating?: number;
  mySignupRankedChoices: Pick<SignupRankedChoice, 'priority' | 'state'>[];
};

function SignupStatusBadge({ signupStatus, myRating, mySignupRankedChoices }: SignupStatusBadgeProps): JSX.Element {
  const { t } = useTranslation();

  const signupRankedChoicesOrdered = useMemo(
    () =>
      sortBy(
        mySignupRankedChoices.filter((choice) => choice.state === SignupRankedChoiceState.Pending),
        (choice) => choice.priority,
      ),
    [mySignupRankedChoices],
  );

  if (signupStatus === SignupStatus.Confirmed) {
    return <i className="bi-person-circle me-1" title={t('signups.states.confirmed')} />;
  }

  if (signupStatus === SignupStatus.Waitlisted) {
    return <i className="bi-hourglass-split me-1" title={t('signups.states.waitlisted')} />;
  }

  if (signupStatus === SignupStatus.RequestPending) {
    return <i className="bi-pause-circle-fill me-1" title={t('signups.states.requestPending')} />;
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
