import React, { useMemo } from 'react';

import { CommonConventionDataQuery } from '../queries.gql';
import FakeEventRun from './FakeEventRun';
import useQuerySuspended from '../../useQuerySuspended';
import ErrorDisplay from '../../ErrorDisplay';
import { sortByLocaleString } from '../../ValueUtils';

function CategoryLegend() {
  const { data, error } = useQuerySuspended(CommonConventionDataQuery);
  const sortedEventCategories = useMemo(
    () => (error ? null : sortByLocaleString(data.convention.event_categories, (c) => c.name)),
    [error, data],
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const defaultCategory = sortedEventCategories[0];

  return (
    <div className="d-flex flex-wrap">
      <div className="col-md-6 col-lg-4 mb-4">
        <div className="card bg-light">
          <div className="card-header">
            Event categories
          </div>

          <div className="card-body">
            {sortedEventCategories.map((category) => (
              <FakeEventRun key={category.id} eventCategory={category}>
                {category.name}
              </FakeEventRun>
            ))}
          </div>
        </div>
      </div>

      <div className="col-md-6 col-lg-4 mb-4">
        <div className="card bg-light">
          <div className="card-header">
            Slot availability
          </div>

          <div className="card-body">
            <FakeEventRun eventCategory={defaultCategory} availability={1}>
              100% slots available
            </FakeEventRun>

            <FakeEventRun eventCategory={defaultCategory} availability={0.5}>
              50% slots available
            </FakeEventRun>

            <FakeEventRun eventCategory={defaultCategory} runFull availability={0}>
              Full
            </FakeEventRun>

            <FakeEventRun eventCategory={defaultCategory} unlimited>
              Unlimited slots
            </FakeEventRun>
          </div>
        </div>
      </div>

      <div className="col-md-6 col-lg-4 mb-4">
        <div className="card bg-light">
          <div className="card-header">
            Signup status
          </div>

          <div className="card-body">
            <FakeEventRun eventCategory={defaultCategory} signupStatus="confirmed">
              <i className="fa fa-check-square" />
              {' '}
              Confirmed
            </FakeEventRun>

            <FakeEventRun eventCategory={defaultCategory} signupStatus="waitlisted">
              <i className="fa fa-hourglass-half" />
              {' '}
              Waitlisted
            </FakeEventRun>

            <FakeEventRun eventCategory={defaultCategory}>
              Not signed up
            </FakeEventRun>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryLegend;
