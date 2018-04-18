import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { pluralize } from 'inflected';
import { ConfirmProvider, ConfirmConsumer } from '../ModalDialogs/Confirm';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import GraphQLResultPropType from '../GraphQLResultPropType';
import Timespan from '../PCSG/Timespan';

const adminSignupQuery = gql`
query($id: Int!) {
  convention {
    timezone_name
  }

  signup(id: $id) {
    id
    state
    counted
    bucket_key
    requested_bucket_key

    run {
      title_suffix
      starts_at
      ends_at

      rooms {
        name
      }

      event {
        title
        team_member_name

        registration_policy {
          buckets {
            key
            name
          }
        }

        team_members {
          user_con_profile {
            id
          }
        }
      }
    }

    user_con_profile {
      id
      name_without_nickname
    }
  }
}
`;

@graphql(adminSignupQuery)
@GraphQLQueryResultWrapper
class EditSignup extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(adminSignupQuery).isRequired,
    teamMembersUrl: PropTypes.string.isRequired,
  }

  toggleCounted = () => {}

  renderUserSection = () => {
    const { signup } = this.props.data;
    const { user_con_profile: userConProfile } = signup;

    return (
      <div className="card mr-2">
        <div className="card-header">
          {userConProfile.name_without_nickname}
        </div>
        <div className="card-body">
          stuff
        </div>
      </div>
    );
  }

  renderRunSection = () => {
    const { signup } = this.props.data;
    const { run } = signup;
    const timespan = Timespan.fromStrings(run.starts_at, run.ends_at);
    const teamMember = run.event.team_members
      .find(tm => tm.user_con_profile.id === signup.user_con_profile.id);
    const { user_con_profile: userConProfile } = signup;

    return (
      <div className="card ml-2">
        <div className="card-header">
          {run.event.title}
          <br />
          {timespan.humanizeInTimezone(this.props.data.convention.timezone_name)}
          <br />
          {run.rooms.map(room => room.name).sort().join(', ')}
        </div>

        <ConfirmConsumer>
          {confirm => (
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex align-items-center">
                <div className="flex-fill">
                  Signup state:
                  <strong> {signup.state}</strong>
                </div>
                <button className="btn btn-link">
                  <i className="fa fa-pencil"><span className="sr-only">Change</span></i>
                </button>
              </li>
              <li className="list-group-item d-flex align-items-center">
                <div className="flex-fill">
                  Counts towards totals:
                  <strong>{signup.counted ? ' yes' : ' no'}</strong>
                </div>
                <button
                  className="btn btn-link"
                  onClick={() => confirm({
                    prompt: (
                      signup.counted ?
                      `Are you sure?  This will make ${userConProfile.name_without_nickname}'s signup not count towards attendee totals for ${run.event.title}.  It will also allow ${userConProfile.name_without_nickname} to sign up for an additional event if there is a signup cap in place.` :
                      `Are you sure?  This will make ${userConProfile.name_without_nickname}'s signup count towards attendee totals for ${run.event.title}.  ${run.event.title} will also count towards ${userConProfile.name_without_nickname}'s signup limit if there is a signup cap in place.`
                    ),
                    action: this.toggleCounted,
                  })}
                >
                  {
                    signup.counted ?
                      <i className="fa fa-toggle-on"><span className="sr-only">Make not counted</span></i> :
                      <i className="fa fa-toggle-off"><span className="sr-only">Make counted</span></i>
                  }
                </button>
              </li>
              <li className="list-group-item d-flex align-items-center">
                <div className="flex-fill">
                  {run.event.team_member_name}:
                  <strong>{teamMember ? ' yes' : ' no'}</strong>
                </div>
                <a href={this.props.teamMembersUrl} className="btn btn-link">
                  Go to {pluralize(run.event.team_member_name)}
                </a>
              </li>
            </ul>
          )}
        </ConfirmConsumer>
      </div>
    );
  }

  render = () => (
    <ConfirmProvider>
      <h1>Edit signup for {this.props.data.signup.run.event.title}</h1>

      <div className="row">
        <div className="col col-md-6">
          {this.renderUserSection()}
        </div>

        <div className="col col-md-6">
          {this.renderRunSection()}
        </div>
      </div>
    </ConfirmProvider>
  )
}

export default EditSignup;
