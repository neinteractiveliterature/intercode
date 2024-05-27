import { useCallback, useMemo } from 'react';
import { EditingScheduledValue } from '../BuiltInFormControls/ScheduledValueEditor';
import ScheduledValuePreview from '../UIComponents/ScheduledValuePreview';
import { MaximumEventSignupsValue, parseMaximumEventSignupsString, parseSignupRounds } from '../SignupRoundUtils';
import { TFunction } from 'i18next';
import assertNever from 'assert-never';
import { useTranslation } from 'react-i18next';
import { SignupRoundsAdminQueryData } from './queries.generated';

function getMaximumEventSignupsValueClassName(value: MaximumEventSignupsValue | undefined) {
  if (value == null) {
    return undefined;
  } else if (typeof value === 'number') {
    if (value <= 6) {
      return `maximum-event-signups-${value}`;
    } else {
      return `maximum-event-signups-${((value - 4) % 3) + 4}`;
    }
  } else {
    return `maximum-event-signups-${value?.replace(/_/g, '-')}`;
  }
}

function getMaximumEventSignupsClassName(value: string | undefined, nextValue: string | undefined) {
  const valueClassName = getMaximumEventSignupsValueClassName(parseMaximumEventSignupsString(value));

  if (value === nextValue || !nextValue) {
    return valueClassName ?? '';
  }

  const nextValueClassName = getMaximumEventSignupsValueClassName(parseMaximumEventSignupsString(nextValue));

  return `${valueClassName} ${nextValueClassName}-transition`;
}

function getMaximumEventSignupsDescription(value: string | undefined, t: TFunction) {
  const parsedValue = parseMaximumEventSignupsString(value);

  if (parsedValue == null) {
    return undefined;
  } else if (typeof parsedValue === 'number') {
    return t('signups.maximumSignups.limitedCount', { count: parsedValue });
  } else if (parsedValue === 'not_now') {
    return t('signups.maximumSignups.notNow');
  } else if (parsedValue === 'not_yet') {
    return t('signups.maximumSignups.notYet');
  } else if (parsedValue === 'unlimited') {
    return t('signups.maximumSignups.unlimited');
  }

  assertNever(parsedValue, true);
  return value;
}

export type MaximumEventSignupsPreviewProps = {
  signupRounds: SignupRoundsAdminQueryData['convention']['signup_rounds'];
  timezoneName: string;
};

export default function MaximumEventSignupsPreview({
  signupRounds,
  timezoneName,
}: MaximumEventSignupsPreviewProps): JSX.Element {
  const { t } = useTranslation();
  const getDescriptionForValue = useCallback(
    (value: string | undefined) => getMaximumEventSignupsDescription(value, t),
    [t],
  );

  const maximumEventSignups: EditingScheduledValue<string> = useMemo(() => {
    const parsedSignupRounds = parseSignupRounds(signupRounds);
    return {
      timespans: parsedSignupRounds.map((round) => ({
        start: round.timespan.start?.toISO(),
        finish: round.timespan.finish?.toISO(),
        value: round.maximum_event_signups?.toString() ?? 'not_yet',
      })),
    };
  }, [signupRounds]);

  return (
    <ScheduledValuePreview
      scheduledValue={maximumEventSignups}
      getClassNameForValue={getMaximumEventSignupsClassName}
      getDescriptionForValue={getDescriptionForValue}
      timezoneName={timezoneName}
    />
  );
}
