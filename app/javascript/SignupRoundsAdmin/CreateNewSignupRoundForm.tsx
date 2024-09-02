import { DateTime } from 'luxon';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppRootContext from '../AppRootContext';
import { MaximumEventSignupsValue } from '../SignupRoundUtils';
import { useFetcher } from 'react-router-dom';
import { ErrorDisplay, FormGroupWithLabel } from '@neinteractiveliterature/litform';
import DateTimeInput from '../BuiltInFormControls/DateTimeInput';
import MaximumEventSignupsInput from './MaximumEventSignupsInput';
import { ApolloError } from '@apollo/client';

type CreateNewSignupRoundFormProps = {
  onCancel: () => void;
};

export default function CreateNewSignupRoundForm({ onCancel }: CreateNewSignupRoundFormProps) {
  const { t } = useTranslation();
  const [start, setStart] = useState<DateTime>();
  const { convention } = useContext(AppRootContext);
  const [maximumEventSignups, setMaximumEventSignups] = useState<MaximumEventSignupsValue>();
  const fetcher = useFetcher();

  const error = fetcher.data instanceof Error ? fetcher.data : undefined;
  const data = fetcher.data instanceof Error ? undefined : fetcher.data;

  useEffect(() => {
    if (fetcher.state === 'idle' && data) {
      onCancel();
    }
  }, [data, fetcher.state, onCancel]);

  return (
    <fetcher.Form action="/signup_rounds" method="POST">
      <h6>{t('signups.signupRounds.addNewSignupRound')}</h6>
      <input type="hidden" name="convention_id" value={convention?.id} />

      <FormGroupWithLabel label={t('signups.signupRounds.start')}>
        {(id) => (
          <DateTimeInput id={id} value={start?.toISO()} onChange={(value) => setStart(DateTime.fromISO(value))} />
        )}
      </FormGroupWithLabel>
      <input type="hidden" name="start" value={start?.toISO() ?? ''} />

      <FormGroupWithLabel label={t('signups.signupRounds.maximumEventSignups')}>
        {(id) => (
          <MaximumEventSignupsInput
            id={id}
            name="maximum_event_signups"
            value={maximumEventSignups}
            onChange={(value) => setMaximumEventSignups(value)}
          />
        )}
      </FormGroupWithLabel>
      <div className="d-flex gap-2 mb-2">
        <button className="btn btn-primary" disabled={fetcher.state !== 'idle'} type="submit">
          {t('buttons.save')}
        </button>
        <button className="btn btn-secondary" disabled={fetcher.state !== 'idle'} onClick={onCancel}>
          {t('buttons.cancel')}
        </button>
      </div>
      <ErrorDisplay graphQLError={error as ApolloError} />
    </fetcher.Form>
  );
}
