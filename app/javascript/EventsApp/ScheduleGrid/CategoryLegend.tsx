import { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import groupBy from 'lodash/groupBy';
import { sortByLocaleString } from '@neinteractiveliterature/litform/dist/types/ValueUtils';

import FakeEventRun from './FakeEventRun';
import { CommonConventionDataQueryDocument } from '../queries.generated';
import { SignupStatus } from './StylingUtils';
import AppRootContext from '../../AppRootContext';
import { SignupAutomationMode, SignupMode } from '../../graphqlTypes.generated';
import RankedChoicePriorityIndicator from '../MySignupQueue/RankedChoicePriorityIndicator';
import { useSuspenseQuery } from '@apollo/client';

export default function CategoryLegend() {
  const { data } = useSuspenseQuery(CommonConventionDataQueryDocument);
  const { t } = useTranslation();
  const { signupAutomationMode, signupMode } = useContext(AppRootContext);
  const sortedEventCategories = useMemo(() => {
    const nameSortedEventCategories = sortByLocaleString(data.convention.event_categories, (c) => c.name);
    const eventCategoriesByDefaultColor = groupBy(nameSortedEventCategories, (c) => c.default_color ?? '_undefined');
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
          <div className="card-header">{t('schedule.legends.eventCategories.title')}</div>

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
          <div className="card-header">{t('schedule.legends.slotAvailability.title')}</div>

          <div className="card-body">
            <FakeEventRun eventCategory={defaultCategory} availability={1}>
              {t('schedule.legends.slotAvailability.fullyAvailable')}
            </FakeEventRun>

            <FakeEventRun eventCategory={defaultCategory} availability={0.5}>
              {t('schedule.legends.slotAvailability.halfAvailable')}
            </FakeEventRun>

            <FakeEventRun eventCategory={defaultCategory} runFull availability={0}>
              {t('schedule.legends.slotAvailability.noAvailability')}
            </FakeEventRun>

            <FakeEventRun eventCategory={defaultCategory} unlimited>
              {t('schedule.legends.slotAvailability.unlimited')}
            </FakeEventRun>
          </div>
        </div>
      </div>
      <div className="col-md-6 col-lg-4 mb-4 pe-3">
        <div className="card bg-light">
          <div className="card-header">{t('schedule.legends.signupStatus.title')}</div>

          <div className="card-body">
            <FakeEventRun eventCategory={defaultCategory} signupStatus={SignupStatus.Confirmed}>
              <i className="bi-person-circle" /> {t('signups.states.confirmed')}
            </FakeEventRun>

            <FakeEventRun eventCategory={defaultCategory} signupStatus={SignupStatus.Waitlisted}>
              <i className="bi-hourglass-split" /> {t('signups.states.waitlisted')}
            </FakeEventRun>

            {signupMode === SignupMode.Moderated && (
              <FakeEventRun eventCategory={defaultCategory} signupStatus={SignupStatus.RequestPending}>
                <i className="bi-pause-circle-fill me-1" />
                {t('signups.states.requestPending')}
              </FakeEventRun>
            )}

            {signupAutomationMode === SignupAutomationMode.RankedChoice && (
              <FakeEventRun eventCategory={defaultCategory} signupStatus={SignupStatus.InMyQueue}>
                <RankedChoicePriorityIndicator fontSize={12} priority={1} /> {t('signups.states.inMyQueue')}
              </FakeEventRun>
            )}

            <FakeEventRun eventCategory={defaultCategory}>{t('signups.states.notSignedUp')}</FakeEventRun>
          </div>
        </div>
      </div>
    </div>
  );
}
