import type { OptionTypeBase } from 'react-select';
import type { DocumentNode } from 'graphql';

import { DefaultEventsQuery } from './selectDefaultQueries';
import GraphQLAsyncSelect, { GraphQLAsyncSelectProps } from './GraphQLAsyncSelect';
import { DefaultEventsQueryQuery } from './selectDefaultQueries.generated';

type DQ = DefaultEventsQueryQuery;
type DO<QueryType extends DefaultEventsQueryQuery> = NonNullable<
  QueryType['convention']
>['events_paginated']['entries'][0];
export type DefaultEventSelectOptionType = DO<DQ>;

export type EventSelectProps<DataType, OptionType extends OptionTypeBase> = Omit<
  GraphQLAsyncSelectProps<DataType, OptionType>,
  'isClearable' | 'getOptions' | 'getVariables' | 'getOptionValue' | 'formatOptionLabel' | 'query'
> & {
  eventsQuery?: DocumentNode;
};

function EventSelect<DataType extends DQ = DQ, OptionType extends DO<DataType> = DO<DQ>>({
  eventsQuery,
  ...otherProps
}: EventSelectProps<DataType, OptionType>) {
  return (
    <GraphQLAsyncSelect<DataType, OptionType>
      isClearable
      getOptions={(data) => (data.convention?.events_paginated?.entries ?? []) as OptionType[]}
      getVariables={(inputValue) => ({ title: inputValue })}
      getOptionValue={(option: OptionType) => option.id}
      getOptionLabel={(option: OptionType) => option.title}
      query={eventsQuery || DefaultEventsQuery}
      {...otherProps}
    />
  );
}

export default EventSelect;
