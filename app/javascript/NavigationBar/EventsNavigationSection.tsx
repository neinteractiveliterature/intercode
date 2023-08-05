import { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { notFalse, notEmpty } from '@neinteractiveliterature/litform';

import AppRootContext from '../AppRootContext';
import GeneratedNavigationSection, { GeneratedNavigationItem } from './GeneratedNavigationSection';
import { SignupMode } from '../graphqlTypes.generated';

export function useEventsNavigationItems(): GeneratedNavigationItem[] {
  const { t } = useTranslation();
  const { conventionAcceptingProposals, currentAbility, signupMode } = useContext(AppRootContext);

  const items = useMemo(
    () =>
      [
        currentAbility.can_read_schedule && {
          label: t('navigation.events.eventSchedule', 'Event Schedule'),
          url: '/events/schedule',
          icon: 'bi-calendar3',
        },
        currentAbility.can_list_events && {
          label: t('navigation.events.eventCatalog', 'Event Catalog'),
          url: '/events',
          icon: 'bi-list-ul',
        },
        signupMode === SignupMode.RankedChoice && {
          label: t('navigation.events.mySignupQueue', 'My Signup Queue'),
          url: '/events/my-signup-queue',
          icon: 'bi-card-checklist',
        },
        conventionAcceptingProposals && {
          label: t('navigation.events.newProposal', 'Propose an Event'),
          url: '/pages/new-proposal',
          icon: 'bi-gift-fill',
        },
      ]
        .filter(notFalse)
        .filter(notEmpty),
    [currentAbility, conventionAcceptingProposals, signupMode, t],
  );

  return items;
}

function EventsNavigationSection(): JSX.Element {
  const { t } = useTranslation();
  const items = useEventsNavigationItems();

  return <GeneratedNavigationSection label={t('navigation.headers.events')} items={items} />;
}

export default EventsNavigationSection;
