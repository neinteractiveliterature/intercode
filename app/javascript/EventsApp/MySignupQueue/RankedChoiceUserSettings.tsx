import { ErrorDisplay, HelpPopover, MultipleChoiceInput } from '@neinteractiveliterature/litform';
import { MySignupQueueQueryData, MySignupQueueQueryDocument } from './queries.generated';
import { HTMLProps, useContext, useId, useMemo } from 'react';
import { describeTimespan, getConventionDayTimespans } from '../../TimespanUtils';
import AppRootContext from '../../AppRootContext';
import { useTranslation } from 'react-i18next';
import { useAppDateTimeFormat } from '../../TimeUtils';
import { DateTime } from 'luxon';
import Timespan from '../../Timespan';
import { RankedChoiceUserConstraint, SignupState } from '../../graphqlTypes.generated';
import BucketAvailabilityDisplay from '../EventPage/BucketAvailabilityDisplay';
import { useMutation } from '@apollo/client';
import { UpdateUserConProfileDocument } from '../../UserConProfiles/mutations.generated';
import {
  CreateMyRankedChoiceUserConstraintDocument,
  DeleteRankedChoiceUserConstraintDocument,
  UpdateRankedChoiceUserConstraintDocument,
} from './mutations.generated';
import { useRevalidator } from 'react-router';

type ConstraintAvailabilityDisplayProps = {
  constraint: Pick<RankedChoiceUserConstraint, 'start' | 'finish' | 'maximum_signups'>;
  mySignups: NonNullable<MySignupQueueQueryData['convention']['my_profile']>['signups'];
};

function ConstraintAvailabilityDisplay({ constraint, mySignups }: ConstraintAvailabilityDisplayProps) {
  const timespan = useMemo(
    () => Timespan.fromStrings(constraint.start, constraint.finish),
    [constraint.start, constraint.finish],
  );
  const signupsWithinTimespan = useMemo(
    () =>
      mySignups.filter((signup) => {
        if (signup.state !== SignupState.Confirmed || !signup.counted) {
          return false;
        }

        const runTimespan = Timespan.fromStrings(signup.run.starts_at, signup.run.ends_at);
        return timespan.overlapsTimespan(runTimespan);
      }),
    [timespan, mySignups],
  );

  return (
    <BucketAvailabilityDisplay
      className="justify-content-end"
      remainingCapacity={constraint.maximum_signups - signupsWithinTimespan.length}
      signupCount={signupsWithinTimespan.length}
    />
  );
}

type MaximumSignupsLimitSelectProps = HTMLProps<HTMLSelectElement> & {
  value: number | null | undefined;
  onValueChange: React.Dispatch<number | null | undefined>;
};

function MaximumSignupsLimitSelect({ value, onValueChange, ...props }: MaximumSignupsLimitSelectProps) {
  const { t } = useTranslation();

  return (
    <select
      {...props}
      className="form-select d-inline-block w-auto"
      value={value ?? 'NO_LIMIT'}
      onChange={(event) => {
        if (event.target.value === 'NO_LIMIT') {
          onValueChange(null);
        } else {
          onValueChange(Number.parseInt(event.target.value));
        }
      }}
    >
      <option value="NO_LIMIT">{t('signups.mySignupQueue.noLimit')}</option>
      {Array.from({ length: 10 }, (n, index) => index + 1).map((n) => (
        <option key={n} value={n}>
          {t('signups.mySignupQueue.maximumSignupsLimit', { number: n })}
        </option>
      ))}
      <option value="0">{t('signups.mySignupQueue.zeroLimit')}</option>
    </select>
  );
}

type SignupConstraintRowProps = {
  constraint?: Pick<RankedChoiceUserConstraint, 'id' | 'start' | 'finish' | 'maximum_signups'>;
  mySignups: NonNullable<MySignupQueueQueryData['convention']['my_profile']>['signups'];
  label: React.ReactNode;
  help?: React.ReactNode;
  onChange: (newValue: number | null | undefined) => void;
  loading: boolean;
};

function SignupConstraintRow({ constraint, mySignups, label, help, onChange, loading }: SignupConstraintRowProps) {
  const rowId = useId();

  return (
    <>
      <tr aria-labelledby={`${rowId}-label`}>
        <td className="text-nowrap w-25">
          <label id={`${rowId}-label`} htmlFor={`${rowId}-select`}>
            {label}
          </label>

          {help && <HelpPopover>{help}</HelpPopover>}
        </td>
        <td>
          <MaximumSignupsLimitSelect
            id={`${rowId}-select`}
            value={constraint?.maximum_signups}
            onValueChange={(newValue) => onChange(newValue)}
            disabled={loading}
          />
        </td>
        <td className="text-nowrap">
          {constraint && <ConstraintAvailabilityDisplay constraint={constraint} mySignups={mySignups} />}
        </td>
      </tr>
    </>
  );
}

type ConstraintType = NonNullable<
  MySignupQueueQueryData['convention']['my_profile']
>['ranked_choice_user_constraints'][number];

function RankedChoiceUserSettings({ data }: { data: MySignupQueueQueryData }) {
  const { t } = useTranslation();
  const formatDateTime = useAppDateTimeFormat();
  const { conventionTimespan, timezoneName, myProfile } = useContext(AppRootContext);
  const conventionDays = useMemo(
    () => (conventionTimespan?.isFinite() ? getConventionDayTimespans(conventionTimespan, timezoneName) : []),
    [conventionTimespan, timezoneName],
  );
  const revalidator = useRevalidator();
  const [createMyRankedChoiceUserConstraint, { error: createError, loading: createLoading }] = useMutation(
    CreateMyRankedChoiceUserConstraintDocument,
    { onCompleted: revalidator.revalidate },
  );
  const [updateRankedChoiceUserConstraint, { error: updateError, loading: updateLoading }] = useMutation(
    UpdateRankedChoiceUserConstraintDocument,
  );
  const [deleteRankedChoiceUserConstraint, { error: deleteError, loading: deleteLoading }] = useMutation(
    DeleteRankedChoiceUserConstraintDocument,
  );
  const [updateUserConProfile, { error: profileUpdateError, loading: profileUpdateLoading }] =
    useMutation(UpdateUserConProfileDocument);

  const loading = createLoading || updateLoading || deleteLoading;

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
          // timezone-insensitive comparison
          (conventionDay) => +start === +conventionDay.start && +finish === +conventionDay.finish,
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

  const constraintChanged = async (
    constraint: Pick<RankedChoiceUserConstraint, 'id'> | undefined,
    start: DateTime | undefined,
    finish: DateTime | undefined,
    maximumSignups: number | null | undefined,
  ) => {
    if (constraint == null) {
      await createMyRankedChoiceUserConstraint({
        variables: {
          rankedChoiceUserConstraint: {
            start: start?.toISO(),
            finish: finish?.toISO(),
            maximumSignups,
          },
        },
        refetchQueries: [{ query: MySignupQueueQueryDocument }],
        awaitRefetchQueries: true,
      });
    } else if (maximumSignups == null) {
      await deleteRankedChoiceUserConstraint({
        variables: { id: constraint.id },
        refetchQueries: [{ query: MySignupQueueQueryDocument }],
        awaitRefetchQueries: true,
      });
    } else {
      await updateRankedChoiceUserConstraint({
        variables: {
          id: constraint.id,
          rankedChoiceUserConstraint: { maximumSignups },
        },
        refetchQueries: [{ query: MySignupQueueQueryDocument }],
        awaitRefetchQueries: true,
      });
    }

    revalidator.revalidate();
  };

  return (
    <div className="card">
      <div className="card-header">{t('signups.mySignupQueue.settingsSection.label')}</div>
      <div className="card-body">
        <MultipleChoiceInput
          caption={t('signups.mySignupQueue.allowWaitlist.caption')}
          choices={[
            {
              label: t('signups.mySignupQueue.allowWaitlist.yes'),
              value: 'true',
            },
            { label: t('signups.mySignupQueue.allowWaitlist.no'), value: 'false' },
          ]}
          value={(data.convention.my_profile?.ranked_choice_allow_waitlist || false).toString()}
          onChange={(newValue) =>
            updateUserConProfile({
              variables: {
                input: {
                  user_con_profile: {
                    ranked_choice_allow_waitlist: newValue === 'true',
                  },
                  id: myProfile?.id,
                },
              },
              refetchQueries: [{ query: MySignupQueueQueryDocument }],
            })
          }
          disabled={profileUpdateLoading}
        />

        <ErrorDisplay graphQLError={profileUpdateError} />

        <section>
          <h3>{t('signups.mySignupQueue.constraintsTable.label')}</h3>

          <table className="table table-striped">
            <tbody>
              <SignupConstraintRow
                constraint={totalSignupsConstraint}
                label={t('signups.mySignupQueue.totalSignupsConstraint.label')}
                help={t('signups.mySignupQueue.totalSignupsConstraint.help')}
                onChange={(newValue) => constraintChanged(totalSignupsConstraint, undefined, undefined, newValue)}
                loading={loading}
                mySignups={data.convention.my_profile?.signups ?? []}
              />

              {conventionDays.map((conventionDay) => (
                <SignupConstraintRow
                  key={conventionDay.start.toISO()}
                  constraint={conventionDaySignupConstraints.get(conventionDay)}
                  label={t('signups.mySignupQueue.conventionDaySignupsConstraint.label', {
                    conventionDay: formatDateTime(conventionDay.start, 'longWeekday'),
                  })}
                  help={t('signups.mySignupQueue.conventionDaySignupsConstraint.help', {
                    conventionDay: formatDateTime(conventionDay.start, 'longWeekday'),
                  })}
                  onChange={(newValue) =>
                    constraintChanged(
                      conventionDaySignupConstraints.get(conventionDay),
                      conventionDay.start,
                      conventionDay.finish,
                      newValue,
                    )
                  }
                  loading={loading}
                  mySignups={data.convention.my_profile?.signups ?? []}
                />
              ))}

              {miscConstraints.map((constraint) => (
                <SignupConstraintRow
                  key={constraint.id}
                  constraint={constraint}
                  label={t('signups.mySignupQueue.miscSignupsConstraint', {
                    interval: describeTimespan(
                      Timespan.fromStrings(constraint.start, constraint.finish),
                      t,
                      'compactDateTime',
                      timezoneName,
                    ),
                  })}
                  onChange={(newValue) =>
                    constraintChanged(
                      constraint,
                      constraint.start ? DateTime.fromISO(constraint.start) : undefined,
                      constraint.finish ? DateTime.fromISO(constraint.finish) : undefined,
                      newValue,
                    )
                  }
                  loading={loading}
                  mySignups={data.convention.my_profile?.signups ?? []}
                />
              ))}
            </tbody>
          </table>

          <ErrorDisplay graphQLError={createError} />
          <ErrorDisplay graphQLError={updateError} />
          <ErrorDisplay graphQLError={deleteError} />
        </section>
      </div>
    </div>
  );
}

export default RankedChoiceUserSettings;
