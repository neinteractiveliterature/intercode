import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform';
import groupBy from 'lodash/groupBy';
import { sortByLocaleString } from '@neinteractiveliterature/litform/lib/ValueUtils';

import FakeEventRun from './FakeEventRun';
import { useCommonConventionDataQuery } from '../queries.generated';
import { SignupStatus } from './StylingUtils';

export default LoadQueryWrapper(useCommonConventionDataQuery, function CategoryLegend({ data }) {
  const { t } = useTranslation();
  const sortedEventCategories = useMemo(() => {
    const nameSortedEventCategories = sortByLocaleString(
      data.convention.event_categories,
      (c) => c.name,
    );
    const eventCategoriesByDefaultColor = groupBy(
      nameSortedEventCategories,
      (c) => c.default_color ?? '_undefined',
    );
    const seenColorGroups = new Set<string>();
    const sortedCategories: typeof nameSortedEventCategories = [];

    nameSortedEventCategories.forEach((category) => {
      const groupName = category.default_color ?? '_undefined';
      if (seenColorGroups.has(groupName)) {
        return;
      }

      sortedCategories.push(...eventCategoriesByDefaultColor[groupName]);
      seenColorGroups.add(groupName);
    });
    return sortedCategories;
  }, [data.convention.event_categories]);

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
              <i className="bi-person-circle" /> {t('signups.states.confirmed', 'Confirmed')}
            </FakeEventRun>

            <FakeEventRun eventCategory={defaultCategory} signupStatus={SignupStatus.Waitlisted}>
              <i className="bi-hourglass-split" /> {t('signups.states.waitlisted', 'Waitlisted')}
            </FakeEventRun>

            <FakeEventRun eventCategory={defaultCategory}>
              {t('signups.states.notSignedUp', 'Not signed up')}
            </FakeEventRun>
          </div>
        </div>
      </div>
    </div>
  );
});
