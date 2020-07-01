import React, { useContext, useMemo } from 'react';
import Modal from 'react-bootstrap4-modal';
import classnames from 'classnames';

import AppRootContext from '../../AppRootContext';
import ErrorDisplay from '../../ErrorDisplay';
import LoadingIndicator from '../../LoadingIndicator';
import { timespanFromRun } from '../../TimespanUtils';
import useAsyncFunction from '../../useAsyncFunction';
import { SignupOption } from './buildSignupOptions';
import {
  EventPageRunFieldsFragment,
  EventPageEventFieldsFragment,
  useCreateModeratedSignupModalQueryQuery,
  EventPageQueryDocument,
} from './queries.generated';
import { useCreateSignupRequestMutation } from './mutations.generated';

export type CreateModeratedSignupModalProps = {
  visible: boolean,
  close: () => void,
  run: EventPageRunFieldsFragment,
  event: EventPageEventFieldsFragment,
  signupOption?: SignupOption,
};

function CreateModeratedSignupModal({
  visible, close, run, event, signupOption,
}: CreateModeratedSignupModalProps) {
  const { conventionName, timezoneName } = useContext(AppRootContext);
  const { data, loading, error } = useCreateModeratedSignupModalQueryQuery();
  const [createMutate] = useCreateSignupRequestMutation({
    refetchQueries: () => [
      { query: EventPageQueryDocument, variables: { eventId: event.id } },
    ],
  });
  const [createSignupRequest, createError, createInProgress] = useAsyncFunction(createMutate);
  const runTimespan = useMemo(
    () => timespanFromRun(timezoneName, event, run),
    [timezoneName, event, run],
  );

  const conflictingSignup = useMemo(
    () => {
      if (loading || error) {
        return undefined;
      }

      return (data?.myProfile?.signups ?? []).find((signup) => {
        const timespan = timespanFromRun(
          timezoneName,
          signup.run.event,
          signup.run,
        );

        return (
          !(event.can_play_concurrently || signup.run.event.can_play_concurrently)
          && timespan.overlapsTimespan(runTimespan)
          && signup.state !== 'withdrawn'
        );
      });
    },
    [
      data?.myProfile?.signups, error, event.can_play_concurrently,
      loading, runTimespan, timezoneName,
    ],
  );

  const confirmClicked = async () => {
    await createSignupRequest({
      variables: {
        targetRunId: run.id,
        requestedBucketKey: signupOption!.bucket?.key,
        replaceSignupId: conflictingSignup?.id,
      },
    });
    close();
  };

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <Modal visible={visible}>
      <div className="modal-header">
        Signup request
      </div>

      <div className="modal-body">
        {
          loading
            ? <LoadingIndicator />
            : (
              <>
                <p className={classnames({ 'm-0': !conflictingSignup })}>
                  {conventionName}
                  {' uses signup moderation.  Your request to sign up will go to a staff member for '}
                  review, and you’ll be notified by email when it’s approved.
                </p>

                {conflictingSignup && (
                  <div className="alert alert-warning">
                    You are currently signed up for
                    {' '}
                    <strong>{conflictingSignup.run.event.title}</strong>
                    . If you continue, and your signup request is approved, you’ll be automatically
                    withdrawn from this conflicting event.
                  </div>
                )}
              </>
            )
        }

        <ErrorDisplay graphQLError={createError} />
      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" type="button" onClick={close} disabled={createInProgress}>Cancel</button>
        <button className="btn btn-primary" type="button" onClick={confirmClicked} disabled={createInProgress}>Confirm</button>
      </div>
    </Modal>
  );
}

export default CreateModeratedSignupModal;
