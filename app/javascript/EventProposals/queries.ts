import { gql } from '@apollo/client';
import { CommonFormFields } from '../Models/commonFormFragments';

export const EventProposalFields = gql`
  fragment EventProposalFields on EventProposal {
    id: transitionalId
    title
    status
    form_response_attrs_json
    current_user_form_item_viewer_role
    current_user_form_item_writer_role

    event_category {
      id: transitionalId
      name

      event_proposal_form {
        id: transitionalId
        ...CommonFormFields

        form_sections {
          id: transitionalId
          form_items {
            id: transitionalId
            admin_description
          }
        }
      }
    }

    event {
      id: transitionalId
    }
  }

  ${CommonFormFields}
`;

export const EventProposalFormData = gql`
  fragment EventProposalFormData on Convention {
    id: transitionalId
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
      can_delete_event_proposal(transitionalEventProposalId: $eventProposalId)
    }

    convention: conventionByRequestHost {
      id: transitionalId
      ...EventProposalFormData

      event_proposal(transitionalId: $eventProposalId) {
        id: transitionalId
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
      id: transitionalId
      ...EventProposalFormData

      event_proposal(transitionalId: $eventProposalId) {
        id: transitionalId
        ...EventProposalFields

        owner {
          id: transitionalId
          name
          email
          gravatar_enabled
          gravatar_url
        }
      }
    }

    currentAbility {
      can_update_event_proposal(transitionalEventProposalId: $eventProposalId)
      can_read_admin_notes_on_event_proposal(transitionalEventProposalId: $eventProposalId)
    }
  }

  ${EventProposalFormData}
  ${EventProposalFields}
`;

export const EventProposalAdminNotesQuery = gql`
  query EventProposalAdminNotesQuery($eventProposalId: ID!) {
    convention: conventionByRequestHost {
      id: transitionalId
      event_proposal(transitionalId: $eventProposalId) {
        id: transitionalId
        admin_notes
      }
    }
  }
`;

export const ProposeEventButtonQuery = gql`
  query ProposeEventButtonQuery {
    convention: conventionByRequestHost {
      id: transitionalId

      my_profile {
        id: transitionalId

        user {
          id: transitionalId

          event_proposals {
            id: transitionalId
            title
            status
            created_at

            event_category {
              id: transitionalId
              name
            }

            convention {
              id: transitionalId
              name
            }
          }
        }
      }

      departments {
        id: transitionalId
        name
        proposal_description

        event_categories {
          id: transitionalId
        }
      }

      event_categories {
        id: transitionalId
        name
        proposable
        proposal_description

        department {
          id: transitionalId
        }
      }
    }
  }
`;

export const EventProposalsAdminQuery = gql`
  query EventProposalsAdminQuery($page: Int, $perPage: Int, $filters: EventProposalFiltersInput, $sort: [SortInput!]) {
    convention: conventionByRequestHost {
      id: transitionalId
      timezone_name

      event_categories(current_ability_can_read_event_proposals: true) {
        id: transitionalId
        name
        default_color
      }

      event_proposals_paginated(page: $page, per_page: $perPage, filters: $filters, sort: $sort) {
        total_entries
        total_pages
        current_page
        per_page

        entries {
          id: transitionalId
          title
          length_seconds
          status
          submitted_at
          updated_at

          event_category {
            id: transitionalId
            name
            default_color
          }

          registration_policy {
            minimum_slots
            total_slots
            slots_limited
          }

          owner {
            id: transitionalId
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
      id: transitionalId
      starts_at
      ends_at
      timezone_name
      timezone_mode

      event_proposal(transitionalId: $id) {
        id: transitionalId
        title

        owner {
          id: transitionalId
        }

        event_category {
          id: transitionalId

          event_proposal_form {
            id: transitionalId
            ...CommonFormFields

            form_sections {
              id: transitionalId

              form_items {
                id: transitionalId
                admin_description
              }
            }
          }
        }

        form_response_changes {
          user_con_profile {
            id: transitionalId
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
