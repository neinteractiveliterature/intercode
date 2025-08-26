import { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { notFalse, notEmpty } from '@neinteractiveliterature/litform';

import AppRootContext from '../AppRootContext';
import GeneratedNavigationSection, { GeneratedNavigationItem } from './GeneratedNavigationSection';
import { SignupAutomationMode } from '../graphqlTypes.generated';

export function useEventsNavigationItems(): GeneratedNavigationItem[] {
  const { t } = useTranslation();
  const { conventionAcceptingProposals, currentAbility, signupAutomationMode, currentUser } =
    useContext(AppRootContext);

  const items = useMemo(
    () =>
      [
        currentAbility.can_read_schedule && {
          label: t('navigation.events.eventSchedule'),
          url: '/events/schedule',
          icon: 'bi-calendar3',
        },
        currentAbility.can_list_events && {
          label: t('navigation.events.eventCatalog'),
          url: '/events',
          icon: 'bi-list-ul',
        },
        signupAutomationMode === SignupAutomationMode.RankedChoice &&
          currentUser && {
            label: t('navigation.events.mySignupQueue'),
            url: '/events/my-signup-queue',
            icon: 'bi-card-checklist',
          },
        conventionAcceptingProposals && {
          label: t('navigation.events.newProposal'),
          url: '/pages/new-proposal',
          icon: 'bi-gift-fill',
        },
      ]
        .filter(notFalse)
        .filter(notEmpty),
    [currentAbility, conventionAcceptingProposals, signupAutomationMode, t],
  );

  return items;
}

function EventsNavigationSection(): React.JSX.Element {
  const { t } = useTranslation();
  const items = useEventsNavigationItems();

  return <GeneratedNavigationSection label={t('navigation.headers.events')} items={items} />;
}

export default EventsNavigationSection;
