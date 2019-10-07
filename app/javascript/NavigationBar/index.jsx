import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import sortBy from 'lodash-es/sortBy';
import { titleize } from 'inflected';

import AppRootContext from '../AppRootContext';
import NavigationBrand from './NavigationBrand';
import UserNavigationSection from './UserNavigationSection';
import TicketPurchaseNavigationItem from './TicketPurchaseNavigationItem';
import NavigationItem from './NavigationItem';
import NavigationSection from './NavigationSection';
import { sortByLocaleString } from '../ValueUtils';

function GeneratedNavigationSection({ label, items }) {
  const sortedItems = sortByLocaleString(items, (item) => (item || {}).label || '');

  if (items.some((item) => item)) {
    return (
      <NavigationSection label={label}>
        {sortedItems.map((item) => item && (
          <NavigationItem
            inSection
            key={`${item.label}-${item.url}`}
            label={item.label}
            url={item.url}
          />
        ))}
      </NavigationSection>
    );
  }

  return null;
}

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
          url: '/mailing_list',
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

function NavigationBarContent({ navbarClasses, rootItems }) {
  const {
    conventionName, rootSiteName, siteMode, ticketsAvailableForPurchase,
  } = useContext(AppRootContext);

  return (
    <nav className={classNames('navbar', navbarClasses)} role="navigation">
      <div className="container">
        <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <NavigationBrand item={{ label: conventionName || rootSiteName }} />
        <div id="navbarSupportedContent" className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            {ticketsAvailableForPurchase && siteMode !== 'single_event' && (
              <TicketPurchaseNavigationItem />
            )}
            {conventionName && siteMode !== 'single_event' && (
              <EventsNavigationSection />
            )}
            {rootItems.map((rootItem) => {
              if (rootItem.sectionItems) {
                return (
                  <NavigationSection label={rootItem.title} key={rootItem.id}>
                    {rootItem.sectionItems.map((sectionItem) => (
                      <NavigationItem
                        label={sectionItem.title}
                        url={`/pages/${sectionItem.page.slug}`}
                        key={sectionItem.id}
                        inSection
                      />
                    ))}
                  </NavigationSection>
                );
              }

              return <NavigationItem label={rootItem.title} url={`/pages/${rootItem.page.slug}`} key={rootItem.id} />;
            })}
            {conventionName
              ? <ConventionAdminNavigationSection />
              : <RootSiteAdminNavigationSection />}
          </ul>
          <ul className="navbar-nav">
            <UserNavigationSection />
          </ul>
        </div>
      </div>
    </nav>
  );
}

NavigationBarContent.propTypes = {
  navbarClasses: PropTypes.string.isRequired,
  rootItems: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

const MemoizedNavigationBarContent = React.memo(NavigationBarContent);

function NavigationBar({ navbarClasses }) {
  const { cmsNavigationItems } = useContext(AppRootContext);

  const rootNavigationItems = useMemo(
    () => {
      const rootItems = sortBy(
        cmsNavigationItems.filter((item) => item.navigation_section == null),
        (item) => item.position,
      );

      return rootItems.map((rootItem) => {
        const sectionItems = sortBy(
          cmsNavigationItems.filter(
            (item) => item.navigation_section && item.navigation_section.id === rootItem.id,
          ),
          (item) => item.position,
        );

        return { ...rootItem, sectionItems };
      });
    },
    [cmsNavigationItems],
  );

  return (
    <MemoizedNavigationBarContent
      rootItems={rootNavigationItems}
      navbarClasses={navbarClasses}
    />
  );
}

NavigationBar.propTypes = {
  navbarClasses: PropTypes.string,
};

NavigationBar.defaultProps = {
  navbarClasses: null,
};

export default NavigationBar;
