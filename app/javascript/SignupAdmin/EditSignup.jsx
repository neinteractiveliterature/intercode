import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { pluralize, humanize } from 'inflected';
import moment from 'moment';
import classNames from 'classnames';

import { adminSignupQuery, signupFields } from './queries';
import { ageAsOf } from '../TimeUtils';
import ChangeBucketModal from './ChangeBucketModal';
import Confirm from '../ModalDialogs/Confirm';
import ErrorDisplay from '../ErrorDisplay';
import ForceConfirmSignupModal from './ForceConfirmSignupModal';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import GraphQLResultPropType from '../GraphQLResultPropType';
import Timespan from '../PCSG/Timespan';

const updateCountedMutation = gql`
mutation($signupId: Int!, $counted: Boolean!) {
  updateSignupCounted(input: { id: $signupId, counted: $counted }) {
    signup {
      ...SignupFields
    }
  }
}

${signupFields}
`;

function cityState(userConProfile) {
  return [
    userConProfile.city,
    userConProfile.state,
  ].filter(item => item && item.trim() !== '').join(', ');
}

function cityStateZip(userConProfile) {
  return [
    cityState(userConProfile),
    userConProfile.zipcode,
  ].filter(item => item && item.trim() !== '').join(' ');
}

function getMakeCountedConfirmPrompt(signup, error) {
  const { user_con_profile: userConProfile, run } = signup;

  return (
    <div>
      <p>
        Are you sure?  This will make
        {' '}
        {userConProfile.name_without_nickname}
&apos;s signup count
        towards attendee totals for
        {' '}
        {run.event.title}
.
        {' '}
        {run.event.title}
        {' '}
will also count towards
        {userConProfile.name_without_nickname}
&apos;s signup limit if there is a signup cap in
        place.
      </p>
      <p className="text-danger">
        Caution: this operation does not check whether the signup buckets are already full, and
        therefore may result in overfilling a bucket.
      </p>
      <ErrorDisplay graphQLError={error} />
    </div>
  );
}

function getMakeNotCountedConfirmPrompt(signup, error) {
  const { user_con_profile: userConProfile, run } = signup;

  return (
    <div>
      <p>
        Are you sure?  This will make
        {' '}
        {userConProfile.name_without_nickname}
&apos;s signup not count
        towards attendee totals for
        {' '}
        {run.event.title}
.  It will also allow
        {userConProfile.name_without_nickname}
        {' '}
to sign up for an additional event if there is a
        signup cap in place.
      </p>
      <p className="text-danger">
        Caution: this operation will pull additional attendees into the space freed up by making
        this signup not count.
      </p>
      <ErrorDisplay graphQLError={error} />
    </div>
  );
}

function getToggleCountedConfirmPrompt(signup, error) {
  if (signup.counted) {
    return getMakeNotCountedConfirmPrompt(signup, error);
  }

  return getMakeCountedConfirmPrompt(signup, error);
}

@graphql(adminSignupQuery)
@GraphQLQueryResultWrapper
class EditSignup extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(adminSignupQuery).isRequired,
    teamMembersUrl: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      forceConfirmingSignup: false,
    };
  }

  toggleCounted = () => {}

  renderAddressItem = (userConProfile) => {
    const elements = [
      ['header', 'Address:'],
      ['address', userConProfile.address],
      ['cityStateZip', cityStateZip(userConProfile)],
      ['country', userConProfile.country],
    ].filter(pair => pair[1] && pair[1].trim() !== '');

    const listItems = elements.map(([key, element]) => <li key={key}>{element}</li>);
    return <ul className="list-unstyled">{listItems}</ul>;
  }

  renderUserSection = () => {
    const { signup } = this.props.data;
    const { user_con_profile: userConProfile } = signup;

    return (
      <div className="card mr-2">
        <div className="card-header">
          {userConProfile.name_without_nickname}
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            Nickname:
            {' '}
            {userConProfile.nickname}
          </li>
          <li className="list-group-item">
            Age at
            {' '}
            {signup.run.event.title}
:
            {' '}
            {ageAsOf(moment(userConProfile.birth_date), moment(signup.run.starts_at))}
          </li>
          <li className="list-group-item">
            Preferred contact method:
            {' '}
            {humanize(userConProfile.preferred_contact || '')}
          </li>
          <li className={classNames('list-group-item', { 'font-weight-bold': userConProfile.preferred_contact === 'email' })}>
            Email:
            {' '}
            <a href={`mailto:${userConProfile.email}`}>{userConProfile.email}</a>
          </li>
          <li className={classNames('list-group-item', { 'font-weight-bold': userConProfile.preferred_contact === 'day_phone' })}>
            Daytime phone:
            {' '}
            {userConProfile.day_phone}
          </li>
          <li className={classNames('list-group-item', { 'font-weight-bold': userConProfile.preferred_contact === 'evening_phone' })}>
            Evening phone:
            {' '}
            {userConProfile.evening_phone}
          </li>
          <li className="list-group-item">
            {this.renderAddressItem(userConProfile)}
          </li>
        </ul>
      </div>
    );
  }

  renderForceConfirmButton = () => {
    if (!this.props.data.myProfile.ability.can_update_signup) {
      return null;
    }

    const { signup } = this.props.data;

    if (signup.state !== 'waitlisted') {
      return null;
    }

    return (
      <div>
        <button
          className="btn btn-link"
          onClick={() => this.setState({ forceConfirmingSignup: true })}
        >
          Force into run
        </button>
      </div>
    );
  }

  renderCountedToggle = () => {
    if (!this.props.data.myProfile.ability.can_update_signup) {
      return null;
    }

    const { signup } = this.props.data;

    return (
      <Confirm.Trigger>
        {confirm => (
          <Mutation mutation={updateCountedMutation}>
            {updateCounted => (
              <button
                className="btn btn-link"
                onClick={() => confirm({
                  prompt: getToggleCountedConfirmPrompt(signup),
                  action: () => updateCounted({
                    variables: {
                      signupId: signup.id,
                      counted: !signup.counted,
                    },
                  }),
                  onError: error => confirm.setPrompt(getToggleCountedConfirmPrompt(signup, error)),
                })}
              >
                {
                  signup.counted
                    ? <i className="fa fa-toggle-on"><span className="sr-only">Make not counted</span></i>
                    : <i className="fa fa-toggle-off"><span className="sr-only">Make counted</span></i>
                }
              </button>
            )}
          </Mutation>
        )}
      </Confirm.Trigger>
    );
  }

  renderRunSection = () => {
    const { signup } = this.props.data;
    const { run } = signup;
    const { event } = run;
    const { registration_policy: registrationPolicy } = event;
    const timespan = Timespan.fromStrings(run.starts_at, run.ends_at);
    const teamMember = run.event.team_members
      .find(tm => tm.user_con_profile.id === signup.user_con_profile.id);
    const bucket = (signup.bucket_key
      ? registrationPolicy.buckets.find(b => b.key === signup.bucket_key)
      : null
    );
    const requestedBucket = (signup.requested_bucket_key
      ? registrationPolicy.buckets.find(b => b.key === signup.requested_bucket_key)
      : null
    );

    return (
      <div className="card ml-2">
        <div className="card-header">
          {run.event.title}
          <br />
          {timespan.humanizeInTimezone(this.props.data.convention.timezone_name)}
          <br />
          {run.rooms.map(room => room.name).sort().join(', ')}
        </div>

        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex align-items-center">
            <div className="flex-fill">
              Signup state:
              <strong>
                {' '}
                {signup.state}
              </strong>
            </div>
            {this.renderForceConfirmButton()}
          </li>
          <li className="list-group-item d-flex align-items-center">
            <div className="flex-fill">
              Signup bucket:
              {' '}
              <strong>
                {(bucket || { name: 'none' }).name}
                {(
                  (bucket && requestedBucket && bucket.key !== requestedBucket.key)
                    ? ` (requested ${requestedBucket.name})`
                    : ''
                )}
                {(
                  (bucket && !requestedBucket)
                    ? ' (no preference)'
                    : ''
                )}
              </strong>
            </div>
            {(
              signup.state === 'confirmed'
                ? (
                  <button className="btn btn-link" onClick={() => this.setState({ changingSignupBucket: true })}>
                    <i className="fa fa-pencil"><span className="sr-only">Change</span></i>
                  </button>
                )
                : null
            )}
          </li>
          <li className="list-group-item d-flex align-items-center">
            <div className="flex-fill">
              Counts towards totals:
              <strong>{signup.counted ? ' yes' : ' no'}</strong>
            </div>
            {this.renderCountedToggle()}
          </li>
          <li className="list-group-item d-flex align-items-center">
            <div className="flex-fill">
              {run.event.team_member_name}
:
              <strong>{teamMember ? ' yes' : ' no'}</strong>
            </div>
            <a href={this.props.teamMembersUrl} className="btn btn-link">
              Go to
              {' '}
              {pluralize(run.event.team_member_name)}
            </a>
          </li>
        </ul>
      </div>
    );
  }

  render = () => (
    <React.Fragment>
      <h1 className="mb-4">
Edit signup for
        {this.props.data.signup.run.event.title}
      </h1>

      <div className="row">
        <div className="col col-md-6">
          {this.renderUserSection()}
        </div>

        <div className="col col-md-6">
          {this.renderRunSection()}
        </div>
      </div>

      <ForceConfirmSignupModal
        signup={this.state.forceConfirmingSignup ? this.props.data.signup : null}
        onComplete={() => this.setState({ forceConfirmingSignup: false })}
        onCancel={() => this.setState({ forceConfirmingSignup: false })}
      />

      <ChangeBucketModal
        signup={this.state.changingSignupBucket ? this.props.data.signup : null}
        onComplete={() => this.setState({ changingSignupBucket: false })}
        onCancel={() => this.setState({ changingSignupBucket: false })}
      />
    </React.Fragment>
  )
}

export default EditSignup;
