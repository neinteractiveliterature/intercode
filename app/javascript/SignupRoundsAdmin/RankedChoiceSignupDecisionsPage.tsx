import { LoadQueryWrapper } from '@neinteractiveliterature/litform';
import { useSignupRoundsAdminQuery } from './queries.generated';
import { useContext, useMemo } from 'react';
import { useParams } from 'react-router';
import { describeSignupRound } from './describeSignupRound';
import { parseSignupRounds } from '../SignupRoundUtils';
import { useTranslation } from 'react-i18next';
import { describeTimespan } from '../TimespanUtils';
import AppRootContext from '../AppRootContext';
import { DateTime } from 'luxon';
import { useAppDateTimeFormat } from '../TimeUtils';

function RankedChoiceSignupDecisionsTable() {}

const RankedChoiceSignupDecisionsPage = LoadQueryWrapper(useSignupRoundsAdminQuery, ({ data }) => {
  const { id } = useParams();
  const { timezoneName } = useContext(AppRootContext);
  const { t } = useTranslation();
  const format = useAppDateTimeFormat();

  const rounds = useMemo(() => parseSignupRounds(data.convention.signup_rounds), [data.convention.signup_rounds]);
  const roundIndex = useMemo(() => rounds.findIndex((round) => round.id === id), [rounds, id]);
  const round = rounds[roundIndex];
  const roundDescription = useMemo(() => describeSignupRound(rounds, roundIndex, t), [rounds, roundIndex, t]);

  return (
    <>
      <h1>
        {roundDescription}:{' '}
        <small className="text-secondary">{describeTimespan(round.timespan, t, 'shortDateTime', timezoneName)}</small>
      </h1>
      {round.executed_at && (
        <p>
          {t('signupRounds.executedAt', 'Automation ran {{ executedAt }}.', {
            executedAt: format(DateTime.fromISO(round.executed_at), 'longWeekdayDateTimeWithZone'),
          })}
        </p>
      )}
    </>
  );
});

export default RankedChoiceSignupDecisionsPage;
