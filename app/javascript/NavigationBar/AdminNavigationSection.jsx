import React, { useContext, useMemo } from 'react';
import { titleize } from 'inflected';
import { useTranslation } from 'react-i18next';

import AppRootContext from '../AppRootContext';
import GeneratedNavigationSection from './GeneratedNavigationSection';

function generateSiteContentItem(currentAbility, t) {
  return currentAbility.can_manage_any_cms_content && {
    label: t('navigation.admin.siteContent', 'Site Content'),
    url: '/cms_pages',
    icon: 'fa-files-o',
  };
}

function useConventionAdminNavigationItems() {
  const { t } = useTranslation();
  const {
    currentAbility, signupMode, siteMode, ticketMode, ticketName,
  } = useContext(AppRootContext);

  const items = useMemo(
    () => [
      currentAbility.can_read_user_con_profiles && {
        label: t('navigation.admin.attendees', 'Attendees'),
        url: '/user_con_profiles',
        icon: 'fa-users',
      },
      currentAbility.can_update_convention && {
        label: t('navigation.admin.conventionSettings', 'Convention Settings'),
        url: '/convention/edit',
        icon: 'fa-gear',
      },
      currentAbility.can_update_departments && {
        label: t('navigation.admin.departments', 'Departments'),
        url: '/admin_departments',
        icon: 'fa-gavel',
      },
      currentAbility.can_update_event_categories && siteMode !== 'single_event' && {
        label: t('navigation.admin.eventCategories', 'Event Categories'),
        url: '/event_categories',
        icon: 'fa-tags',
      },
      currentAbility.can_read_event_proposals && siteMode !== 'single_event' && {
        label: t('navigation.admin.eventProposals', 'Event Proposals'),
        url: '/admin_event_proposals?sort.status=asc&sort.submitted_at=desc',
        icon: 'fa-gift',
      },
      currentAbility.can_manage_runs && {
        label: t('navigation.admin.events', 'Event Scheduling'),
        url: '/admin_events',
        icon: 'fa-calendar-plus-o',
      },
      currentAbility.can_manage_forms && {
        label: t('navigation.admin.forms', 'Forms'),
        url: '/admin_forms',
        icon: 'fa-list',
      },
      currentAbility.can_read_any_mailing_list && {
        label: t('navigation.admin.mailingLists', 'Mailing Lists'),
        url: '/mailing_lists',
        icon: 'fa-envelope-o',
      },
      currentAbility.can_update_notification_templates && {
        label: t('navigation.admin.notifications', 'Notifications'),
        url: '/admin_notifications',
        icon: 'fa-circle-o',
      },
      currentAbility.can_manage_oauth_applications && {
        label: t('navigation.admin.oauth2Applications', 'OAuth2 Applications'),
        url: '/oauth/applications-embed',
        icon: 'fa-code',
      },
      currentAbility.can_read_reports && {
        label: t('navigation.admin.reports', 'Reports'),
        url: '/reports',
        icon: 'fa-table',
      },
      currentAbility.can_manage_rooms && {
        label: t('navigation.admin.rooms', 'Rooms'),
        url: '/rooms',
        icon: 'fa-map',
      },
      currentAbility.can_manage_signups && signupMode === 'moderated' && {
        label: t('navigation.admin.signupModeration', 'Signup Moderation'),
        url: '/signup_moderation',
        icon: 'fa-gavel',
      },
      generateSiteContentItem(currentAbility, t),
      currentAbility.can_manage_staff_positions && {
        label: t('navigation.admin.staffPositions', 'Staff Positions'),
        url: '/staff_positions',
        icon: 'fa-university',
      },
      currentAbility.can_read_orders && {
        label: t('navigation.admin.store', 'Store'),
        url: '/admin_store',
        icon: 'fa-shopping-cart',
      },
      currentAbility.can_manage_ticket_types && ticketMode !== 'disabled' && {
        label: t('navigation.admin.ticketTypes', '{{ ticketName }} Types', { ticketName: titleize(ticketName) }),
        url: '/ticket_types',
        icon: 'fa-ticket',
      },
      currentAbility.can_read_user_activity_alerts && {
        label: t('navigation.admin.userActivityAlerts', 'User Activity Alerts'),
        url: '/user_activity_alerts',
        icon: 'fa-exclamation-triangle',
      },
    ],
    [currentAbility, signupMode, siteMode, ticketMode, ticketName, t],
  );

  return items;
}

function useRootSiteAdminNavigationItems() {
  const { t } = useTranslation();
  const { currentAbility } = useContext(AppRootContext);

  const items = useMemo(
    () => [
      currentAbility.can_manage_conventions && {
        label: t('navigation.admin.conventions', 'Conventions'),
        url: '/conventions?sort.starts_at=desc',
        icon: 'fa-rocket',
      },
      currentAbility.can_manage_email_routes && {
        label: t('navigation.admin.emailRoutes', 'Email routes'),
        url: '/email_routes?sort.receiver_address=asc',
        icon: 'fa-envelope-o',
      },
      currentAbility.can_read_organizations && {
        label: t('navigation.admin.organizations', 'Organizations'),
        url: '/organizations',
        icon: 'fa-building',
      },
      generateSiteContentItem(currentAbility, t),
      currentAbility.can_read_users && {
        label: t('navigation.admin.users', 'Users'),
        url: '/users',
        icon: 'fa-users',
      },
    ],
    [currentAbility, t],
  );

  return items;
}

export function useAdminNavigationItems() {
  const { conventionName } = useContext(AppRootContext);
  const rootSiteItems = useRootSiteAdminNavigationItems();
  const conventionItems = useConventionAdminNavigationItems();

  return conventionName ? conventionItems : rootSiteItems;
}

export default function AdminNavigationSection() {
  const { t } = useTranslation();
  const items = useAdminNavigationItems();
  return <GeneratedNavigationSection label={t('navigation.headers.admin', 'Admin')} items={items} />;
}
