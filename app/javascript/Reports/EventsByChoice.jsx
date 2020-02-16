import React, { useMemo } from 'react';
import flatMap from 'lodash-es/flatMap';
import max from 'lodash-es/max';
import mapValues from 'lodash-es/mapValues';
import groupBy from 'lodash-es/groupBy';
import keyBy from 'lodash-es/keyBy';
import sum from 'lodash-es/sum';
import { capitalize } from 'inflected';
import { useQuery } from '@apollo/react-hooks';

import ErrorDisplay from '../ErrorDisplay';
import { EventsByChoiceQuery } from './queries.gql';
import { titleSort } from '../ValueUtils';
import usePageTitle from '../usePageTitle';
import PageLoadingIndicator from '../PageLoadingIndicator';

function renderChoiceCounts(choiceData) {
  if (!choiceData) {
    return null;
  }

  const title = ['confirmed', 'waitlisted', 'withdrawn']
    .map((state) => `${capitalize(state)}: ${choiceData[state] || 0}`)
    .join('  ');

  return (
    <span title={title}>
      {choiceData.confirmed || 0}
      /
      {choiceData.total}
    </span>
  );
}

function EventsByChoice() {
  const { data, loading, error } = useQuery(EventsByChoiceQuery);

  const choiceColumns = useMemo(
    () => {
      if (loading || error) {
        return 0;
      }

      const choices = flatMap(data.convention.reports.events_by_choice, (eventByChoice) => (
        eventByChoice.choice_counts.map((choiceCount) => choiceCount.choice)
      ));

      return Array.from({ length: max(choices) }, (element, index) => index + 1);
    },
    [data, loading, error],
  );

  const filteredRows = useMemo(
    () => (loading || error
      ? []
      : data.convention.reports.events_by_choice.filter((row) => row.choice_counts.length > 0)
    ),
    [data, loading, error],
  );

  const sortedRows = useMemo(
    () => titleSort(filteredRows, (row) => row.event.title),
    [filteredRows],
  );

  // producing an array of rows where each row looks like:
  // {
  //   event,
  //   choiceCountsProcessed: { '1': { confirmed: 1, waitlisted: 2, withdrawn: 1, total: 4 } }
  // }
  const processedRows = useMemo(
    () => sortedRows.map((row) => ({
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

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <h1 className="mb-4">Events by choice</h1>

      <p>
        Numbers are presented as &ldquo;Confirmed / All Signups&rdquo;. All Signups include
        {' '}
        Confirmed, Waitlisted and Withdrawn.
      </p>

      <p className="text-muted">
        Event team members are excluded from these counts.
        {' '}
        Note that there may be some players waitlisted for this game because the bucket they
        {' '}
        requested was full.
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
