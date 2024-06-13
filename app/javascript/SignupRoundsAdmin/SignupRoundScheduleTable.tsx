import { useTranslation } from 'react-i18next';
import { MaximumEventSignupsValue, ParsedSignupRound } from '../SignupRoundUtils';
import { SignupRoundsAdminQueryData, SignupRoundsAdminQueryDocument } from './queries.generated';
import DateTimeInput from '../BuiltInFormControls/DateTimeInput';
import { useContext, useState } from 'react';
import AppRootContext from '../AppRootContext';
import { DateTime } from 'luxon';
import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import {
  useCreateSignupRoundMutation,
  useDeleteSignupRoundMutation,
  useUpdateSignupRoundMutation,
} from './mutations.generated';
import { useAppDateTimeFormat } from '../TimeUtils';
import { ErrorDisplay, FormGroupWithLabel, useGraphQLConfirm } from '@neinteractiveliterature/litform';
import MaximumEventSignupsInput from './MaximumEventSignupsInput';
import { buildSignupRoundInput } from './buildSignupRoundInput';
import Timespan from '../Timespan';

type CreateNewSignupRoundFormProps = {
  onCancel: () => void;
};

function CreateNewSignupRoundForm({ onCancel }: CreateNewSignupRoundFormProps) {
  const { t } = useTranslation();
  const [createSignupRound, { loading, error }] = useCreateSignupRoundMutation({
    refetchQueries: [{ query: SignupRoundsAdminQueryDocument }],
  });
  const [start, setStart] = useState<DateTime>();
  const { convention } = useContext(AppRootContext);
  const [maximumEventSignups, setMaximumEventSignups] = useState<MaximumEventSignupsValue>();
  const [clientError, setClientError] = useState<Error>();

  return (
    <>
      <h6>{t('signups.signupRounds.addNewSignupRound', 'Add new signup round')}</h6>
      <FormGroupWithLabel label={t('signups.signupRounds.start', 'Starts at')}>
        {(id) => (
          <DateTimeInput id={id} value={start?.toISO()} onChange={(value) => setStart(DateTime.fromISO(value))} />
        )}
      </FormGroupWithLabel>
      <FormGroupWithLabel label={t('signups.signupRounds.start', 'Starts at')}>
        {(id) => (
          <MaximumEventSignupsInput
            id={id}
            value={maximumEventSignups}
            onChange={(value) => setMaximumEventSignups(value)}
          />
        )}
      </FormGroupWithLabel>

      <div className="d-flex gap-2 mb-2">
        <button
          className="btn btn-primary"
          disabled={loading}
          onClick={async () => {
            if (!start) {
              setClientError(new Error(t('signups.signupRounds.errors.startTimeRequired', 'Start time is required.')));
              return;
            }

            setClientError(undefined);

            await createSignupRound({
              variables: {
                conventionId: convention?.id ?? '',
                signupRound: buildSignupRoundInput({
                  timespan: new Timespan(start),
                  maximum_event_signups: maximumEventSignups,
                }),
              },
            });

            onCancel();
          }}
        >
          {t('buttons.save')}
        </button>
        <button className="btn btn-secondary" disabled={loading} onClick={onCancel}>
          {t('buttons.cancel')}
        </button>
      </div>

      <ErrorDisplay graphQLError={error} stringError={clientError?.message} />
    </>
  );
}

export type SignupRoundScheduleTableProps = {
  parsedSignupRounds: ParsedSignupRound<SignupRoundsAdminQueryData['convention']['signup_rounds'][number]>[];
};

export default function SignupRoundScheduleTable({ parsedSignupRounds }: SignupRoundScheduleTableProps) {
  const { t } = useTranslation();
  const { timezoneName } = useContext(AppRootContext);
  const [deleteSignupRound] = useDeleteSignupRoundMutation({
    refetchQueries: [{ query: SignupRoundsAdminQueryDocument }],
  });
  const [updateSignupRound] = useUpdateSignupRoundMutation();
  const formatDateTime = useAppDateTimeFormat();
  const confirm = useGraphQLConfirm();
  const [creatingSignupRound, setCreatingSignupRound] = useState(false);

  return (
    <table className="table table-striped border">
      <tbody>
        {parsedSignupRounds
          .filter((round) => round.timespan.start != null)
          .map((round, index) => (
            <tr key={round.id}>
              <th scope="row">{t('signups.signupRounds.roundNumber', 'Round {{ number }}', { number: index + 1 })}</th>
              <td>
                <InPlaceEditor
                  value={round.timespan.start}
                  onChange={(newStart) =>
                    updateSignupRound({ variables: { id: round.id, signupRound: { start: newStart?.toISO() } } })
                  }
                  renderInput={({ inputProps, buttons }) => (
                    <div className="d-flex gap-4">
                      <div>
                        <DateTimeInput
                          value={inputProps.value?.toISO()}
                          timezoneName={timezoneName}
                          onChange={(value) => inputProps.onChange(DateTime.fromISO(value))}
                        />
                      </div>
                      <div>{buttons}</div>
                    </div>
                  )}
                >
                  {round.timespan.start && formatDateTime(round.timespan.start, 'shortDateTimeWithZone')}
                </InPlaceEditor>
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  aria-label="Delete signup round"
                  onClick={() =>
                    confirm({
                      action: () => deleteSignupRound({ variables: { id: round.id } }),
                      prompt: 'Are you sure you want to delete this signup round?',
                    })
                  }
                >
                  <i className="bi-trash" />
                </button>
              </td>
            </tr>
          ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={3}>
            {creatingSignupRound ? (
              <CreateNewSignupRoundForm onCancel={() => setCreatingSignupRound(false)} />
            ) : (
              <button className="btn btn-outline-success" onClick={() => setCreatingSignupRound(true)}>
                {t('signups.signupRounds.addNewSignupRound', 'Add new signup round')}
              </button>
            )}
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
