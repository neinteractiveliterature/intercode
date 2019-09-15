import React from 'react';

import GraphQLAsyncSelect from '../../BuiltInFormControls/GraphQLAsyncSelect';
import { SearchCmsContentQuery } from './queries.gql';

function CmsContentSelect(props) {
  const { ...otherProps } = props;

  return (
    <GraphQLAsyncSelect
      getOptions={(data) => data.searchCmsContent}
      getVariables={(inputValue) => ({ name: inputValue })}
      getOptionValue={({ id: optionId, __typename }) => `${__typename}-${optionId}`}
      formatOptionLabel={(option) => (
        <>
          {option.name}
          {' '}
          <small className="badge badge-light">
            {option.__typename.replace('Cms', '')}
          </small>
        </>
      )}
      query={SearchCmsContentQuery}
      {...otherProps}
    />
  );
}

export default CmsContentSelect;
