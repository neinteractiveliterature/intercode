import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import ConventionForm from './ConventionForm';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import GraphQLResultPropType from '../GraphQLResultPropType';

const conventionFragment = gql`
fragment ConventionAdminConventionFields on Convention {
  accepting_proposals
  starts_at
  ends_at
  name
  domain
  timezone_name
  show_schedule
  maximum_tickets
  ticket_name

  maximum_event_signups {
    timespans {
      start
      finish
      value
    }
  }

  default_layout {
    id
  }

  cms_layouts {
    id
    name
  }

  root_page {
    id
  }

  pages {
    id
    name
  }
}
`;

const conventionQuery = gql`
query($id: Int!) {
  convention(id: $id) {
    ...ConventionAdminConventionFields
  }
}

${conventionFragment}
`;

const updateConventionMutation = gql`
mutation($input: UpdateConventionInput!) {
  updateConvention(input: $input) {
    convention {
      ...ConventionAdminConventionFields
    }
  }
}

${conventionFragment}
`;

@compose(
  graphql(conventionQuery),
  graphql(updateConventionMutation, { name: 'updateConvention' }),
)
@GraphQLQueryResultWrapper
class ConventionAdmin extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(conventionQuery).isRequired,
    updateConvention: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      error: null,
    };
  }

  saveConvention = (convention) => {
    const input = {
      convention: {
        accepting_proposals: convention.accepting_proposals,
        starts_at: convention.starts_at,
        ends_at: convention.ends_at,
        name: convention.name,
        domain: convention.domain,
        timezone_name: convention.timezone_name,
        show_schedule: convention.show_schedule,
        maximum_tickets: convention.maximum_tickets,
        ticket_name: convention.ticket_name,
        maximum_event_signups: {
          timespans: convention.maximum_event_signups.timespans.map(timespan => ({
            start: timespan.start,
            finish: timespan.finish,
            string_value: timespan.value,
          })),
        },
        default_layout_id: convention.default_layout_id,
        root_page_id: convention.root_page_id,
      },
    };

    this.props.updateConvention({ variables: { input } })
      .then(() => { window.location.href = '/'; })
      .catch((error) => {
        this.setState({ error: error.graphQLErrors.map(graphQLError => graphQLError.message).join(', ') });
      });
  }

  renderError = () => {
    if (!this.state.error) {
      return null;
    }

    return (
      <div className="alert alert-danger">{this.state.error}</div>
    );
  }

  render = () => (
    <div className="mb-4">
      <ConventionForm
        initialConvention={{
          ...this.props.data.convention,
          default_layout_id: (this.props.data.convention.default_layout || {}).id,
          root_page_id: (this.props.data.convention.root_page || {}).id,
        }}
        saveConvention={this.saveConvention}
        cmsLayouts={this.props.data.convention.cms_layouts}
        pages={this.props.data.convention.pages}
      />

      {this.renderError()}
    </div>
  )
}

export default ConventionAdmin;
