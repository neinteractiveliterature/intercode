import { Trans, useTranslation } from 'react-i18next';
import { Convention, Event, TicketType, UserConProfile } from '../../graphqlTypes.generated';
import humanize from '../../humanize';

export type TicketingStatusDescriptionProps = {
  userConProfile: Pick<UserConProfile, 'name_without_nickname'> & {
    ticket?: null | {
      ticket_type: Pick<TicketType, 'name'>;
      provided_by_event?: null | Pick<Event, 'title'>;
    };
  };
  convention: Pick<Convention, 'name' | 'ticket_name'>;
};

function TicketingStatusDescription({ userConProfile, convention }: TicketingStatusDescriptionProps): JSX.Element {
  const { t } = useTranslation();
  const { ticket_name: ticketName } = convention;

  if (userConProfile.ticket) {
    if (userConProfile.ticket.provided_by_event) {
      return (
        <>
          {t(
            'events.teamMemberAdmin.eventProvidedTicketDescription',
            '{{ name }} has a {{ ticketType }} {{ ticketName }} provided by {{ eventTitle }}.',
            {
              name: userConProfile.name_without_nickname,
              ticketType: humanize(userConProfile.ticket.ticket_type.name).toLowerCase(),
              ticketName,
              eventTitle: userConProfile.ticket.provided_by_event.title,
            },
          )}
        </>
      );
    }

    return (
      <>
        {t(
          'events.teamMemberAdmin.nonEventProvidedTicketDescription',
          '{{ name }} has a {{ ticketType }} {{ ticketName }}.',
          {
            name: userConProfile.name_without_nickname,
            ticketType: humanize(userConProfile.ticket.ticket_type.name).toLowerCase(),
            ticketName,
          },
        )}
      </>
    );
  }

  return (
    <span key="unticketed-warning">
      <Trans i18nKey="events.teamMemberAdmin.unticketedWarning">
        {{ name: userConProfile.name_without_nickname }}
        <span className="text-danger">
          {' '}
          has no {{ ticketName }} for {{ conventionName: convention.name }}.
        </span>{' '}
        Without a {{ ticketName }}, users cannot sign up for events at the convention.
      </Trans>
    </span>
  );
}

export default TicketingStatusDescription;
