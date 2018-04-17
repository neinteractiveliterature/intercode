import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
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
  }

  renderRunSection = () => {
    const { signup } = this.props.data;
    const { run } = signup;
    const timespan = Timespan.fromStrings(run.starts_at, run.ends_at);
    const teamMember = run.event.team_members
      .find(tm => tm.user_con_profile.id === signup.user_con_profile.id);

    return (
      <div className="card ml-2">
        <div className="card-header">
          {run.event.title}
          <br />
          {timespan.humanizeInTimezone(this.props.data.convention.timezone_name)}
          <br />
          {run.rooms.map(room => room.name).sort().join(', ')}
        </div>

        <div className="card-body">
          <ul className="list-unstyled">
            <li>
              {signup.user_con_profile.name_without_nickname} is
              <strong> {signup.state} </strong>
              for this run.
            </li>
            <li>
              {signup.user_con_profile.name_without_nickname}
              <strong>{teamMember ? ' is ' : ' is not '}</strong>
              a {run.event.team_member_name} for this run.
            </li>
            <li>
              {signup.user_con_profile.name_without_nickname}&apos;s signup
              <strong>{signup.counted ? ' counts ' : ' does not count '}</strong>
              towards totals for this run and for signup limits.
            </li>
          </ul>
        </div>
      </div>
    );
  }

  render = () => {
    return (
      <div>
        <h1>Edit signup for {this.props.data.signup.run.event.title}</h1>

        <div className="row">
          <div className="col col-md-6">
            <div className="card mr-2">
              <div className="card-header">
                {this.props.data.signup.user_con_profile.name_without_nickname}
              </div>
              <div className="card-body">
                stuff
              </div>
            </div>
          </div>

          <div className="col col-md-6">
            {this.renderRunSection()}
          </div>
        </div>
      </div>
    );
  }
}

export default EditSignup;
