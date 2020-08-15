import { gql } from '@apollo/client';

export const ContactEmailFields = gql`
  fragment ContactEmailFields on ContactEmail {
    email
    formatted_address
    name
    metadata_json
  }
`;

export const MailingListsResultFields = gql`
  fragment MailingListsResultFields on MailingListsResult {
    emails {
      ...ContactEmailFields
    }
    metadata_fields
  }

  ${ContactEmailFields}
`;

export const MailingListsMenuQuery = gql`
  query MailingListsMenuQuery {
    convention {
      id
      ticket_mode
      ticket_name
    }
  }
`;

export const TicketedAttendeesQuery = gql`
  query TicketedAttendeesQuery {
    convention {
      id
      name
      ticket_name

      mailing_lists {
        ticketed_attendees {
          ...MailingListsResultFields
        }
      }
    }
  }

  ${MailingListsResultFields}
`;

export const EventProposersQuery = gql`
  query EventProposersQuery {
    convention {
      id
      name

      mailing_lists {
        event_proposers {
          ...MailingListsResultFields
        }
      }
    }
  }

  ${MailingListsResultFields}
`;

export const TeamMembersMailingListQuery = gql`
  query TeamMembersMailingListQuery {
    convention {
      id
      name

      mailing_lists {
        team_members {
          ...MailingListsResultFields
        }
      }
    }
  }

  ${MailingListsResultFields}
`;

export const UsersWithPendingBioQuery = gql`
  query UsersWithPendingBioQuery {
    convention {
      id
      name

      mailing_lists {
        users_with_pending_bio {
          ...MailingListsResultFields
        }
      }
    }
  }

  ${MailingListsResultFields}
`;

export const WaitlistMailingListsQuery = gql`
  query WaitlistMailingListsQuery {
    convention {
      id
      name
      timezone_name

      mailing_lists {
        waitlists {
          emails {
            ...ContactEmailFields
          }
          metadata_fields
          run {
            id
            starts_at
            title_suffix
            event {
              id
              title
            }
          }
        }
      }
    }
  }

  ${ContactEmailFields}
`;

export const WhosFreeFormConventionQuery = gql`
  query WhosFreeFormConventionQuery {
    convention {
      id
      name
      starts_at
      ends_at
      timezone_name
    }
  }
`;

export const WhosFreeQuery = gql`
  query WhosFreeQuery($start: Date!, $finish: Date!) {
    convention {
      id

      mailing_lists {
        whos_free(start: $start, finish: $finish) {
          ...MailingListsResultFields
        }
      }
    }
  }

  ${MailingListsResultFields}
`;
