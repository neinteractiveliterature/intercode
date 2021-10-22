import { gql } from '@apollo/client';
import { CommonFormFields } from '../Models/commonFormFragments';

export const EventProposalFields = gql`
  fragment EventProposalFields on EventProposal {
    id
    title
    status
    form_response_attrs_json
    current_user_form_item_viewer_role
    current_user_form_item_writer_role

    event_category {
      id
      name

      event_proposal_form {
        id
        ...CommonFormFields

        form_sections {
          id
          form_items {
            id
            admin_description
          }
        }
      }
    }

    event {
      id
    }
  }

  ${CommonFormFields}
`;

export const EventProposalFormData = gql`
  fragment EventProposalFormData on Convention {
    id
    starts_at
    ends_at
    timezone_name
    timezone_mode
    event_mailing_list_domain
  }
`;

export const EventProposalQuery = gql`
  query EventProposalQuery($eventProposalId: ID!) {
    currentAbility {
      can_delete_event_proposal(eventProposalId: $eventProposalId)
    }

    convention: conventionByRequestHost {
      id
      ...EventProposalFormData

      event_proposal(id: $eventProposalId) {
        id
        ...EventProposalFields
      }
    }
  }

  ${EventProposalFormData}
  ${EventProposalFields}
`;

export const EventProposalQueryWithOwner = gql`
  query EventProposalQueryWithOwner($eventProposalId: ID!) {
    convention: conventionByRequestHost {
      id
      ...EventProposalFormData

      event_proposal(id: $eventProposalId) {
        id
        ...EventProposalFields

        owner {
          id
          name
          email
          gravatar_enabled
          gravatar_url
        }
      }
    }

    currentAbility {
      can_update_event_proposal(eventProposalId: $eventProposalId)
      can_read_admin_notes_on_event_proposal(eventProposalId: $eventProposalId)
    }
  }

  ${EventProposalFormData}
  ${EventProposalFields}
`;

export const EventProposalAdminNotesQuery = gql`
  query EventProposalAdminNotesQuery($eventProposalId: ID!) {
    convention: conventionByRequestHost {
      id
      event_proposal(id: $eventProposalId) {
        id
        admin_notes
      }
    }
  }
`;

export const ProposeEventButtonQuery = gql`
  query ProposeEventButtonQuery {
    convention: conventionByRequestHost {
      id

      my_profile {
        id

        user {
          id

          event_proposals {
            id
            title
            status
            created_at

            event_category {
              id
              name
            }

            convention {
              id
              name
            }
          }
        }
      }

      departments {
        id
        name
        proposal_description

        event_categories {
          id
        }
      }

      event_categories {
        id
        name
        proposable
        proposal_description

        department {
          id
        }
      }
    }
  }
`;

export const EventProposalsAdminQuery = gql`
  query EventProposalsAdminQuery($page: Int, $perPage: Int, $filters: EventProposalFiltersInput, $sort: [SortInput!]) {
    convention: conventionByRequestHost {
      id
      timezone_name

      event_categories(current_ability_can_read_event_proposals: true) {
        id
        name
        default_color
      }

      event_proposals_paginated(page: $page, per_page: $perPage, filters: $filters, sort: $sort) {
        total_entries
        total_pages
        current_page
        per_page

        entries {
          id
          title
          length_seconds
          status
          submitted_at
          updated_at

          event_category {
            id
            name
            default_color
          }

          registration_policy {
            minimum_slots
            total_slots
            slots_limited
          }

          owner {
            id
            name_inverted
            gravatar_enabled
            gravatar_url
          }
        }
      }
    }
  }
`;

export const EventProposalHistoryQuery = gql`
  query EventProposalHistoryQuery($id: ID!) {
    convention: conventionByRequestHost {
      id
      starts_at
      ends_at
      timezone_name
      timezone_mode

      event_proposal(id: $id) {
        id
        title

        owner {
          id
        }

        event_category {
          id

          event_proposal_form {
            id
            ...CommonFormFields

            form_sections {
              id

              form_items {
                id
                admin_description
              }
            }
          }
        }

        form_response_changes {
          user_con_profile {
            id
            name_without_nickname
          }

          field_identifier
          previous_value
          new_value
          created_at
          updated_at
        }
      }
    }
  }

  ${CommonFormFields}
`;
