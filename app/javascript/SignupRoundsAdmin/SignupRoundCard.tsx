import { useContext, useState, useMemo } from 'react';
import { MaximumEventSignupsValue, ParsedSignupRound } from '../SignupRoundUtils';
import { RankedChoiceOrder, SignupAutomationMode, SignupRoundAutomationAction } from '../graphqlTypes.generated';
import { useTranslation } from 'react-i18next';
import MaximumEventSignupsInput from './MaximumEventSignupsInput';
import {
  BootstrapFormSelect,
  ErrorDisplay,
  FormGroupWithLabel,
  useGraphQLConfirm,
} from '@neinteractiveliterature/litform';
import { SignupRoundsAdminQueryData } from './queries.generated';
import AppRootContext from '../AppRootContext';
import { describeTimespan } from '../TimespanUtils';
import { useAppDateTimeFormat } from '../TimeUtils';
import { DateTime } from 'luxon';
import { Link, useFetcher } from 'react-router';
import { describeSignupRound } from './describeSignupRound';

function maximumEventSignupsAsNumber(value: MaximumEventSignupsValue): number {
  switch (value) {
    case 'not_now':
    case 'not_yet':
      return 0;
    case 'unlimited':
      return Infinity;
    default:
      return value;
  }
}

type SignupRoundCardProps = {
  rounds: ParsedSignupRound<SignupRoundsAdminQueryData['convention']['signup_rounds'][number]>[];
  roundIndex: number;
};

function SignupRoundCard({ rounds, roundIndex }: SignupRoundCardProps) {
  const { t } = useTranslation();
  const format = useAppDateTimeFormat();
  const round = rounds[roundIndex];
  const [editingRound, setEditingRound] = useState(round);
  const { signupAutomationMode, timezoneName } = useContext(AppRootContext);
  const confirm = useGraphQLConfirm();
  const fetcher = useFetcher();

  const updateLoading = fetcher.state !== 'idle';
  const updateError = fetcher.data;
  const unsavedChanges = useMemo(
    () =>
      editingRound.maximum_event_signups !== round.maximum_event_signups ||
      editingRound.automation_action != round.automation_action ||
      editingRound.ranked_choice_order !== round.ranked_choice_order,
    [editingRound, round],
  );

  const rankedChoiceSignupsAsNumbers = useMemo(() => {
    return rounds.map((round) => {
      if (round.automation_action === SignupRoundAutomationAction.ExecuteRankedChoice) {
        return maximumEventSignupsAsNumber(round.maximum_event_signups ?? 'not_yet');
      } else {
        return undefined;
      }
    });
  }, [rounds]);
  const roundDescription = useMemo(() => describeSignupRound(rounds, roundIndex, t), [rounds, roundIndex, t]);
  const increasedMaximumSignups = useMemo(() => {
    if (round.maximum_event_signups == null) {
      return false;
    }

    for (let i = roundIndex - 1; i > 0; i--) {
      const roundSignupsAsNumber = rankedChoiceSignupsAsNumbers[i];
      if (
        roundSignupsAsNumber != null &&
        roundSignupsAsNumber >= maximumEventSignupsAsNumber(round.maximum_event_signups)
      ) {
        return false;
      }
    }

    return true;
  }, [rankedChoiceSignupsAsNumbers, roundIndex, round.maximum_event_signups]);

  return (
    <fetcher.Form action={`./${round.id}`} method="PATCH" preventScrollReset>
      <section className="card mb-3">
        <div className="card-header">
          <strong>{roundDescription}:</strong> {describeTimespan(round.timespan, t, 'shortDateTime', timezoneName)}
          <input type="hidden" name="start" value={round.timespan.start?.toISO() ?? ''} />
        </div>
        <div className="card-body">
          <div className="mb-3">
            <FormGroupWithLabel label={t('signups.maximumSignups.label')}>
              {(id) => (
                <MaximumEventSignupsInput
                  id={id}
                  name="maximum_event_signups"
                  value={editingRound.maximum_event_signups}
                  onChange={(newValue) =>
                    setEditingRound((prevEditingRound) => ({
                      ...prevEditingRound,
                      maximum_event_signups: newValue,
                    }))
                  }
                />
              )}
            </FormGroupWithLabel>
          </div>
          {signupAutomationMode === SignupAutomationMode.RankedChoice && (
            <>
              <BootstrapFormSelect
                label={t('signups.signupRounds.automationActionLabel')}
                name="automation_action"
                value={editingRound.automation_action ?? undefined}
                onValueChange={(newValue) =>
                  setEditingRound((prevEditingRound) => {
                    const newAction =
                      newValue === SignupRoundAutomationAction.ExecuteRankedChoice ? newValue : undefined;
                    return { ...prevEditingRound, automation_action: newAction };
                  })
                }
              >
                <option value="">{t('signups.signupRounds.automationActions.none')}</option>
                <option value={SignupRoundAutomationAction.ExecuteRankedChoice}>
                  {t('signups.signupRounds.automationActions.executeRankedChoice')}
                </option>
              </BootstrapFormSelect>
              {increasedMaximumSignups && (
                <BootstrapFormSelect
                  label={t('signups.rankedChoiceOrderLabel')}
                  name="ranked_choice_order"
                  value={editingRound.ranked_choice_order ?? undefined}
                  onValueChange={(newValue) =>
                    setEditingRound((prevEditingRound) => {
                      const newOrder =
                        newValue === RankedChoiceOrder.Asc || newValue === RankedChoiceOrder.Desc
                          ? newValue
                          : undefined;

                      return { ...prevEditingRound, ranked_choice_order: newOrder };
                    })
                  }
                >
                  <option aria-label={t('general.placeholderOptionLabel')} />
                  <option value={RankedChoiceOrder.Asc}>{t('signups.rankedChoiceOrder.asc')}</option>
                  <option value={RankedChoiceOrder.Desc}>{t('signups.rankedChoiceOrder.desc')}</option>
                  <option value={RankedChoiceOrder.AscSerpentine}>
                    {t('signups.rankedChoiceOrder.ascSerpentine')}
                  </option>
                  <option value={RankedChoiceOrder.DescSerpentine}>
                    {t('signups.rankedChoiceOrder.descSerpentine')}
                  </option>
                </BootstrapFormSelect>
              )}
              <div className="">
                {editingRound.executed_at ? (
                  <>
                    <i className="bi-check-circle-fill" />{' '}
                    {t('signupRounds.executedAt', {
                      executedAt: format(DateTime.fromISO(editingRound.executed_at), 'longWeekdayDateTimeWithZone'),
                    })}{' '}
                    <Link className="btn btn-outline-secondary btn-sm" to={`/signup_rounds/${editingRound.id}/results`}>
                      <>
                        {t('signupRounds.viewResults')} <i className="bi-arrow-right" />
                      </>
                    </Link>
                  </>
                ) : (
                  <>
                    <i className="bi-circle" /> {t('signupRounds.notExecutedYet')}
                  </>
                )}
              </div>
            </>
          )}
        </div>
        <div className="card-footer">
          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-secondary"
              disabled={!unsavedChanges || updateLoading}
              onClick={() =>
                confirm({
                  prompt: t('prompts.confirmReset'),
                  action: () => setEditingRound(round),
                })
              }
            >
              {t('buttons.reset')}
            </button>
            <button className="btn btn-primary" disabled={!unsavedChanges || updateLoading} type="submit">
              {t('buttons.save')}
            </button>
          </div>
          <ErrorDisplay graphQLError={updateError} />
        </div>
      </section>
    </fetcher.Form>
  );
}

export default SignupRoundCard;
