import { useState } from 'react';
import * as React from 'react';
import { ApolloError } from '@apollo/client';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import ErrorDisplay from '../ErrorDisplay';
import SelectWithLabel from '../BuiltInFormControls/SelectWithLabel';
import useAsyncFunction from '../useAsyncFunction';
import usePageTitle from '../usePageTitle';
import { LoadQueryWrapper } from '../GraphqlLoadingWrappers';
import { useRootSiteAdminQuery } from './queries.generated';
import { useUpdateRootSiteMutation } from './mutations.generated';

function useDirtyState<T>(initialState: T, setDirty: () => void) {
  const [value, setValue] = useState(initialState);
  return [
    value,
    (newValue: React.SetStateAction<T>) => {
      setValue(newValue);
      setDirty();
    },
  ] as const;
}

export default LoadQueryWrapper(useRootSiteAdminQuery, function EditRootSite({ data }) {
  const [updateMutate] = useUpdateRootSiteMutation();
  const [update, updateError, updateInProgress] = useAsyncFunction(updateMutate);

  const [edited, setEdited] = useState(false);
  const [success, setSuccess] = useState(false);
  const setDirty = () => {
    setSuccess(false);
    setEdited(true);
  };

  const [siteName, setSiteName] = useDirtyState(data.rootSite.site_name, setDirty);
  const [defaultLayout, setDefaultLayout] = useDirtyState(data.rootSite.default_layout, setDirty);
  const [rootPage, setRootPage] = useDirtyState(data.rootSite.root_page, setDirty);

  usePageTitle('Root Site Settings');

  const saveClicked = async () => {
    setSuccess(false);

    await update({
      variables: {
        siteName,
        rootPageId: rootPage.id,
        defaultLayoutId: defaultLayout.id,
      },
    });

    setSuccess(true);
    setEdited(false);
  };

  return (
    <>
      <BootstrapFormInput
        name="site_name"
        label="Site name"
        helpText="This will show on the left side of the navigation bar"
        value={siteName}
        onTextChange={setSiteName}
      />

      <SelectWithLabel
        name="default_layout_id"
        label="Default layout for pages"
        value={defaultLayout}
        isClearable
        getOptionValue={(option) => option.id.toString()}
        getOptionLabel={(option) => option.name ?? ''}
        options={data.cmsLayouts}
        onChange={(newValue: typeof data['cmsLayouts'][0]) => setDefaultLayout(newValue)}
        disabled={updateInProgress}
      />

      <SelectWithLabel
        name="root_page_id"
        label="Root page"
        value={rootPage}
        isClearable
        getOptionValue={(option) => option.id.toString()}
        getOptionLabel={(option) => option.name ?? ''}
        options={data.cmsPages}
        onChange={(newValue: typeof data['rootSite']['root_page']) => setRootPage(newValue)}
        disabled={updateInProgress}
      />

      <ErrorDisplay graphQLError={updateError as ApolloError} />

      <button
        className="btn btn-primary"
        type="button"
        disabled={!edited || updateInProgress}
        onClick={saveClicked}
      >
        Save changes
      </button>

      {success ? ' Saved!' : null}
    </>
  );
});
