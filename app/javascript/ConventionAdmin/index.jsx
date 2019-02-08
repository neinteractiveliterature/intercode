import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { flowRight } from 'lodash';

import { ConventionAdminConventionQuery } from './queries.gql';
import ConventionForm from './ConventionForm';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import GraphQLResultPropType from '../GraphQLResultPropType';
import { UpdateConvention } from './mutations.gql';

@flowRight([
  graphql(ConventionAdminConventionQuery),
  graphql(UpdateConvention, { name: 'updateConvention' }),
])
@GraphQLQueryResultWrapper
class ConventionAdmin extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(ConventionAdminConventionQuery).isRequired,
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
        event_mailing_list_domain: convention.event_mailing_list_domain,
        timezone_name: convention.timezone_name,
        show_schedule: convention.show_schedule,
        show_event_list: convention.show_event_list,
        maximum_tickets: convention.maximum_tickets,
        ticket_name: convention.ticket_name,
        maximum_event_signups: {
          timespans: convention.maximum_event_signups.timespans.map(timespan => ({
            start: timespan.start,
            finish: timespan.finish,
            string_value: timespan.value,
          })),
        },
        default_layout_id: (convention.default_layout || {}).id,
        root_page_id: (convention.root_page || {}).id,
        stripe_publishable_key: convention.stripe_publishable_key,
        ...(
          convention.stripe_secret_key
            ? { stripe_secret_key: convention.stripe_secret_key }
            : {}
        ),
        clickwrap_agreement: convention.clickwrap_agreement,
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
        initialConvention={{ ...this.props.data.convention }}
        saveConvention={this.saveConvention}
        cmsLayouts={this.props.data.convention.cms_layouts}
        pages={this.props.data.convention.pages}
      />

      {this.renderError()}
    </div>
  )
}

export default ConventionAdmin;
