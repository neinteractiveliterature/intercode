import React from 'react';

import GraphQLAsyncSelect, {
  GraphQLAsyncSelectProps,
} from '../../BuiltInFormControls/GraphQLAsyncSelect';
import { SearchCmsContentQuery } from './queries';
import { SearchCmsContentQueryQuery } from './queries.generated';

export type CmsContentOption = SearchCmsContentQueryQuery['searchCmsContent'][0];

export type CmsContentSelectProps = Omit<
  GraphQLAsyncSelectProps<SearchCmsContentQueryQuery, CmsContentOption>,
  'getOptions' | 'getVariables' | 'getOptionValue' | 'formatOptionLabel' | 'query'
>;

function CmsContentSelect(props: CmsContentSelectProps) {
  const { ...otherProps } = props;

  return (
    <GraphQLAsyncSelect<SearchCmsContentQueryQuery, CmsContentOption>
      getOptions={(data) => data.searchCmsContent}
      getVariables={(inputValue) => ({ name: inputValue })}
      getOptionValue={({ id: optionId, __typename }: CmsContentOption) =>
        `${__typename}-${optionId}`
      }
      formatOptionLabel={(option: CmsContentOption) => (
        <>
          {option.name}{' '}
          <small className="badge badge-light">{option.__typename.replace('Cms', '')}</small>
        </>
      )}
      query={SearchCmsContentQuery}
      {...otherProps}
    />
  );
}

export default CmsContentSelect;
