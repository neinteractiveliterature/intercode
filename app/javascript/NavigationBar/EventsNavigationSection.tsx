import { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import AppRootContext from '../AppRootContext';
import GeneratedNavigationSection, { GeneratedNavigationItem } from './GeneratedNavigationSection';
import { notFalse, notEmpty } from '../ValueUtils';

export function useEventsNavigationItems(): GeneratedNavigationItem[] {
  const { t } = useTranslation();
  const { conventionAcceptingProposals, currentAbility } = useContext(AppRootContext);

  const items = useMemo(
    () =>
      [
        currentAbility.can_read_schedule && {
          label: t('navigation.events.eventSchedule'),
          url: '/events/schedule',
          icon: 'fa-calendar',
        },
        currentAbility.can_list_events && {
          label: t('navigation.events.eventCatalog'),
          url: '/events',
          icon: 'fa-list',
        },
        conventionAcceptingProposals && {
          label: t('navigation.events.newProposal'),
          url: '/pages/new-proposal',
          icon: 'fa-gift',
        },
      ]
        .filter(notFalse)
        .filter(notEmpty),
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
