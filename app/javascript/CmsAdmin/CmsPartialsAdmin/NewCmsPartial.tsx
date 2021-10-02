import { useState } from 'react';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import buildPartialInput from './buildPartialInput';
import { CmsPartialsAdminQuery } from './queries';
import { CreatePartial } from './mutations';
import useAsyncFunction from '../../useAsyncFunction';
import { useCreateMutation } from '../../MutationUtils';
import CmsPartialForm, { CmsPartialFormFields } from './CmsPartialForm';
import usePageTitle from '../../usePageTitle';

function NewCmsPartial(): JSX.Element {
  const history = useHistory();
  const [partial, setPartial] = useState<CmsPartialFormFields>({});
  const [createPartial, createError, createInProgress] = useAsyncFunction(
    useCreateMutation(CreatePartial, {
      query: CmsPartialsAdminQuery,
      arrayPath: ['cmsPartials'],
      newObjectPath: ['createCmsPartial', 'cms_partial'],
    }),
  );

  usePageTitle('New Partial');

  const formSubmitted = async (event: React.FormEvent) => {
    event.preventDefault();
    await createPartial({
      variables: {
        cmsPartial: buildPartialInput(partial),
      },
    });
    history.push('/cms_partials');
  };

  return (
    <>
      <form onSubmit={formSubmitted}>
        <CmsPartialForm partial={partial} onChange={setPartial} />

        <ErrorDisplay graphQLError={createError as ApolloError} />

        <input
          type="submit"
          className="btn btn-primary"
          value="Create partial"
          disabled={createInProgress}
          aria-label="Create partial"
        />
      </form>
    </>
  );
}

export default NewCmsPartial;
