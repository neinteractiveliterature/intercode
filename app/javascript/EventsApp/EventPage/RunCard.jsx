import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';

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
  static propTypes = {
    run: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title_suffix: PropTypes.string,
      my_signups: PropTypes.arrayOf(PropTypes.shape({
        state: PropTypes.string.isRequired,
      })).isRequired,
      rooms: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
      })).isRequired,
    }).isRequired,
    event: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
    history: PropTypes.shape({
      location: PropTypes.shape({
        hash: PropTypes.string,
      }).isRequired,
    }).isRequired,
    eventPath: PropTypes.string.isRequired,
    signupOptions: PropTypes.shape({
      mainPreference: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
      mainNoPreference: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
      auxiliary: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    }).isRequired,
    timezoneName: PropTypes.string.isRequired,
    currentAbility: PropTypes.shape({}).isRequired,
    myProfile: PropTypes.shape({}),
  }

  static defaultProps = {
    myProfile: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      mutationInProgress: false,
      signupError: null,
    };
    this.cardRef = React.createRef();
  }

  componentDidMount = () => {
    if (this.props.history.location.hash === `#run-${this.props.run.id}`) {
      this.cardRef.current.scrollIntoView(false);
    }
  }

  renderMainSignupSection = (signupButtonClicked) => {
    const {
      run, event, signupOptions, myProfile,
    } = this.props;
    const mySignup = run.my_signups.find(signup => signup.state !== 'withdrawn');

    if (!myProfile) {
      return (
        <a
          href={`/users/sign_in?user_return_to=${window.location.href}`}
          className="btn btn-outline-primary"
          style={{ whiteSpace: 'normal' }}
        >
          <strong>Log in</strong>
          {' '}
          to sign up for
          <br />
          <em>{event.title}</em>
        </a>
      );
    }

    if (mySignup) {
      return (
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
      );
    }

    return (
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
    );
  }

  renderAuxiliarySignupSection = (signupButtonClicked) => {
    const {
      run, event, signupOptions, myProfile,
    } = this.props;
    const mySignup = run.my_signups.find(signup => signup.state !== 'withdrawn');

    if (!myProfile || mySignup || signupOptions.auxiliary.length === 0) {
      return null;
    }

    return (
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
    );
  }

  render = () => {
    const {
      run, event, timezoneName, currentAbility,
    } = this.props;
    const runTimespan = timespanFromRun({ timezone_name: timezoneName }, event, run);
    const acceptsSignups = (
      !event.registration_policy.slots_limited
      || event.registration_policy.total_slots_including_not_counted > 0
    );

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
              <div
                ref={this.cardRef}
                className={classNames(
                  'card mb-3',
                  { 'glow-success': this.props.history.location.hash === `#run-${run.id}` },
                )}
                id={`run-${run.id}`}
              >
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

                {
                  acceptsSignups
                    ? (
                      <>
                        <div className="card-body text-center">
                          <RunCapacityGraph run={run} event={event} signupsAvailable />
                          {this.renderMainSignupSection(signupButtonClicked)}
                        </div>

                        {this.renderAuxiliarySignupSection(signupButtonClicked)}

                        <ViewSignupsOptions
                          event={event}
                          eventPath={this.props.eventPath}
                          run={run}
                          currentAbility={currentAbility}
                        />
                      </>
                    )
                    : (
                      <div className="card-body">
                        <small>This event does not take signups.</small>
                      </div>
                    )
                }
              </div>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default withRouter(RunCard);
