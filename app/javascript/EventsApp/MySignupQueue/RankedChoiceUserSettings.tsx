import { LoadQueryWrapper, MultipleChoiceInput } from '@neinteractiveliterature/litform';
import { MySignupQueueQueryData, useMySignupQueueQuery } from './queries.generated';
import { HTMLProps, useContext, useMemo } from 'react';
import { describeInterval, getConventionDayTimespans } from '../../TimespanUtils';
import AppRootContext from '../../AppRootContext';
import { useTranslation } from 'react-i18next';
import { useAppDateTimeFormat } from '../../TimeUtils';
import { DateTime } from 'luxon';
import Timespan from '../../Timespan';

type MaximumSignupsLimitSelectProps = HTMLProps<HTMLSelectElement> & {
  value: number | null | undefined;
  onValueChange: React.Dispatch<number | null | undefined>;
};

function MaximumSignupsLimitSelect({ value, onValueChange, ...props }: MaximumSignupsLimitSelectProps) {
  const { t } = useTranslation();

  return (
    <select
      {...props}
      className="form-select"
      value={value ?? 'NO_LIMIT'}
      onChange={(event) => {
        if (event.target.value === 'NO_LIMIT') {
          onValueChange(null);
        } else {
          onValueChange(Number.parseInt(event.target.value));
        }
      }}
    >
      <option value="NO_LIMIT">{t('signups.mySignupQueue.noLimit', 'No limit')}</option>
      {Array.from({ length: 10 }, (n, index) => index + 1).map((n) => (
        <option key={n} value={n}>
          {n}
        </option>
      ))}
    </select>
  );
}

type ConstraintType = NonNullable<
  MySignupQueueQueryData['convention']['my_profile']
>['ranked_choice_user_constraints'][number];

const RankedChoiceUserSettings = LoadQueryWrapper(useMySignupQueueQuery, ({ data }) => {
  const { t } = useTranslation();
  const formatDateTime = useAppDateTimeFormat();
  const { conventionTimespan, timezoneName } = useContext(AppRootContext);
  const conventionDays = useMemo(
    () => (conventionTimespan?.isFinite() ? getConventionDayTimespans(conventionTimespan, timezoneName) : []),
    [conventionTimespan, timezoneName],
  );

  const { totalSignupsConstraint, conventionDaySignupConstraints, miscConstraints } = useMemo(() => {
    let totalSignupsConstraint: ConstraintType | undefined;
    const conventionDaySignupConstraints: Map<(typeof conventionDays)[number], ConstraintType | undefined> = new Map();
    const miscConstraints: ConstraintType[] = [];

    for (const conventionDay of conventionDays) {
      conventionDaySignupConstraints.set(conventionDay, undefined);
    }

    for (const constraint of data.convention.my_profile?.ranked_choice_user_constraints ?? []) {
      if (constraint.start == null && constraint.finish == null && totalSignupsConstraint == null) {
        totalSignupsConstraint = constraint;
      } else if (constraint.start && constraint.finish) {
        const start = DateTime.fromISO(constraint.start);
        const finish = DateTime.fromISO(constraint.finish);
        const conventionDay = conventionDays.find(
          (conventionDay) => start.equals(conventionDay.start) && finish.equals(conventionDay.finish),
        );

        if (conventionDay && conventionDaySignupConstraints.get(conventionDay) == null) {
          conventionDaySignupConstraints.set(conventionDay, constraint);
        } else {
          miscConstraints.push(constraint);
        }
      } else {
        miscConstraints.push(constraint);
      }
    }

    return { totalSignupsConstraint, conventionDaySignupConstraints, miscConstraints };
  }, [conventionDays, data.convention.my_profile?.ranked_choice_user_constraints]);

  return (
    <div className="card">
      <div className="card-header">Settings</div>
      <div className="card-body">
        <MultipleChoiceInput
          caption={t('signups.mySignupQueue.allowWaitlist.caption', 'What should we do if all your choices are full?')}
          choices={[
            {
              label: t('signups.mySignupQueue.allowWaitlist.yes', 'Add me to the waitlist of my top-ranked choice'),
              value: 'true',
            },
            { label: t('signups.mySignupQueue.allowWaitlist.no', "Don't sign me up for anything"), value: 'false' },
          ]}
          value={(data.convention.my_profile?.ranked_choice_allow_waitlist || false).toString()}
          onChange={() => alert('TODO')}
        />

        <section>
          <h3>Limits</h3>

          <table className="table">
            <thead>
              <tr>
                <th scope="col">Limit type</th>
                <th scope="col">My limit</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  <label htmlFor="totalSignupsLimit">
                    {t('signups.mySignupQueue.totalSignupsConstraint', 'Total events')}
                  </label>
                </td>
                <td>
                  <MaximumSignupsLimitSelect
                    id="totalSignupsLimit"
                    value={totalSignupsConstraint?.maximum_signups}
                    onValueChange={() => alert('TODO')}
                  />
                </td>
              </tr>

              {conventionDays.map((conventionDay) => (
                <tr key={conventionDay.start.toISO()}>
                  <td>
                    <label htmlFor={`conventionDaySignupsLimit-${conventionDay.start.toISO()}`}>
                      {t('signups.mySignupQueue.conventionDaySignupsConstraint', 'Events on {{ conventionDay }}', {
                        conventionDay: formatDateTime(conventionDay.start, 'longWeekday'),
                      })}
                    </label>
                  </td>
                  <td>
                    <MaximumSignupsLimitSelect
                      id={`conventionDaySignupsLimit-${conventionDay.start.toISO()}`}
                      value={conventionDaySignupConstraints.get(conventionDay)?.maximum_signups}
                      onValueChange={() => alert('TODO')}
                    />
                  </td>
                </tr>
              ))}

              {miscConstraints.map((constraint) => (
                <tr key={constraint.id}>
                  <td>
                    <label htmlFor={`miscConstraint-${constraint.id}`}>
                      {t('signups.mySignupQueue.miscSignupsConstraint', 'Events {{ interval }}', {
                        interval: describeInterval(
                          Timespan.fromStrings(constraint.start, constraint.finish),
                          (dateTime) => formatDateTime(dateTime, 'compactDateTime'),
                          timezoneName,
                        ),
                      })}
                    </label>
                  </td>
                  <td>
                    <MaximumSignupsLimitSelect
                      id={`miscConstraint-${constraint.id}`}
                      value={constraint.maximum_signups}
                      onValueChange={() => alert('TODO')}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
});

export default RankedChoiceUserSettings;
