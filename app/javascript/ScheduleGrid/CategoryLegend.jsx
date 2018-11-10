import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import AvailabilityBar from './AvailabilityBar';
import { ConventionEventCategoryKeysQuery } from './queries.gql';
import EventCategory from '../EventAdmin/EventCategory';
import QueryWithStateDisplay from '../QueryWithStateDisplay';

const COMMON_EVENT_CLASSES = 'px-1 pb-1 schedule-grid-event small';

function FakeEventRun({
  className, children, availability, unlimited,
}) {
  return (
    <div className={classNames(COMMON_EVENT_CLASSES, className)} style={{ zIndex: 0, position: 'relative' }}>
      {children}

      <AvailabilityBar availabilityFraction={availability} unlimited={unlimited} />
    </div>
  );
}

FakeEventRun.propTypes = {
  className: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  availability: PropTypes.number,
  unlimited: PropTypes.bool,
};

FakeEventRun.defaultProps = {
  availability: 0.0,
  unlimited: false,
};

function CategoryLegend() {
  return (
    <div className="d-flex flex-wrap">
      <div className="col-md-6 col-lg-4 mb-4">
        <div className="card bg-light">
          <div className="card-header">
            Event categories
          </div>

          <div className="card-body">
            <QueryWithStateDisplay query={ConventionEventCategoryKeysQuery}>
              {({ data: { convention: { event_category_keys: eventCategoryKeys } } }) => {
                const eventCategories = eventCategoryKeys.map(key => EventCategory.get(key));
                eventCategories.sort((a, b) => a.name.localeCompare(b.name, { sensitivity: 'base' }));

                return eventCategories.map(category => (
                  <FakeEventRun key={category.key} className={category.getClassName()}>
                    {category.name}
                  </FakeEventRun>
                ));
              }}
            </QueryWithStateDisplay>
          </div>
        </div>
      </div>

      <div className="col-md-6 col-lg-4 mb-4">
        <div className="card bg-light">
          <div className="card-header">
            Slot availability
          </div>

          <div className="card-body">
            <FakeEventRun className="event-category-larp" availability={1}>
              100% slots available
            </FakeEventRun>

            <FakeEventRun className="event-category-larp" availability={0.5}>
              50% slots available
            </FakeEventRun>

            <FakeEventRun className="event-category-larp full" availability={0}>
              Full
            </FakeEventRun>

            <FakeEventRun className="event-category-larp" unlimited>
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
            <FakeEventRun className="event-category-larp border-light signed-up">
              <i className="fa fa-check-square" />
              {' '}
              Confirmed
            </FakeEventRun>

            <FakeEventRun className="event-category-larp border-light signed-up">
              <i className="fa fa-hourglass-half" />
              {' '}
              Waitlisted
            </FakeEventRun>

            <FakeEventRun className="event-category-larp border-light">
              Not signed up
            </FakeEventRun>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryLegend;
