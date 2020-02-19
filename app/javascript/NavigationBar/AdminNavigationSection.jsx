import React, { useContext, useMemo } from 'react';
import { titleize } from 'inflected';

import AppRootContext from '../AppRootContext';
import GeneratedNavigationSection from './GeneratedNavigationSection';

function generateSiteContentItem(currentAbility) {
  return currentAbility.can_manage_any_cms_content && {
    label: 'Site Content',
    url: '/cms_pages',
    icon: 'fa-files-o',
  };
}

function useConventionAdminNavigationItems() {
  const {
    currentAbility, signupMode, siteMode, ticketMode, ticketName,
  } = useContext(AppRootContext);

  const items = useMemo(
    () => [
      currentAbility.can_read_user_con_profiles && {
        label: 'Attendees',
        url: '/user_con_profiles',
        icon: 'fa-users',
      },
      currentAbility.can_update_convention && {
        label: 'Convention Settings',
        url: '/convention/edit',
        icon: 'fa-gear',
      },
      currentAbility.can_update_departments && {
        label: 'Departments',
        url: '/admin_departments',
        icon: 'fa-gavel',
      },
      currentAbility.can_update_event_categories && siteMode !== 'single_event' && {
        label: 'Event Categories',
        url: '/event_categories',
        icon: 'fa-tags',
      },
      currentAbility.can_read_event_proposals && siteMode !== 'single_event' && {
        label: 'Event Proposals',
        url: '/admin_event_proposals?sort.status=asc&sort.submitted_at=desc',
        icon: 'fa-gift',
      },
      currentAbility.can_manage_runs && {
        label: 'Event Scheduling',
        url: '/admin_events',
        icon: 'fa-calendar-plus-o',
      },
      currentAbility.can_manage_forms && {
        label: 'Forms',
        url: '/admin_forms',
        icon: 'fa-list',
      },
      currentAbility.can_read_any_mailing_list && {
        label: 'Mailing Lists',
        url: '/mailing_lists',
        icon: 'fa-envelope-o',
      },
      currentAbility.can_update_notification_templates && {
        label: 'Notifications',
        url: '/admin_notifications',
        icon: 'fa-circle-o',
      },
      currentAbility.can_manage_oauth_applications && {
        label: 'OAuth2 Applications',
        url: '/oauth/applications-embed',
        icon: 'fa-code',
      },
      currentAbility.can_read_reports && {
        label: 'Reports',
        url: '/reports',
        icon: 'fa-table',
      },
      currentAbility.can_manage_rooms && {
        label: 'Rooms',
        url: '/rooms',
        icon: 'fa-map',
      },
      currentAbility.can_manage_signups && signupMode === 'moderated' && {
        label: 'Signup Moderation',
        url: '/signup_moderation',
        icon: 'fa-gavel',
      },
      generateSiteContentItem(currentAbility),
      currentAbility.can_manage_staff_positions && {
        label: 'Staff Positions',
        url: '/staff_positions',
        icon: 'fa-university',
      },
      currentAbility.can_read_orders && {
        label: 'Store',
        url: '/admin_store',
        icon: 'fa-shopping-cart',
      },
      currentAbility.can_manage_ticket_types && ticketMode !== 'disabled' && {
        label: `${titleize(ticketName)} Types`,
        url: '/ticket_types',
        icon: 'fa-ticket',
      },
      currentAbility.can_read_user_activity_alerts && {
        label: 'User Activity Alerts',
        url: '/user_activity_alerts',
        icon: 'fa-exclamation-triangle',
      },
    ],
    [currentAbility, signupMode, siteMode, ticketMode, ticketName],
  );

  return items;
}

function useRootSiteAdminNavigationItems() {
  const { currentAbility } = useContext(AppRootContext);

  const items = useMemo(
    () => [
      currentAbility.can_read_organizations && {
        label: 'Organizations',
        url: '/organizations',
        icon: 'fa-building',
      },
      generateSiteContentItem(currentAbility),
      currentAbility.can_read_users && {
        label: 'Users',
        url: '/users',
        icon: 'fa-users',
      },
    ],
    [currentAbility],
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
  const items = useAdminNavigationItems();
  return <GeneratedNavigationSection label="Admin" items={items} />;
}
