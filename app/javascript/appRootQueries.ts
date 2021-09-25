import { gql } from '@apollo/client';

export const AppRootQuery = gql`
  query AppRootQuery($path: String!) {
    cmsParentByRequestHost {
      effectiveCmsLayout(path: $path) {
        id
        content_html(path: $path)
      }

      cmsNavigationItems {
        id
        position
        title

        navigation_section {
          id
        }

        page {
          id
          slug
        }
      }
    }

    currentAbility {
      can_read_schedule
      can_read_schedule_with_counts
      can_list_events
      can_read_user_con_profiles
      can_manage_conventions
      can_update_convention
      can_update_departments
      can_manage_email_routes
      can_update_event_categories
      can_read_event_proposals
      can_manage_runs
      can_manage_forms
      can_read_any_mailing_list
      can_update_notification_templates
      can_manage_oauth_applications
      can_read_reports
      can_manage_rooms
      can_manage_signups
      can_manage_any_cms_content
      can_manage_staff_positions
      can_read_orders
      can_manage_ticket_types
      can_read_user_activity_alerts
      can_read_organizations
      can_read_users
    }

    currentUser {
      id
      name
    }

    assumedIdentityFromProfile {
      id
      name_without_nickname
    }

    convention: conventionByRequestHostIfPresent {
      id
      name
      domain
      accepting_proposals
      canceled
      language
      site_mode
      signup_mode
      starts_at
      ends_at
      ticket_mode
      timezone_name
      timezone_mode
      clickwrap_agreement
      tickets_available_for_purchase
      ticket_name

      ticket_types {
        id
        providing_products {
          id
          available
        }
      }

      my_profile {
        id
        name
        accepted_clickwrap_agreement
        name_without_nickname
        first_name
        last_name
        gravatar_enabled
        gravatar_url
        ticket {
          id
        }

        current_pending_order {
          id
          order_entries {
            id
            quantity
          }
        }
      }
    }

    rootSite {
      id
      site_name
    }
  }
`;
