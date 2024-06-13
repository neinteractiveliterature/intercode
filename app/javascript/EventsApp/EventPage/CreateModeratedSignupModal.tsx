import { useContext, useMemo } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { ApolloError, useApolloClient } from '@apollo/client';
import classnames from 'classnames';
import { ErrorDisplay, LoadQueryWrapper } from '@neinteractiveliterature/litform';

import AppRootContext from '../../AppRootContext';
import { timespanFromRun } from '../../TimespanUtils';
import useAsyncFunction from '../../useAsyncFunction';
import {
  CreateModeratedSignupModalQueryData,
  CreateModeratedSignupModalQueryVariables,
  EventPageQueryData,
  EventPageQueryDocument,
  useCreateModeratedSignupModalQuery,
} from './queries.generated';
import { SignupOption } from './buildSignupOptions';
import { useCreateSignupRankedChoiceMutation, useCreateSignupRequestMutation } from './mutations.generated';

export type CreateModeratedSignupModalProps = {
  visible: boolean;
  close: () => void;
  run: EventPageQueryData['convention']['event']['runs'][0];
  event: EventPageQueryData['convention']['event'];
  signupOption?: SignupOption;
};

export default LoadQueryWrapper<
  CreateModeratedSignupModalQueryData,
  CreateModeratedSignupModalQueryVariables,
  CreateModeratedSignupModalProps
>(
  useCreateModeratedSignupModalQuery,
  function CreateModeratedSignupModal({ visible, close, run, event, signupOption, data }): JSX.Element {
    const { conventionName, timezoneName } = useContext(AppRootContext);
    const [createMutate] = useCreateSignupRequestMutation({
      refetchQueries: () => [{ query: EventPageQueryDocument, variables: { eventId: event.id } }],
    });
    const [createSignupRequest, createError, createInProgress] = useAsyncFunction(createMutate);
    const runTimespan = useMemo(() => timespanFromRun(timezoneName, event, run), [timezoneName, event, run]);
    const [createSignupRankedChoiceMutate] = useCreateSignupRankedChoiceMutation();
    const apolloClient = useApolloClient();

    const conflictingSignup = useMemo(() => {
      return (data.convention.my_profile?.signups || []).find((signup) => {
        const timespan = timespanFromRun(timezoneName, signup.run.event, signup.run);

        return (
          !(event.can_play_concurrently || signup.run.event.can_play_concurrently) &&
          timespan.overlapsTimespan(runTimespan) &&
          signup.state !== 'withdrawn'
        );
      });
    }, [data.convention.my_profile?.signups, event.can_play_concurrently, runTimespan, timezoneName]);

    const confirmClicked = async () => {
      if (!signupOption) {
        Rollbar?.error('CreateModeratedSignupModal: signupOption is null!');
        throw new Error(
          `Signup option not found in CreateModeratedSignupModal. This is probably a bug; we've been notified automatically and will look at it as soon as possible.`,
        );
      }

      if (signupOption.action === 'ADD_TO_QUEUE') {
        await createSignupRankedChoiceMutate({
          variables: {
            targetRunId: run.id,
            requestedBucketKey: signupOption.bucket?.key,
          },
        });

        await apolloClient.resetStore();
      } else {
        await createSignupRequest({
          variables: {
            targetRunId: run.id,
            requestedBucketKey: signupOption.bucket?.key,
            replaceSignupId: conflictingSignup?.id,
          },
        });
      }
      close();
    };

    return (
      <Modal visible={visible}>
        <div className="modal-header">Signup request</div>

        <div className="modal-body">
          <>
            <p className={classnames({ 'm-0': !conflictingSignup })}>
              {conventionName}
              {' uses signup moderation.  Your request to sign up will go to a staff member for '}
              review, and you’ll be notified by email when it’s approved.
            </p>

            {conflictingSignup && (
              <div className="alert alert-warning">
                You are currently signed up for <strong>{conflictingSignup.run.event.title}</strong>. If you continue,
                and your signup request is approved, you’ll be automatically withdrawn from this conflicting event.
              </div>
            )}
          </>

          <ErrorDisplay graphQLError={createError as ApolloError} />
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" type="button" onClick={close} disabled={createInProgress}>
            Cancel
          </button>
          <button className="btn btn-primary" type="button" onClick={confirmClicked} disabled={createInProgress}>
            Confirm
          </button>
        </div>
      </Modal>
    );
  },
);
