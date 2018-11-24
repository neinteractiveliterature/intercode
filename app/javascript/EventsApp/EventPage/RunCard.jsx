import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

import { CreateMySignup } from './mutations.gql';
import ErrorDisplay from '../../ErrorDisplay';
import { EventPageQuery } from './queries.gql';
import RunCapacityGraph from './RunCapacityGraph';
import SignupButtons from './SignupButtons';
import { timespanFromRun } from '../../TimespanUtils';
import ViewSignupsOptions from './ViewSignupsOptions';
import WithdrawMySignupButton from './WithdrawMySignupButton';

function updateCacheAfterSignup(cache, event, run, signup) {
  const data = cache.readQuery({ query: EventPageQuery, variables: { eventId: event.id } });
  const runData = data.event.runs.find(eventRun => eventRun.id === run.id);
  runData.my_signups.push(signup);

  cache.writeQuery({
    query: EventPageQuery,
    variables: { eventId: event.id },
    data,
  });
}

class RunCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mutationInProgress: false,
      signupError: null,
    };
  }

  render = () => {
    const {
      run, event, signupOptions, timezoneName, currentAbility,
    } = this.props;
    const runTimespan = timespanFromRun({ timezone_name: timezoneName }, event, run);
    const mySignup = run.my_signups.find(signup => signup.state !== 'withdrawn');

    return (
      <Mutation mutation={CreateMySignup}>
        {(createMySignupMutate) => {
          const signupButtonClicked = async (signupOption) => {
            try {
              this.setState({ mutationInProgress: true, signupError: null });
              await createMySignupMutate({
                variables: {
                  runId: run.id,
                  requestedBucketKey: (signupOption.bucket || {}).key,
                  noRequestedBucket: signupOption.bucket == null,
                },
                update: (cache, { data: { createMySignup: { signup } } }) => {
                  updateCacheAfterSignup(cache, event, run, signup);
                },
              });
            } catch (signupError) {
              this.setState({ signupError });
            } finally {
              this.setState({ mutationInProgress: false });
            }
          };

          return (
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div className="card mb-3">
                <div className="card-header">
                  {
                    run.title_suffix
                      ? (
                        <p>
                          <strong>{run.title_suffix}</strong>
                        </p>
                      )
                      : null
                  }

                  {runTimespan.start.format('ddd h:mma')}
                  {'-'}
                  {runTimespan.finish.format('h:mma')}

                  <br />
                  {run.rooms.map(room => room.name).sort().join(', ')}
                </div>

                <div className="card-body text-center">
                  <RunCapacityGraph run={run} event={event} signupsAvailable />

                  {
                    mySignup
                      ? (
                        <>
                          <em>
                            {
                              mySignup.state === 'confirmed'
                                ? 'You are signed up.'
                                : `You are #${mySignup.waitlist_position} on the waitlist.`
                            }
                          </em>
                          <p>
                            <WithdrawMySignupButton run={run} event={event} />
                          </p>
                        </>
                      )
                      : (
                        <>
                          <SignupButtons
                            event={event}
                            run={run}
                            signupOptions={signupOptions.mainPreference}
                            disabled={this.state.mutationInProgress}
                            onClick={signupButtonClicked}
                          />
                          <SignupButtons
                            event={event}
                            run={run}
                            signupOptions={signupOptions.mainNoPreference}
                            disabled={this.state.mutationInProgress}
                            onClick={signupButtonClicked}
                          />
                          <ErrorDisplay graphQLError={this.state.signupError} />
                        </>
                      )
                  }
                </div>

                {
                  mySignup || signupOptions.auxiliary.length === 0
                    ? null
                    : (
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item border-bottom-0">
                          <SignupButtons
                            event={event}
                            run={run}
                            signupOptions={signupOptions.auxiliary}
                            disabled={this.state.mutationInProgress}
                            onClick={signupButtonClicked}
                          />
                        </li>
                      </ul>
                    )
                }

                <ViewSignupsOptions event={event} run={run} currentAbility={currentAbility} />
              </div>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default RunCard;
