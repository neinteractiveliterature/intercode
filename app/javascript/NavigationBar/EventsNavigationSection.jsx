import React, { useContext } from 'react';

import AppRootContext from '../AppRootContext';
import GeneratedNavigationSection from './GeneratedNavigationSection';

function EventsNavigationSection() {
  const { conventionAcceptingProposals, currentAbility } = useContext(AppRootContext);

  return (
    <GeneratedNavigationSection
      label="Events"
      items={[
        currentAbility.can_read_schedule && {
          label: 'Con Schedule',
          url: '/events/schedule',
        },
        currentAbility.can_read_schedule && {
          label: 'Con Schedule by Room',
          url: '/events/schedule_by_room',
        },
        currentAbility.can_list_events && {
          label: 'List of Events',
          url: '/events',
        },
        conventionAcceptingProposals && {
          label: 'Propose an Event',
          url: '/pages/new-proposal',
        },
        currentAbility.can_read_schedule_with_counts && {
          label: 'Schedule With Counts',
          url: '/events/schedule_with_counts',
        },
      ]}
    />
  );
}

export default EventsNavigationSection;
