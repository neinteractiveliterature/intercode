import React from 'react';
import PropTypes from 'prop-types';

import { DefaultEventsQuery } from './selectDefaultQueries.gql';
import GraphQLAsyncSelect from './GraphQLAsyncSelect';

function EventSelect({ eventsQuery, ...otherProps }) {
  return (
    <GraphQLAsyncSelect
      isClearable
      getOptions={data => data.convention.events_paginated.entries}
      getVariables={inputValue => ({ title: inputValue })}
      getOptionValue={option => option.id}
      getOptionLabel={option => option.title}
      query={eventsQuery || DefaultEventsQuery}
      {...otherProps}
    />
  );
}

EventSelect.propTypes = {
  eventsQuery: PropTypes.shape({
    kind: PropTypes.string.isRequired,
    definitions: PropTypes.array.isRequired,
  }),
};

EventSelect.defaultProps = {
  eventsQuery: null,
};

export default EventSelect;
