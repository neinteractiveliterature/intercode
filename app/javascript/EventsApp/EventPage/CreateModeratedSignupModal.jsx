import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { useQuery } from 'react-apollo-hooks';
import classnames from 'classnames';
import arrayToSentence from 'array-to-sentence';

import AppRootContext from '../../AppRootContext';
import { CreateModeratedSignupModalQuery } from './queries.gql';
import ErrorDisplay from '../../ErrorDisplay';
import LoadingIndicator from '../../LoadingIndicator';
import { timespanFromRun } from '../../TimespanUtils';

function CreateModeratedSignupModal({
  visible, close, run, event, signupOption,
}) {
  const { conventionName, timezoneName } = useContext(AppRootContext);
  const { data, loading, error } = useQuery(CreateModeratedSignupModalQuery);
  const runTimespan = useMemo(
    () => timespanFromRun({ timezone_name: timezoneName }, event, run),
    [timezoneName, event, run],
  );

  const conflictingSignups = useMemo(
    () => {
      if (loading || error) {
        return [];
      }

      return data.myProfile.signups.filter((signup) => {
        const timespan = timespanFromRun(
          { timezone_name: timezoneName },
          signup.run.event,
          signup.run,
        );

        return (
          !(event.can_play_concurrently || signup.run.event.can_play_concurrently)
          && timespan.overlapsTimespan(runTimespan)
        );
      });
    },
    [data, error, event.can_play_concurrently, loading, runTimespan, timezoneName],
  );

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
                <p className={classnames({ 'm-0': conflictingSignups.length === 0 })}>
                  {conventionName}
                  {' uses signup moderation.  Your request to sign up will go to a staff member for '}
                  review, and you’ll be notified of the result by email.  To continue, choose
                  “confirm” below.
                </p>

                {conflictingSignups.length > 0 && (
                  <div className="alert alert-danger">
                    You are currently signed up for
                    {' '}
                    <strong>
                      {arrayToSentence(conflictingSignups.map(signup => signup.run.event.title))}
                    </strong>
                    {'. '}
                    If you continue, and your signup request is approved, you will be automatically
                    withdrawn from
                    {conflictingSignups.length > 1 ? ' these conflicting events.' : ' this conflicting event.'}
                  </div>
                )}
              </>
            )
        }
      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" type="button" onClick={close}>Cancel</button>
        <button className="btn btn-primary" type="button">Confirm</button>
      </div>
    </Modal>
  );
}

CreateModeratedSignupModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};

export default CreateModeratedSignupModal;
