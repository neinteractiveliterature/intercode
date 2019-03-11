import React from 'react';
import PropTypes from 'prop-types';

import { DefaultEventsQuery } from './selectDefaultQueries.gql';
import GraphQLAsyncSelect from './GraphQLAsyncSelect';

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
      query={this.props.eventsQuery || DefaultEventsQuery}
      {...this.props}
    />
  )
}

export default EventSelect;
