import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import GraphQLAsyncSelect from './GraphQLAsyncSelect';

export const DEFAULT_EVENTS_QUERY = gql`
query EventsQuery($title: String) {
  convention {
    id
    events_paginated(filters: { title: $title }, per_page: 50) {
      entries {
        id
        title
      }
    }
  }
}
`;

class EventSelect extends React.PureComponent {
  static propTypes = {
    eventsQuery: PropTypes.shape({
      kind: PropTypes.string.isRequired,
      definitions: PropTypes.array.isRequired,
    }),
  };

  static defaultProps = {
    eventsQuery: null,
  };

  render = () => (
    <GraphQLAsyncSelect
      isClearable
      getOptions={data => data.convention.events_paginated.entries}
      getVariables={inputValue => ({ title: inputValue })}
      getOptionValue={option => option.id}
      getOptionLabel={option => option.title}
      query={this.props.eventsQuery || DEFAULT_EVENTS_QUERY}
      {...this.props}
    />
  )
}

export default EventSelect;
