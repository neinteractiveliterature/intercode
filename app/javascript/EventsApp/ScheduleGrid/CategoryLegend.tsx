import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LoadingIndicator,
  ErrorDisplay,
  sortByLocaleString,
} from '@neinteractiveliterature/litform';

import FakeEventRun from './FakeEventRun';
import { useCommonConventionDataQuery } from '../queries.generated';
import { SignupStatus } from './StylingUtils';

function CategoryLegend() {
  const { t } = useTranslation();
  const { data, loading, error } = useCommonConventionDataQuery();
  const sortedEventCategories = useMemo(
    () =>
      error || loading || !data
        ? []
        : sortByLocaleString(data.convention?.event_categories ?? [], (c) => c.name),
    [error, loading, data],
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const defaultCategory = sortedEventCategories[0];

  return (
    <div className="d-flex flex-wrap">
      <div className="col-md-6 col-lg-4 mb-4 pe-3">
        <div className="card bg-light">
          <div className="card-header">
            {t('schedule.legends.eventCategories.title', 'Event categories')}
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

      <div className="col-md-6 col-lg-4 mb-4 pe-3">
        <div className="card bg-light">
          <div className="card-header">
            {t('schedule.legends.slotAvailability.title', 'Slot availability')}
          </div>

          <div className="card-body">
            <FakeEventRun eventCategory={defaultCategory} availability={1}>
              {t('schedule.legends.slotAvailability.fullyAvailable', '100% slots available')}
            </FakeEventRun>

            <FakeEventRun eventCategory={defaultCategory} availability={0.5}>
              {t('schedule.legends.slotAvailability.halfAvailable', '50% slots available')}
            </FakeEventRun>

            <FakeEventRun eventCategory={defaultCategory} runFull availability={0}>
              {t('schedule.legends.slotAvailability.noAvailability', 'Full')}
            </FakeEventRun>

            <FakeEventRun eventCategory={defaultCategory} unlimited>
              {t('schedule.legends.slotAvailability.unlimited', 'Unlimited slots')}
            </FakeEventRun>
          </div>
        </div>
      </div>

      <div className="col-md-6 col-lg-4 mb-4 pe-3">
        <div className="card bg-light">
          <div className="card-header">
            {t('schedule.legends.signupStatus.title', 'Signup status')}
          </div>

          <div className="card-body">
            <FakeEventRun eventCategory={defaultCategory} signupStatus={SignupStatus.Confirmed}>
              <i className="fa fa-user-circle" /> {t('signups.states.confirmed', 'Confirmed')}
            </FakeEventRun>

            <FakeEventRun eventCategory={defaultCategory} signupStatus={SignupStatus.Waitlisted}>
              <i className="fa fa-hourglass-half" /> {t('signups.states.waitlisted', 'Waitlisted')}
            </FakeEventRun>

            <FakeEventRun eventCategory={defaultCategory}>
              {t('signups.states.notSignedUp', 'Not signed up')}
            </FakeEventRun>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryLegend;
