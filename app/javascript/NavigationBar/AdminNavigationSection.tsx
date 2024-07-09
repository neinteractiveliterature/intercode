import { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { notFalse } from '@neinteractiveliterature/litform';
import capitalize from 'lodash/capitalize';

import AppRootContext from '../AppRootContext';
import GeneratedNavigationSection, { GeneratedNavigationItem } from './GeneratedNavigationSection';
import { Ability, SiteMode, TicketMode } from '../graphqlTypes.generated';

function generateSiteContentItem(currentAbility: Pick<Ability, 'can_manage_any_cms_content'>, t: TFunction) {
  return (
    currentAbility.can_manage_any_cms_content && {
      label: t('navigation.admin.siteContent', 'Site Content'),
      url: '/cms_pages',
      icon: 'bi-files',
    }
  );
}

function generateOAuthApplicationsNavigationItem(
  currentAbility: Pick<Ability, 'can_manage_oauth_applications'>,
  t: TFunction,
) {
  return (
    currentAbility.can_manage_oauth_applications && {
      label: t('navigation.admin.oauth2Applications', 'OAuth2 Applications'),
      url: '/oauth/applications-embed',
      icon: 'bi-code-slash',
    }
  );
}

function useConventionAdminNavigationItems(): GeneratedNavigationItem[] {
  const { t } = useTranslation();
  const { currentAbility, signupMode, siteMode, ticketMode, ticketName } = useContext(AppRootContext);

  const items = useMemo(
    () =>
      [
        currentAbility.can_read_user_con_profiles && {
          label: t('navigation.admin.attendees', 'Attendees'),
          url: '/user_con_profiles',
          icon: 'bi-people-fill',
        },
        currentAbility.can_update_convention && {
          label: t('navigation.admin.conventionSettings', 'Convention Settings'),
          url: '/convention/edit',
          icon: 'bi-gear-fill',
        },
        currentAbility.can_update_departments && {
          label: t('navigation.admin.departments', 'Departments'),
          url: '/admin_departments',
          icon: 'bi-megaphone-fill',
        },
        currentAbility.can_update_event_categories &&
          siteMode !== SiteMode.SingleEvent && {
            label: t('navigation.admin.eventCategories', 'Event Categories'),
            url: '/event_categories',
            icon: 'bi-tags-fill',
          },
        currentAbility.can_read_event_proposals &&
          siteMode !== SiteMode.SingleEvent && {
            label: t('navigation.admin.eventProposals', 'Event Proposals'),
            url: '/admin_event_proposals?sort.status=asc&sort.submitted_at=desc',
            icon: 'bi-gift-fill',
          },
        currentAbility.can_manage_runs && {
          label: t('navigation.admin.events', 'Event Scheduling'),
          url: '/admin_events',
          icon: 'bi-calendar-plus',
        },
        currentAbility.can_manage_forms && {
          label: t('navigation.admin.forms', 'Forms'),
          url: '/admin_forms',
          icon: 'bi-list-ul',
        },
        currentAbility.can_read_any_mailing_list && {
          label: t('navigation.admin.mailingLists', 'Mailing Lists'),
          url: '/mailing_lists',
          icon: 'bi-envelope',
        },
        currentAbility.can_update_notification_templates && {
          label: t('navigation.admin.notifications', 'Notifications'),
          url: '/admin_notifications',
          icon: 'bi-circle',
        },
        generateOAuthApplicationsNavigationItem(currentAbility, t),
        currentAbility.can_read_reports && {
          label: t('navigation.admin.reports', 'Reports'),
          url: '/reports',
          icon: 'bi-table',
        },
        currentAbility.can_manage_rooms && {
          label: t('navigation.admin.rooms', 'Rooms'),
          url: '/rooms',
          icon: 'bi-map-fill',
        },
        currentAbility.can_manage_signups &&
          signupMode === 'moderated' && {
            label: t('navigation.admin.signupModeration', 'Signup Moderation'),
            url: '/signup_moderation',
            icon: 'bi-megaphone-fill',
          },
        currentAbility.can_update_convention && {
          label: t('navigation.admin.signupRounds', 'Signup Rounds'),
          url: '/signup_rounds',
          icon: 'bi-calendar-range',
        },
        generateSiteContentItem(currentAbility, t),
        currentAbility.can_manage_staff_positions && {
          label: t('navigation.admin.staffPositions', 'Staff Positions'),
          url: '/staff_positions',
          icon: 'bi-bank2',
        },
        currentAbility.can_read_orders && {
          label: t('navigation.admin.store', 'Store'),
          url: '/admin_store',
          icon: 'bi-cart-fill',
        },
        currentAbility.can_manage_ticket_types &&
          ticketMode !== TicketMode.Disabled &&
          ticketMode !== TicketMode.TicketPerEvent && {
            label: t('navigation.admin.ticketTypes', '{{ ticketName }} Types', {
              ticketName: capitalize(ticketName ?? 'ticket'),
            }) as string,
            url: '/ticket_types',
            icon: 'bi-person-badge-fill',
          },
        currentAbility.can_read_user_activity_alerts && {
          label: t('navigation.admin.userActivityAlerts', 'User Activity Alerts'),
          url: '/user_activity_alerts',
          icon: 'bi-exclamation-triangle-fill',
        },
      ].filter(notFalse),
    [currentAbility, signupMode, siteMode, ticketMode, ticketName, t],
  );

  return items;
}

function useRootSiteAdminNavigationItems(): GeneratedNavigationItem[] {
  const { t } = useTranslation();
  const { currentAbility } = useContext(AppRootContext);

  const items = useMemo(
    () =>
      [
        currentAbility.can_manage_conventions && {
          label: t('navigation.admin.conventions', 'Conventions'),
          url: '/conventions?sort.starts_at=desc',
          icon: 'bi-flag-fill',
        },
        currentAbility.can_manage_email_routes && {
          label: t('navigation.admin.emailRoutes', 'Email routes'),
          url: '/email_routes?sort.receiver_address=asc',
          icon: 'bi-envelope',
        },
        generateOAuthApplicationsNavigationItem(currentAbility, t),
        currentAbility.can_read_organizations && {
          label: t('navigation.admin.organizations', 'Organizations'),
          url: '/organizations',
          icon: 'bi-building',
        },
        generateSiteContentItem(currentAbility, t),
        currentAbility.can_read_users && {
          label: t('navigation.admin.users', 'Users'),
          url: '/users',
          icon: 'bi-people-fill',
        },
      ].filter(notFalse),
    [currentAbility, t],
  );

  return items;
}

export function useAdminNavigationItems(): GeneratedNavigationItem[] {
  const { conventionName } = useContext(AppRootContext);
  const rootSiteItems = useRootSiteAdminNavigationItems();
  const conventionItems = useConventionAdminNavigationItems();

  return conventionName ? conventionItems : rootSiteItems;
}

export default function AdminNavigationSection(): JSX.Element {
  const { t } = useTranslation();
  const items = useAdminNavigationItems();
  return <GeneratedNavigationSection label={t('navigation.headers.admin', 'Admin')} items={items} />;
}
