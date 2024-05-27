import React, { useContext } from 'react';
import { ParsedSignupRound } from '../SignupRoundUtils';
import { RankedChoiceOrder, SignupAutomationMode } from '../graphqlTypes.generated';
import { describeMaximumEventSignupsValue } from '../describeMaximumEventSignupsValue';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import DateTimeInput from '../BuiltInFormControls/DateTimeInput';
import MaximumEventSignupsInput from './MaximumEventSignupsInput';
import { BootstrapFormSelect } from '@neinteractiveliterature/litform';
import { SignupRoundsAdminQueryData } from './queries.generated';
import AppRootContext from '../AppRootContext';

type SignupRoundCardProps = {
  rounds: ParsedSignupRound<SignupRoundsAdminQueryData['convention']['signup_rounds'][number]>[];
  roundIndex: number;
};

function SignupRoundCard({ rounds, roundIndex }: SignupRoundCardProps) {
  const { t } = useTranslation();
  const round = rounds[roundIndex];
  const [editingRound, setEditingRound] = React.useState(round);
  const { timezoneName, signupAutomationMode } = useContext(AppRootContext);

  const prevRound = roundIndex > 0 ? rounds[roundIndex - 1] : undefined;
  const increasedMaximumSignups =
    prevRound &&
    ((round.maximum_event_signups === 'unlimited' && prevRound.maximum_event_signups !== 'unlimited') ||
      (typeof round.maximum_event_signups === 'number' &&
        typeof prevRound.maximum_event_signups === 'number' &&
        round.maximum_event_signups > prevRound.maximum_event_signups) ||
      (round.maximum_event_signups !== 'not_now' &&
        round.maximum_event_signups !== 'not_yet' &&
        (prevRound.maximum_event_signups === 'not_now' || prevRound.maximum_event_signups === 'not_yet')));

  return (
    <section className="card mb-3">
      <div className="card-header">{describeMaximumEventSignupsValue(round.maximum_event_signups, t)}</div>
      <div className="card-body">
        <div className="mb-3">
          <div className="d-flex flex-row align-items-center justify-content-stretch text-nowrap">
            {editingRound.timespan.start
              ? `from ${editingRound.timespan.start.toLocaleString(DateTime.DATETIME_FULL)}`
              : 'anytime'}
            &nbsp;
            {editingRound.timespan.finish ? (
              <>
                up to&nbsp;
                <div className="d-flex">
                  <DateTimeInput
                    value={editingRound.timespan.finish?.toISO()}
                    timezoneName={timezoneName}
                    onChange={() => {}}
                  />
                </div>
              </>
            ) : (
              'onwards'
            )}
          </div>
        </div>
        <div className="mb-3">
          <MaximumEventSignupsInput
            value={editingRound.maximum_event_signups}
            onChange={(newValue) =>
              setEditingRound((prevEditingRound) => ({ ...prevEditingRound, maximum_event_signups: newValue }))
            }
          />
        </div>
        {signupAutomationMode === SignupAutomationMode.RankedChoice && increasedMaximumSignups && (
          <BootstrapFormSelect
            label={t('signups.rankedChoiceOrderLabel', 'Ranked choice order')}
            value={editingRound.ranked_choice_order ?? undefined}
            onValueChange={(newValue) =>
              setEditingRound((prevEditingRound) => {
                const newOrder =
                  newValue === RankedChoiceOrder.Asc || newValue === RankedChoiceOrder.Desc ? newValue : undefined;

                return { ...prevEditingRound, ranked_choice_order: newOrder };
              })
            }
          >
            <option aria-label="Blank placeholder option" />
            <option value={RankedChoiceOrder.Asc}>
              {t('signups.rankedChoiceOrder.asc', 'Ascending lottery number order')}
            </option>
            <option value={RankedChoiceOrder.Desc}>
              {t('signups.rankedChoiceOrder.desc', 'Descending lottery number order')}
            </option>
          </BootstrapFormSelect>
        )}
      </div>
    </section>
  );
}

export default SignupRoundCard;
