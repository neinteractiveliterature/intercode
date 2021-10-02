import { EditingScheduledValue } from '../BuiltInFormControls/ScheduledValueEditor';
import ScheduledValuePreview from '../UIComponents/ScheduledValuePreview';

export type MaximumEventSignupsValue = 'not_yet' | '1' | '2' | '3' | 'unlimited' | 'not_now';

export const MAXIMUM_EVENT_SIGNUPS_OPTIONS = [
  ['not_yet', 'No signups yet'],
  ['1', 'Up to 1 event'],
  ['2', 'Up to 2 events'],
  ['3', 'Up to 3 events'],
  ['unlimited', 'Signups fully open'],
  ['not_now', 'Signups frozen'],
] as const;

const MAXIMUM_EVENT_SIGNUPS_CLASSNAMES = {
  not_yet: 'maximum-event-signups-not-yet',
  '1': 'maximum-event-signups-1',
  '2': 'maximum-event-signups-2',
  '3': 'maximum-event-signups-3',
  unlimited: 'maximum-event-signups-unlimited',
  not_now: 'maximum-event-signups-not-now',
} as const;

function getMaximumEventSignupsClassName(value: string | undefined, nextValue: string | undefined) {
  const valueClassName =
    MAXIMUM_EVENT_SIGNUPS_CLASSNAMES[(value ?? 'not_yet') as MaximumEventSignupsValue] ?? '';

  if (value === nextValue || !nextValue) {
    return valueClassName;
  }

  const nextValueClassName =
    MAXIMUM_EVENT_SIGNUPS_CLASSNAMES[nextValue as MaximumEventSignupsValue] ?? '';

  return `${valueClassName} ${nextValueClassName}-transition`;
}

function getMaximumEventSignupsDescription(value: string | undefined) {
  return (MAXIMUM_EVENT_SIGNUPS_OPTIONS.find(([v]) => v === value) ?? ['', value])[1];
}

export type MaximumEventSignupsPreviewProps = {
  maximumEventSignups?: EditingScheduledValue<MaximumEventSignupsValue> | null;
  timezoneName: string;
};

export default function MaximumEventSignupsPreview({
  maximumEventSignups,
  timezoneName,
}: MaximumEventSignupsPreviewProps): JSX.Element {
  return (
    <ScheduledValuePreview
      scheduledValue={maximumEventSignups ?? { timespans: [] }}
      getClassNameForValue={getMaximumEventSignupsClassName}
      getDescriptionForValue={getMaximumEventSignupsDescription}
      timezoneName={timezoneName}
    />
  );
}
