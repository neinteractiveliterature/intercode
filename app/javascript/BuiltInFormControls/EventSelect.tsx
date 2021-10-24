import type { OptionTypeBase } from 'react-select';
import type { DocumentNode } from 'graphql';

import GraphQLAsyncSelect, { GraphQLAsyncSelectProps } from './GraphQLAsyncSelect';
import { DefaultEventsQueryData, DefaultEventsQueryDocument } from './selectDefaultQueries.generated';

type DQ = DefaultEventsQueryData;
type DO<QueryType extends DefaultEventsQueryData> = NonNullable<
  QueryType['convention']
>['events_paginated']['entries'][0];
export type DefaultEventSelectOptionType = DO<DQ>;

export type EventSelectProps<DataType, OptionType extends OptionTypeBase, IsMulti extends boolean> = Omit<
  GraphQLAsyncSelectProps<DataType, OptionType, IsMulti>,
  'isClearable' | 'getOptions' | 'getVariables' | 'getOptionValue' | 'formatOptionLabel' | 'query'
> & {
  eventsQuery?: DocumentNode;
};

function EventSelect<
  IsMulti extends boolean = false,
  DataType extends DQ = DQ,
  OptionType extends DO<DataType> = DO<DQ>,
>({ eventsQuery, ...otherProps }: EventSelectProps<DataType, OptionType, IsMulti>): JSX.Element {
  return (
    <GraphQLAsyncSelect<DataType, OptionType>
      isClearable
      getOptions={(data) => data.convention.events_paginated.entries as OptionType[]}
      getVariables={(inputValue) => ({ title: inputValue })}
      getOptionValue={(option: OptionType) => option.id}
      getOptionLabel={(option: OptionType) => option.title}
      query={eventsQuery || DefaultEventsQueryDocument}
      {...otherProps}
    />
  );
}

export default EventSelect;
