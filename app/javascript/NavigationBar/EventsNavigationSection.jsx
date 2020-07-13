import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import AppRootContext from '../AppRootContext';
import GeneratedNavigationSection from './GeneratedNavigationSection';

export function useEventsNavigationItems() {
  const { t } = useTranslation();
  const { conventionAcceptingProposals, currentAbility } = useContext(AppRootContext);

  const items = useMemo(
    () => [
      currentAbility.can_read_schedule && {
        label: t('navigation.events.schedule'),
        url: '/events/schedule',
        icon: 'fa-calendar',
      },
      currentAbility.can_read_schedule && {
        label: t('navigation.events.scheduleByRoom'),
        url: '/events/schedule_by_room',
        icon: 'fa-calendar-o',
      },
      currentAbility.can_list_events && {
        label: t('navigation.events.eventsList'),
        url: '/events',
        icon: 'fa-list',
      },
      conventionAcceptingProposals && {
        label: t('navigation.events.newProposal'),
        url: '/pages/new-proposal',
        icon: 'fa-gift',
      },
      currentAbility.can_read_schedule_with_counts && {
        label: t('navigation.events.scheduleWithCounts'),
        url: '/events/schedule_with_counts',
        icon: 'fa-calendar-check-o',
      },
    ],
    [currentAbility, conventionAcceptingProposals, t],
  );

  return items;
}

function EventsNavigationSection() {
  const { t } = useTranslation();
  const items = useEventsNavigationItems();

  return <GeneratedNavigationSection label={t('navigation.headers.events')} items={items} />;
}

export default EventsNavigationSection;
