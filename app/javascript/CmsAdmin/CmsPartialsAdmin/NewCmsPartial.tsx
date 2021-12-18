import { useState } from 'react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import {
  useCreateMutationWithReferenceArrayUpdater,
  ErrorDisplay,
  LoadQueryWrapper,
} from '@neinteractiveliterature/litform';

import buildPartialInput from './buildPartialInput';
import CmsPartialForm, { CmsPartialFormFields } from './CmsPartialForm';
import usePageTitle from '../../usePageTitle';
import { CmsPartialFieldsFragmentDoc, useCmsPartialsAdminQuery } from './queries.generated';
import { useCreatePartialMutation } from './mutations.generated';

export default LoadQueryWrapper(useCmsPartialsAdminQuery, function NewCmsPartial({ data }): JSX.Element {
  const navigate = useNavigate();
  const [partial, setPartial] = useState<CmsPartialFormFields>({});
  const [createPartial, { error: createError, loading: createInProgress }] = useCreateMutationWithReferenceArrayUpdater(
    useCreatePartialMutation,
    data.cmsParent,
    'cmsPartials',
    (data) => data.createCmsPartial.cms_partial,
    CmsPartialFieldsFragmentDoc,
  );

  usePageTitle('New Partial');

  const formSubmitted = async (event: React.FormEvent) => {
    event.preventDefault();
    await createPartial({
      variables: {
        cmsPartial: buildPartialInput(partial),
      },
    });
    navigate('/cms_partials');
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
});
