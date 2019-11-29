import React, { useState } from 'react';
import { useMutation } from 'react-apollo-hooks';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import ErrorDisplay from '../ErrorDisplay';
import { RootSiteAdminQuery } from './queries.gql';
import SelectWithLabel from '../BuiltInFormControls/SelectWithLabel';
import { UpdateRootSite } from './mutations.gql';
import useQuerySuspended from '../useQuerySuspended';
import useAsyncFunction from '../useAsyncFunction';
import usePageTitle from '../usePageTitle';

function useDirtyState(initialState, setDirty) {
  const [value, setValue] = useState(initialState);
  return [value, (newValue) => {
    setValue(newValue);
    setDirty();
  }];
}

function EditRootSite() {
  const { data, error } = useQuerySuspended(RootSiteAdminQuery);
  const [updateMutate] = useMutation(UpdateRootSite);
  const [update, updateError, updateInProgress] = useAsyncFunction(updateMutate);

  const [edited, setEdited] = useState(false);
  const [success, setSuccess] = useState(false);
  const setDirty = () => {
    setSuccess(false);
    setEdited(true);
  };

  const [siteName, setSiteName] = useDirtyState(error ? null : data.rootSite.site_name, setDirty);
  const [defaultLayout, setDefaultLayout] = useDirtyState(
    error ? null : data.rootSite.default_layout,
    setDirty,
  );
  const [rootPage, setRootPage] = useDirtyState(error ? null : data.rootSite.root_page, setDirty);

  usePageTitle('Root Site Settings');

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

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
        getOptionValue={(option) => option.id}
        getOptionLabel={(option) => option.name}
        options={data.cmsLayouts}
        onChange={setDefaultLayout}
        disabled={updateInProgress}
      />

      <SelectWithLabel
        name="root_page_id"
        label="Root page"
        value={rootPage}
        isClearable
        getOptionValue={(option) => option.id}
        getOptionLabel={(option) => option.name}
        options={data.cmsPages}
        onChange={setRootPage}
        disabled={updateInProgress}
      />

      <ErrorDisplay graphQLError={updateError} />

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
}

export default EditRootSite;
