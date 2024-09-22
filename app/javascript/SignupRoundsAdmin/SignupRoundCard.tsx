import { useContext, useState, useMemo } from 'react';
import { ParsedSignupRound } from '../SignupRoundUtils';
import { RankedChoiceOrder, SignupAutomationMode } from '../graphqlTypes.generated';
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
import { Link, useFetcher } from 'react-router-dom';
import { describeSignupRound } from './describeSignupRound';

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
      editingRound.ranked_choice_order !== round.ranked_choice_order,
    [editingRound, round],
  );

  const prevRound = roundIndex > 0 ? rounds[roundIndex - 1] : undefined;
  const roundDescription = useMemo(() => describeSignupRound(rounds, roundIndex, t), [rounds, roundIndex, t]);
  const increasedMaximumSignups = useMemo(() => {
    return (
      prevRound &&
      ((round.maximum_event_signups === 'unlimited' && prevRound.maximum_event_signups !== 'unlimited') ||
        (typeof round.maximum_event_signups === 'number' &&
          typeof prevRound.maximum_event_signups === 'number' &&
          round.maximum_event_signups > prevRound.maximum_event_signups) ||
        (round.maximum_event_signups !== 'not_now' &&
          round.maximum_event_signups !== 'not_yet' &&
          (prevRound.maximum_event_signups === 'not_now' || prevRound.maximum_event_signups === 'not_yet')))
    );
  }, [prevRound, round.maximum_event_signups]);

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
