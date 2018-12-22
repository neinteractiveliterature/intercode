import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import AvailabilityBar from './AvailabilityBar';
import { CommonConventionDataQuery } from '../queries.gql';
import QueryWithStateDisplay from '../../QueryWithStateDisplay';
import { getRunClassificationStyles, getRunClassName } from './StylingUtils';

function FakeEventRun({
  eventCategory, children, availability, unlimited, runFull, signupStatus,
}) {
  const config = { classifyEventsBy: 'category', showSignedUp: true };
  const signupCountData = { runFull: () => runFull };
  const event = { event_category: eventCategory || {} };

  return (
    <div
      className={classNames(
        'px-1 pb-1 schedule-grid-event small',
        getRunClassName({
          config, signupCountData, signupStatus, event,
        }),
      )}
      style={{
        zIndex: 0,
        position: 'relative',
        ...getRunClassificationStyles({
          config, signupCountData, signupStatus, event,
        }),
      }}
    >
      {children}

      <AvailabilityBar availabilityFraction={availability} unlimited={unlimited} />
    </div>
  );
}

FakeEventRun.propTypes = {
  eventCategory: PropTypes.shape({}).isRequired,
  children: PropTypes.node.isRequired,
  availability: PropTypes.number,
  unlimited: PropTypes.bool,
  runFull: PropTypes.bool,
  signupStatus: PropTypes.string,
};

FakeEventRun.defaultProps = {
  availability: 0.0,
  unlimited: false,
  runFull: false,
  signupStatus: null,
};

function CategoryLegend() {
  return (
    <QueryWithStateDisplay query={CommonConventionDataQuery}>
      {({ data: { convention: { event_categories: eventCategories } } }) => {
        const sortedEventCategories = [...eventCategories]
          .sort((a, b) => a.name.localeCompare(b.name, { sensitivity: 'base' }));
        const defaultCategory = sortedEventCategories[0];

        return (
          <div className="d-flex flex-wrap">
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="card bg-light">
                <div className="card-header">
                  Event categories
                </div>

                <div className="card-body">
                  {sortedEventCategories.map(category => (
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
        )
      }}
    </QueryWithStateDisplay>
  );
}

export default CategoryLegend;
