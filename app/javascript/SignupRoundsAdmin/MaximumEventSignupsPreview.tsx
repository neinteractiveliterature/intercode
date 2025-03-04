import { useCallback, useMemo } from 'react';
import { EditingScheduledValue } from '../BuiltInFormControls/ScheduledValueEditor';
import ScheduledValuePreview from '../UIComponents/ScheduledValuePreview';
import { MaximumEventSignupsValue, parseMaximumEventSignupsString, parseSignupRounds } from '../SignupRoundUtils';
import { TFunction } from 'i18next';
import assertNever from 'assert-never';
import { useTranslation } from 'react-i18next';
import { SignupRoundsAdminQueryData } from './queries.generated';
import styles from 'styles/scheduled_value_previews.module.scss';
import kebabCase from 'lodash/kebabCase';

function getMaximumEventSignupsValueClassName(
  value: MaximumEventSignupsValue | undefined,
): Exclude<keyof typeof styles, `${keyof typeof styles}Transition`> | undefined {
  if (value == null) {
    return undefined;
  } else if (typeof value === 'number') {
    switch (value) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        // eslint-disable-next-line i18next/no-literal-string
        return `maximumEventSignups${value}`;
      default:
        // eslint-disable-next-line i18next/no-literal-string
        return `maximumEventSignups${(((value - 4) % 3) + 4) as 4 | 5 | 6}`;
    }
  } else {
    switch (value) {
      case 'not_now':
        // eslint-disable-next-line i18next/no-literal-string
        return 'maximumEventSignupsNotNow';
      case 'not_yet':
        // eslint-disable-next-line i18next/no-literal-string
        return 'maximumEventSignupsNotYet';
      case 'unlimited':
        // eslint-disable-next-line i18next/no-literal-string
        return 'maximumEventSignupsUnlimited';
      default:
        assertNever(value);
    }
  }
}

function getMaximumEventSignupsClassNames(
  value: string | undefined,
  nextValue: string | undefined,
): (keyof typeof styles)[] {
  const valueClassName = getMaximumEventSignupsValueClassName(parseMaximumEventSignupsString(value));

  if (value === nextValue || !nextValue) {
    return valueClassName ? [valueClassName] : [];
  }

  const nextValueClassName = getMaximumEventSignupsValueClassName(parseMaximumEventSignupsString(nextValue));

  return [
    ...((valueClassName ? [valueClassName] : []) as (keyof typeof styles)[]),
    // eslint-disable-next-line i18next/no-literal-string
    ...((nextValueClassName ? [`${nextValueClassName}Transition`] : []) as (keyof typeof styles)[]),
  ];
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
      getClassNameForValue={(value, nextValue) => {
        const classNames = getMaximumEventSignupsClassNames(value, nextValue);
        return [...classNames.map((cn) => kebabCase(cn)), ...classNames.map((cn) => styles[cn])].join(' ');
      }}
      getDescriptionForValue={getDescriptionForValue}
      timezoneName={timezoneName}
    />
  );
}
