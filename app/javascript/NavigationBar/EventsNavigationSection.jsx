import React, { useContext, useMemo } from 'react';

import AppRootContext from '../AppRootContext';
import GeneratedNavigationSection from './GeneratedNavigationSection';

export function useEventsNavigationItems() {
  const { conventionAcceptingProposals, currentAbility } = useContext(AppRootContext);

  const items = useMemo(
    () => [
      currentAbility.can_read_schedule && {
        label: 'Con Schedule',
        url: '/events/schedule',
        icon: 'fa-calendar',
      },
      currentAbility.can_read_schedule && {
        label: 'Con Schedule by Room',
        url: '/events/schedule_by_room',
        icon: 'fa-calendar-o',
      },
      currentAbility.can_list_events && {
        label: 'List of Events',
        url: '/events',
        icon: 'fa-list',
      },
      conventionAcceptingProposals && {
        label: 'Propose an Event',
        url: '/pages/new-proposal',
        icon: 'fa-gift',
      },
      currentAbility.can_read_schedule_with_counts && {
        label: 'Schedule With Counts',
        url: '/events/schedule_with_counts',
        icon: 'fa-calendar-check-o',
      },
    ],
    [currentAbility, conventionAcceptingProposals],
  );

  return items;
}

function EventsNavigationSection() {
  const items = useEventsNavigationItems();

  return <GeneratedNavigationSection label="Events" items={items} />;
}

export default EventsNavigationSection;
