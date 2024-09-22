import GraphQLAsyncSelect, { GraphQLAsyncSelectProps } from './GraphQLAsyncSelect';
import { DefaultEventsQueryDocument } from './selectDefaultQueries.generated';
import { useTranslation } from 'react-i18next';
import { ResultOf, VariablesOf } from '@graphql-typed-document-node/core';

type DQ = typeof DefaultEventsQueryDocument;
type DO<QueryType extends DQ> = NonNullable<ResultOf<QueryType>['convention']>['events_paginated']['entries'][0];
export type DefaultEventSelectOptionType = DO<DQ>;

export type EventSelectProps<DataType extends DQ, OptionType, IsMulti extends boolean> = Omit<
  GraphQLAsyncSelectProps<DataType, OptionType, IsMulti>,
  'isClearable' | 'getOptions' | 'getVariables' | 'getOptionValue' | 'formatOptionLabel' | 'query'
> & {
  eventsQuery?: DataType;
};

function EventSelect<
  IsMulti extends boolean = false,
  DataType extends DQ = DQ,
  OptionType extends DO<DataType> = DO<DQ>,
>({ eventsQuery, ...otherProps }: EventSelectProps<DataType, OptionType, IsMulti>): JSX.Element {
  const { t } = useTranslation();

  return (
    <GraphQLAsyncSelect<DataType, OptionType, IsMulti>
      isClearable
      getOptions={(data) => data.convention.events_paginated.entries as OptionType[]}
      getVariables={(inputValue) => ({ title: inputValue }) as VariablesOf<DataType>}
      getOptionValue={(option) => option.id}
      getOptionLabel={(option) => option.title ?? ''}
      query={eventsQuery ?? (DefaultEventsQueryDocument as DataType)}
      placeholder={t('selectors.eventSelect.placeholder')}
      noOptionsMessage={({ inputValue }) =>
        inputValue.trim() === ''
          ? t('selectors.eventSelect.noInputMessage')
          : t('selectors.eventSelect.noResultsMessage', `No evets found matching “{{ inputValue }}”`, {
              inputValue,
            })
      }
      {...otherProps}
    />
  );
}

export default EventSelect;
