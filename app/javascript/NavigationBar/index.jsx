import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useQuery } from 'react-apollo-hooks';
import sortBy from 'lodash-es/sortBy';

import { NavigationBarQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import renderNavigationItems from './renderNavigationItems';
import AppRootContext from '../AppRootContext';
import NavigationBrand from './NavigationBrand';
import UserNavigationSection from './UserNavigationSection';
import TicketPurchaseNavigationItem from './TicketPurchaseNavigationItem';
import NavigationItem from './NavigationItem';
import NavigationSection from './NavigationSection';
import { sortByLocaleString } from '../ValueUtils';

function EventsNavigationSection() {
  const { conventionAcceptingProposals, currentAbility } = useContext(AppRootContext);

  return (
    <NavigationSection label="Events">
      {currentAbility.can_read_schedule && (
        <NavigationItem
          inSection
          item={{
            label: 'Con Schedule',
            url: '/events/schedule',
          }}
        />
      )}
      {currentAbility.can_read_schedule && (
        <NavigationItem
          inSection
          item={{
            label: 'Con Schedule by Room',
            url: '/events/schedule_by_room',
          }}
        />
      )}
      {currentAbility.can_list_events && (
        <NavigationItem
          inSection
          item={{
            label: 'List of Events',
            url: '/events',
          }}
        />
      )}
      {conventionAcceptingProposals && (
        <NavigationItem
          inSection
          item={{
            label: 'Propose an Event',
            url: '/pages/new-proposal',
          }}
        />
      )}
      {currentAbility.can_read_schedule_with_counts && (
        <NavigationItem
          inSection
          item={{
            label: 'Schedule With Counts',
            url: '/events/schedule_with_counts',
          }}
        />
      )}
    </NavigationSection>
  );
}

function GeneratedNavigationSection({ items }) {
  const sortedItems = sortByLocaleString(items, (item) => (item || {}).label || '');

  if (items.some((item) => item)) {
    return (
      <NavigationSection label="Admin">
        {sortedItems.map((item) => item && (
          <NavigationItem
            inSection
            key={`${item.label}-${item.url}`}
            item={{
              label: item.label,
              url: item.url,
            }}
          />
        ))}
      </NavigationSection>
    );
  }

  return null;
}

function ConventionAdminNavigationSection() {
  const { currentAbility, siteMode } = useContext(AppRootContext);

  return (
    <GeneratedNavigationSection
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
      ]}
    />
  );
}

function RootSiteAdminNavigationSection() {
  const items = [

  ];

  if (items.some((item) => item)) {
    return <NavigationSection label="Admin">{items}</NavigationSection>;
  }

  return null;
}

function NavigationBarContent({ navbarClasses, items }) {
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
            {renderNavigationItems(items, false)}
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
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

const MemoizedNavigationBarContent = React.memo(NavigationBarContent);

function NavigationBar({ navbarClasses }) {
  const { cmsNavigationItems } = useContext(AppRootContext);
  const { data, loading, error } = useQuery(NavigationBarQuery);

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

  if (loading) {
    return (
      <nav className={classNames('navbar', navbarClasses)} role="navigation">
        <div className="container">
          <div className="navbar-brand">&nbsp;</div>
        </div>
      </nav>
    );
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (!data.navigationBar) {
    return null;
  }

  return (
    <MemoizedNavigationBarContent
      rootItems={rootNavigationItems}
      items={data.navigationBar.items}
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
