import React, { useState } from 'react';
import PropTypes from 'prop-types';

import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';
import { CmsContentGroupsAdminQuery, SearchCmsContentQuery } from './queries.gql';
import { CreateContentGroup } from './mutations.gql';
import ErrorDisplay from '../../ErrorDisplay';
import FormGroupWithLabel from '../../BuiltInFormControls/FormGroupWithLabel';
import GraphQLAsyncSelect from '../../BuiltInFormControls/GraphQLAsyncSelect';
import useAsyncFunction from '../../useAsyncFunction';
import { useCreateMutation } from '../../MutationUtils';

function NewCmsContentGroup({ history }) {
  const mutate = useCreateMutation(CreateContentGroup, {
    query: CmsContentGroupsAdminQuery,
    arrayPath: ['cmsContentGroups'],
    newObjectPath: ['createCmsContentGroup', 'cms_content_group'],
  });
  const [createCmsContentGroup, createError, createInProgress] = useAsyncFunction(mutate);
  const [contentGroup, setContentGroup] = useState({
    name: '',
    contents: [],
  });

  const formSubmitted = async (event) => {
    event.preventDefault();

    await createCmsContentGroup({
      variables: {
        cmsContentGroup: {
          name: contentGroup.name,
          contents: contentGroup.contents.map(({ id, __typename }) => ({
            id, content_type: __typename,
          })),
        },
      },
    });

    history.push('/cms_content_groups');
  };

  return (
    <form onSubmit={formSubmitted}>
      <h3 className="mb-4">New content group</h3>

      <BootstrapFormInput
        label="Name"
        value={contentGroup.name}
        onTextChange={(name) => setContentGroup({ ...contentGroup, name })}
        disabled={createInProgress}
      />

      <FormGroupWithLabel label="Contents" name="contents">
        {(id) => (
          <GraphQLAsyncSelect
            isMulti
            value={contentGroup.contents}
            inputId={id}
            onChange={(contents) => setContentGroup({ ...contentGroup, contents })}
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
            disabled={createInProgress}
          />
        )}
      </FormGroupWithLabel>

      <ErrorDisplay graphQLError={createError} />

      <input
        type="submit"
        value="Create content group"
        className="btn btn-primary"
        disabled={createInProgress}
      />
    </form>
  );
}

NewCmsContentGroup.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default NewCmsContentGroup;
