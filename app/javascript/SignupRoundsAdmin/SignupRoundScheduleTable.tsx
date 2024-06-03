import { useTranslation } from 'react-i18next';
import { ParsedSignupRound } from '../SignupRoundUtils';
import { SignupRoundsAdminQueryData } from './queries.generated';
import DateTimeInput from '../BuiltInFormControls/DateTimeInput';
import { useContext } from 'react';
import AppRootContext from '../AppRootContext';
import { DateTime } from 'luxon';
import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import { useUpdateSignupRoundMutation } from './mutations.generated';
import { useAppDateTimeFormat } from '../TimeUtils';

export type SignupRoundScheduleTableProps = {
  parsedSignupRounds: ParsedSignupRound<SignupRoundsAdminQueryData['convention']['signup_rounds'][number]>[];
};

export default function SignupRoundScheduleTable({ parsedSignupRounds }: SignupRoundScheduleTableProps) {
  const { t } = useTranslation();
  const { timezoneName } = useContext(AppRootContext);
  const [updateSignupRound] = useUpdateSignupRoundMutation();
  const formatDateTime = useAppDateTimeFormat();

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
            </tr>
          ))}
      </tbody>
    </table>
  );
}
