import AppRootContext from 'AppRootContext';
import { Signup, Event, SignupState, SignupAutomationMode, Run } from 'graphqlTypes.generated';
import { useCallback, useContext, useMemo, useState } from 'react';
import Modal from 'react-bootstrap4-modal';
import { Trans, useTranslation } from 'react-i18next';
import { parseSignupRounds } from 'SignupRoundUtils';
import { DateTime } from 'luxon';
import { BootstrapFormCheckbox, ErrorDisplay } from '@neinteractiveliterature/litform';
import { WithdrawMySignupDocument } from './mutations.generated';
import { ApolloError, useApolloClient } from '@apollo/client';
import { useRevalidator } from 'react-router';

export type WithdrawMySignupModalProps = {
  close: () => void;
  event: Pick<Event, 'title'>;
  signup: Pick<Signup, 'id' | 'state' | 'counted'>;
  run: Pick<Run, 'id'>;
  signupRounds: Parameters<typeof parseSignupRounds>[0];
};

export function WithdrawMySignupModal({ close, event, run, signup, signupRounds }: WithdrawMySignupModalProps) {
  const { signupMode, signupAutomationMode } = useContext(AppRootContext);
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApolloError>();
  const client = useApolloClient();
  const revalidator = useRevalidator();

  const currentRound = useMemo(() => {
    const parsedRounds = parseSignupRounds(signupRounds);
    const now = DateTime.local();
    return parsedRounds.find((round) => round.timespan.includesTime(now));
  }, [signupRounds]);

  const requiresCheckbox = useMemo(() => signup.state === SignupState.Confirmed, [signup.state]);

  const withdraw = async () => {
    setBusy(true);
    try {
      await client.mutate({ mutation: WithdrawMySignupDocument, variables: { runId: run.id } });
      await client.resetStore();
      revalidator.revalidate();
      close();
    } catch (error) {
      setError(error);
    }
  };

  const withdrawPrompt = useMemo(() => {
    if (signup && signup.state === SignupState.Confirmed && !signup.counted) {
      return t('events.withdrawPrompt.notCounted', { eventTitle: event.title });
    } else if (
      signupAutomationMode === SignupAutomationMode.RankedChoice &&
      typeof currentRound?.maximum_event_signups === 'number'
    ) {
      return t('events.withdrawPrompt.duringLimitedRankedChoiceSignupRoundCounted', { eventTitle: event.title });
    } else if (signupMode === 'moderated') {
      return (
        <Trans i18nKey="events.withdrawPrompt.moderatedSignup" values={{ eventTitle: event.title }}>
          <p>
            <strong>
              If you’re thinking of signing up for a different event instead, please go to that event’s page and request
              to sign up for it.
            </strong>{' '}
            If the request is accepted, you’ll automatically be withdrawn from this event.
          </p>
          <p className="mb-0">Are you sure you want to withdraw from {{ eventTitle: event.title }}?</p>
        </Trans>
      );
    } else {
      return t('events.withdrawPrompt.selfServiceSignup', { eventTitle: event.title });
    }
  }, [event.title, signup, signupMode, signupAutomationMode, t, currentRound?.maximum_event_signups]);

  return (
    <Modal visible>
      <div className="modal-header">
        <div className="lead">{t('events.withdrawPrompt.title')}</div>
      </div>
      <div className="modal-body">
        <div>{withdrawPrompt}</div>
        {requiresCheckbox && (
          <div className="mt-2">
            <BootstrapFormCheckbox
              type="checkbox"
              label={<Trans i18nKey="events.withdrawPrompt.checkboxLabel" values={{ eventTitle: event.title }} />}
              checked={checked}
              onChange={(event) => setChecked(event.target.checked)}
            />
          </div>
        )}
        <ErrorDisplay graphQLError={error} />
      </div>
      <div className="modal-footer">
        <button className="btn btn-secondary" disabled={busy} onClick={close}>
          {t('buttons.cancel')}
        </button>
        <button className="btn btn-primary" disabled={busy || (requiresCheckbox && !checked)} onClick={withdraw}>
          {t('buttons.confirm')}
        </button>
      </div>
    </Modal>
  );
}

export function useWithdrawMySignupModal() {
  const [props, setProps] = useState<WithdrawMySignupModalProps>();

  const openModal = useCallback((newProps: Omit<WithdrawMySignupModalProps, 'close'>) => {
    setProps((prevProps) => {
      if (prevProps != null) {
        throw new Error('Modal is already open');
      }

      return { ...newProps, close: () => setProps(undefined) };
    });
  }, []);

  const Component = () => {
    if (props == null) {
      return <></>;
    } else {
      return <WithdrawMySignupModal {...props} />;
    }
  };

  return { openModal, Component };
}
