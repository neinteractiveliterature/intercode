import { useMemo } from 'react';
import flatMap from 'lodash/flatMap';
import max from 'lodash/max';
import mapValues from 'lodash/mapValues';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import sum from 'lodash/sum';
import capitalize from 'lodash/capitalize';
import { titleSort } from '@neinteractiveliterature/litform';

import usePageTitle from '../usePageTitle';
import { EventsByChoiceQueryDocument } from './queries.generated';
import { Route } from './+types/EventsByChoice';
import { apolloClientContext } from 'AppContexts';

type ProcessedChoiceCount = {
  confirmed?: number;
  waitlisted?: number;
  withdrawn?: number;
  total?: number;
};

function renderChoiceCounts(choiceData: ProcessedChoiceCount) {
  if (!choiceData) {
    return null;
  }

  const title = (['confirmed', 'waitlisted', 'withdrawn'] as const)
    .map((state) => `${capitalize(state)}: ${choiceData[state] || 0}`)
    .join('  ');

  return (
    <span title={title}>
      {choiceData.confirmed || 0}/{choiceData.total}
    </span>
  );
}

export async function loader({ context }: Route.LoaderArgs) {
  const { data } = await context.get(apolloClientContext).query({ query: EventsByChoiceQueryDocument });
  return data;
}

function EventsByChoice({ loaderData: data }: Route.ComponentProps): JSX.Element {
  const choiceColumns = useMemo(() => {
    const choices = flatMap(data.convention.reports.events_by_choice, (eventByChoice) =>
      eventByChoice.choice_counts.map((choiceCount) => choiceCount.choice),
    );

    return Array.from({ length: max(choices) ?? 0 }, (element, index) => index + 1);
  }, [data]);

  const filteredRows = useMemo(
    () => data.convention.reports.events_by_choice.filter((row) => row.choice_counts.length > 0),
    [data],
  );

  const sortedRows = useMemo(() => titleSort(filteredRows, (row) => row.event.title ?? ''), [filteredRows]);

  // producing an array of rows where each row looks like:
  // {
  //   event,
  //   choiceCountsProcessed: { '1': { confirmed: 1, waitlisted: 2, withdrawn: 1, total: 4 } }
  // }
  const processedRows = useMemo(
    () =>
      sortedRows.map((row) => ({
        ...row,
        choiceCountsProcessed: mapValues(
          groupBy(row.choice_counts, (choiceCount) => choiceCount.choice),
          (choiceCounts) => {
            const countsByState = mapValues(
              keyBy(choiceCounts, (choiceCount) => choiceCount.state),
              (choiceCount) => choiceCount.count,
            );

            return {
              ...countsByState,
              total: sum(Object.values(countsByState)),
            };
          },
        ),
      })),
    [sortedRows],
  );

  usePageTitle('Events by choice');

  return (
    <>
      <h1 className="mb-4">Events by choice</h1>

      <p>
        Numbers are presented as &ldquo;Confirmed / All Signups&rdquo;. All Signups include Confirmed, Waitlisted and
        Withdrawn.
      </p>

      <p className="text-muted">
        Event team members are excluded from these counts. Note that there may be some players waitlisted for this game
        because the bucket they requested was full.
      </p>

      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Event</th>
            {choiceColumns.map((choice) => (
              <th key={choice}>{choice}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {processedRows.map((row) => (
            <tr key={row.event.id}>
              <td>{row.event.title}</td>
              {choiceColumns.map((choice) => (
                <td key={choice} className="text-nowrap">
                  {renderChoiceCounts(row.choiceCountsProcessed[choice])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default EventsByChoice;
