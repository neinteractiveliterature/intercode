import { Trans, useTranslation } from 'react-i18next';
import { formatLCM, getDateTimeFormat } from '../../TimeUtils';
import { useContext, useMemo } from 'react';
import { parseSignupRounds } from '../../SignupRoundUtils';
import { DateTime } from 'luxon';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform';
import { useMySignupQueueQuery } from './queries.generated';
import AppRootContext from '../../AppRootContext';
import { Link } from 'react-router-dom';
import humanize from '../../humanize';
import classNames from 'classnames';

const NextRoundInfoBox = LoadQueryWrapper(useMySignupQueueQuery, ({ data }) => {
  const { t } = useTranslation();
  const { ticketName, timezoneName } = useContext(AppRootContext);

  const ticketStatus = useMemo(() => {
    if (data.convention.my_profile?.ticket) {
      if (data.convention.my_profile.ticket.ticket_type.allows_event_signups) {
        return 'ok' as const;
      } else {
        return 'signupsNotAllowed';
      }
    } else {
      return 'noTicket';
    }
  }, [data.convention.my_profile?.ticket]);

  const nextRound = useMemo(() => {
    const parsedRounds = parseSignupRounds(data.convention.signup_rounds);
    const now = DateTime.local();
    const currentIndex = parsedRounds.findIndex((round) => round.timespan.includesTime(now));

    if (currentIndex < parsedRounds.length - 1) {
      return parsedRounds[currentIndex + 1];
    }
  }, [data.convention.signup_rounds]);

  const nextRoundActionDescription = useMemo(() => {
    if (!nextRound) {
      return undefined;
    }

    if (nextRound.maximum_event_signups === 'unlimited') {
      return t(
        'signups.mySignupQueue.nextRoundAction.unlimited',
        'At that time, players will be signed up for events automatically based on their queue selections until their schedule is full.',
      );
    }

    if (typeof nextRound.maximum_event_signups === 'number') {
      return t(
        'signups.mySignupQueue.nextRoundAction.limited',
        'At that time, players will be automatically signed up for up to {{ count }} event(s).',
        { count: nextRound.maximum_event_signups },
      );
    }
  }, [nextRound, t]);

  return (
    <>
      {nextRound && (
        <div
          className={classNames('alert mb-4', {
            'alert-info': ticketStatus === 'ok',
            'alert-warning': ticketStatus === 'noTicket' || ticketStatus === 'signupsNotAllowed',
          })}
        >
          <p>
            <Trans i18nKey="signups.mySignupQueue.nextRoundInfo">
              The next signup round starts at{' '}
              <strong>
                {{
                  nextRoundStart: nextRound.timespan.start
                    ? formatLCM(
                        nextRound.timespan.start.setZone(timezoneName),
                        getDateTimeFormat('shortWeekdayDateTimeWithZone', t),
                      )
                    : '',
                }}
              </strong>
              . {{ nextRoundActionDescription }}
            </Trans>
          </p>

          <p className="mb-0">
            {ticketStatus === 'ok' &&
              t(
                'signups.mySignupQueue.ticketStatus.ok',
                'You have a {{ ticketName }} and will be signed up for events at that time.',
                { ticketName },
              )}
            {ticketStatus === 'signupsNotAllowed' &&
              t(
                'signups.mySignupQueue.ticketStatus.signupsNotAllowed',
                'You have a {{ ticketName }} that does not allow event signups.  You will not be able to sign up for games until you have arranged for a full {{ ticketName }}.',
                { ticketName },
              )}
            {ticketStatus === 'noTicket' &&
              t(
                'signups.mySignupQueue.ticketStatus.noTicket',
                'You do not have a {{ ticketName }}.  You will not be able to sign up for games until you have purchased a {{ ticketName }}.',
                { ticketName },
              )}
          </p>

          {ticketStatus === 'noTicket' && (
            <div className="mt-3">
              <Link to="/ticket/new" className="btn btn-sm btn-warning">
                <span className="d-inline d-md-none d-lg-inline">
                  {t('navigation.ticketPurchase.ctaLong', 'Buy a {{ ticketName }}!', { ticketName })}
                </span>
                <span className="d-none d-md-inline d-lg-none">
                  {t('navigation.ticketPurchase.ctaShort', '{{ ticketName }}!', {
                    ticketName: humanize(ticketName ?? 'ticket'),
                  })}
                </span>
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
});

export default NextRoundInfoBox;
