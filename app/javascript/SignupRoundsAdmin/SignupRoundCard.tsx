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
import isEqual from 'lodash/isEqual';
import { useUpdateSignupRoundMutation } from './mutations.generated';
import { describeTimespan } from '../TimespanUtils';
import { buildSignupRoundInput } from './buildSignupRoundInput';

type SignupRoundCardProps = {
  rounds: ParsedSignupRound<SignupRoundsAdminQueryData['convention']['signup_rounds'][number]>[];
  roundIndex: number;
};

function SignupRoundCard({ rounds, roundIndex }: SignupRoundCardProps) {
  const { t } = useTranslation();
  const round = rounds[roundIndex];
  const [editingRound, setEditingRound] = useState(round);
  const { signupAutomationMode, timezoneName } = useContext(AppRootContext);
  const confirm = useGraphQLConfirm();
  const [updateSignupRound, { error: updateError, loading: updateLoading }] = useUpdateSignupRoundMutation();

  const unsavedChanges = useMemo(() => !isEqual(editingRound, round), [editingRound, round]);

  const prevRound = roundIndex > 0 ? rounds[roundIndex - 1] : undefined;
  const roundDescription = useMemo(() => {
    if (round.timespan.start == null) {
      return t('signups.signupRounds.preSignupRoundPeriod', 'Pre-signups period');
    } else {
      if (rounds[0] && rounds[0].timespan.start == null) {
        return t('signups.signupRounds.roundNumber', { number: roundIndex });
      } else {
        return t('signups.signupRounds.roundNumber', { number: roundIndex + 1 });
      }
    }
  }, [round.timespan, t, roundIndex, rounds]);
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
    <section className="card mb-3">
      <div className="card-header">
        <strong>{roundDescription}:</strong> {describeTimespan(round.timespan, t, 'shortDateTime', timezoneName)}
      </div>
      <div className="card-body">
        <div className="mb-3">
          <FormGroupWithLabel label={t('signups.maximumSignups.label', 'Maximum signups allowed')}>
            {(id) => (
              <MaximumEventSignupsInput
                id={id}
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
      <div className="card-footer">
        <div className="d-flex justify-content-end gap-2">
          <button
            className="btn btn-secondary"
            disabled={!unsavedChanges || updateLoading}
            onClick={() =>
              confirm({
                prompt: t('prompts.confirmReset', 'Are you sure? This will discard any unsaved changes.'),
                action: () => setEditingRound(round),
              })
            }
          >
            {t('buttons.reset')}
          </button>
          <button
            className="btn btn-primary"
            disabled={!unsavedChanges || updateLoading}
            onClick={() =>
              updateSignupRound({ variables: { id: round.id, signupRound: buildSignupRoundInput(editingRound) } })
            }
          >
            {t('buttons.save')}
          </button>
        </div>
        <ErrorDisplay graphQLError={updateError} />
      </div>
    </section>
  );
}

export default SignupRoundCard;
