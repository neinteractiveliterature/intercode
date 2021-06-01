import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';

import { timespanFromRun } from '../../TimespanUtils';
import AppRootContext from '../../AppRootContext';
import { useRunHeaderRunInfoQuery } from './queries.generated';
import { useFormatRunTimespan } from '../runTimeFormatting';

export type RunHeaderProps = {
  eventId: number;
  runId: number;
};

function RunHeader({ eventId, runId }: RunHeaderProps) {
  const { t } = useTranslation();
  const { timezoneName } = useContext(AppRootContext);
  const { data, loading, error } = useRunHeaderRunInfoQuery({
    variables: { runId, eventId },
  });
  const formatRunTimespan = useFormatRunTimespan();

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const { event } = data!;

  return (
    <div>
      <h1 className="mb-0">
        {event.title}
        {event.run.title_suffix && event.run.title_suffix.trim() !== ''
          ? `- ${event.run.title_suffix}`
          : ''}
      </h1>

      <h3 className="mt-0">
        {formatRunTimespan(timespanFromRun(timezoneName, event, event.run), {
          formatType: 'short',
        })}
      </h3>

      <ul className="list-inline">
        {event.registration_policy?.slots_limited && (
          <li className="list-inline-item">
            {t('events.runHeader.maxSignups', 'Max signups: {{ count }}', {
              count: event.registration_policy.total_slots ?? undefined,
            })}
          </li>
        )}

        {(event.registration_policy?.buckets.length ?? 0) > 1 ? (
          <li className="list-inline-item">
            (
            {event.registration_policy?.buckets
              .map((bucket) => `${bucket.name}: ${bucket.total_slots}`)
              .join(', ')}
            )
          </li>
        ) : null}
      </ul>
    </div>
  );
}

export default RunHeader;
