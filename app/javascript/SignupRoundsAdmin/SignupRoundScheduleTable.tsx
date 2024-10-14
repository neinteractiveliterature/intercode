import { useTranslation } from 'react-i18next';
import { ParsedSignupRound } from '../SignupRoundUtils';
import { SignupRoundsAdminQueryData } from './queries.generated';
import DateTimeInput from '../BuiltInFormControls/DateTimeInput';
import { useContext, useState } from 'react';
import AppRootContext from '../AppRootContext';
import { DateTime } from 'luxon';
import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import { useAppDateTimeFormat } from '../TimeUtils';
import { useGraphQLConfirm } from '@neinteractiveliterature/litform';
import { useFetcher } from 'react-router';
import CreateNewSignupRoundForm from './CreateNewSignupRoundForm';

export type SignupRoundScheduleTableProps = {
  parsedSignupRounds: ParsedSignupRound<SignupRoundsAdminQueryData['convention']['signup_rounds'][number]>[];
};

export default function SignupRoundScheduleTable({ parsedSignupRounds }: SignupRoundScheduleTableProps) {
  const { t } = useTranslation();
  const { timezoneName } = useContext(AppRootContext);
  const formatDateTime = useAppDateTimeFormat();
  const confirm = useGraphQLConfirm();
  const [creatingSignupRound, setCreatingSignupRound] = useState(false);
  const fetcher = useFetcher();

  return (
    <table className="table table-striped border">
      <tbody>
        {parsedSignupRounds
          .filter((round) => round.timespan.start != null)
          .map((round, index) => (
            <tr key={round.id}>
              <th scope="row">{t('signups.signupRounds.roundNumber', { number: index + 1 })}</th>
              <td>
                <InPlaceEditor
                  value={round.timespan.start}
                  onChange={(newStart) => {
                    fetcher.submit({ start: newStart?.toISO() ?? '' }, { action: `./${round.id}`, method: 'PATCH' });
                  }}
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
                      action: () => {
                        fetcher.submit(null, { action: `./${round.id}`, method: 'DELETE' });
                      },
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
                {t('signups.signupRounds.addNewSignupRound')}
              </button>
            )}
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
