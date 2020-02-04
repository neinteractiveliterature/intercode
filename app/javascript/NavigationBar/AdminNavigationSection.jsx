import React, { useContext } from 'react';
import { titleize } from 'inflected';

import AppRootContext from '../AppRootContext';
import GeneratedNavigationSection from './GeneratedNavigationSection';

function generateSiteContentItem(currentAbility) {
  return currentAbility.can_manage_any_cms_content && {
    label: 'Site Content',
    url: '/cms_pages',
  };
}

function ConventionAdminNavigationSection() {
  const {
    currentAbility, signupMode, siteMode, ticketMode, ticketName,
  } = useContext(AppRootContext);

  return (
    <GeneratedNavigationSection
      label="Admin"
      items={[
        currentAbility.can_read_user_con_profiles && {
          label: 'Attendees',
          url: '/user_con_profiles',
        },
        currentAbility.can_update_convention && {
          label: 'Convention Settings',
          url: '/convention/edit',
        },
        currentAbility.can_update_departments && {
          label: 'Departments',
          url: '/admin_departments',
        },
        currentAbility.can_update_event_categories && siteMode !== 'single_event' && {
          label: 'Event Categories',
          url: '/event_categories',
        },
        currentAbility.can_read_event_proposals && siteMode !== 'single_event' && {
          label: 'Event Proposals',
          url: '/admin_event_proposals?sort.status=asc&sort.submitted_at=desc',
        },
        currentAbility.can_manage_runs && {
          label: 'Event Scheduling',
          url: '/admin_events',
        },
        currentAbility.can_manage_forms && {
          label: 'Forms',
          url: '/admin_forms',
        },
        currentAbility.can_read_any_mailing_list && {
          label: 'Mailing Lists',
          url: '/mailing_lists',
        },
        currentAbility.can_update_notification_templates && {
          label: 'Notifications',
          url: '/admin_notifications',
        },
        currentAbility.can_manage_oauth_applications && {
          label: 'OAuth2 Applications',
          url: '/oauth/applications-embed',
        },
        currentAbility.can_read_reports && {
          label: 'Reports',
          url: '/reports',
        },
        currentAbility.can_manage_rooms && {
          label: 'Rooms',
          url: '/rooms',
        },
        currentAbility.can_manage_signups && signupMode === 'moderated' && {
          label: 'Signup Moderation',
          url: '/signup_moderation',
        },
        generateSiteContentItem(currentAbility),
        currentAbility.can_manage_staff_positions && {
          label: 'Staff Positions',
          url: '/staff_positions',
        },
        currentAbility.can_read_orders && {
          label: 'Store',
          url: '/admin_store',
        },
        currentAbility.can_manage_ticket_types && ticketMode !== 'disabled' && {
          label: `${titleize(ticketName)} Types`,
          url: '/ticket_types',
        },
        currentAbility.can_read_user_activity_alerts && {
          label: 'User Activity Alerts',
          url: '/user_activity_alerts',
        },
      ]}
    />
  );
}

function RootSiteAdminNavigationSection() {
  const { currentAbility } = useContext(AppRootContext);

  return (
    <GeneratedNavigationSection
      label="Admin"
      items={[
        currentAbility.can_read_organizations && {
          label: 'Organizations',
          url: '/organizations',
        },
        generateSiteContentItem(currentAbility),
        currentAbility.can_read_users && {
          label: 'Users',
          url: '/users',
        },
      ]}
    />
  );
}

export default function AdminNavigationSection() {
  const { conventionName } = useContext(AppRootContext);

  return (
    conventionName
      ? <ConventionAdminNavigationSection />
      : <RootSiteAdminNavigationSection />
  );
}
