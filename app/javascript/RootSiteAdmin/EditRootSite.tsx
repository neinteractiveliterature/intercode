import { useEffect, useState } from 'react';
import * as React from 'react';
import { ApolloError } from '@apollo/client';
import { BootstrapFormInput, ErrorDisplay } from '@neinteractiveliterature/litform';

import SelectWithLabel from '../BuiltInFormControls/SelectWithLabel';
import usePageTitle from '../usePageTitle';
import { RootSiteAdminQueryData, RootSiteAdminQueryDocument } from './queries.generated';
import { ActionFunction, json, LoaderFunction, useActionData, useLoaderData, useNavigation } from 'react-router';
import { client } from '../useIntercodeApolloClient';
import { Form } from 'react-router';
import { UpdateRootSiteDocument } from './mutations.generated';

export async function action({ request }) {
  try {
    const formData = await request.formData();
    const { data } = await client.mutate({
      mutation: UpdateRootSiteDocument,
      variables: {
        defaultLayoutId: formData.get('default_layout_id')?.toString(),
        rootPageId: formData.get('root_page_id')?.toString(),
        siteName: formData.get('site_name')?.toString(),
      },
    });
    return json(data);
  } catch (error) {
    return error;
  }
}

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

export async function loader() {
  const { data } = await client.query<RootSiteAdminQueryData>({ query: RootSiteAdminQueryDocument });
  return data;
}

function EditRootSite() {
  const data = useLoaderData() as RootSiteAdminQueryData;
  const actionData = useActionData();
  const error = actionData instanceof Error ? actionData : undefined;
  const navigation = useNavigation();
  const updateInProgress = navigation.state !== 'idle';

  const [edited, setEdited] = useState(false);
  const [success, setSuccess] = useState(false);
  const setDirty = () => {
    setSuccess(false);
    setEdited(true);
  };

  const [siteName, setSiteName] = useDirtyState(data.rootSite.site_name, setDirty);
  const [defaultLayout, setDefaultLayout] = useDirtyState(data.rootSite.defaultLayout, setDirty);
  const [rootPage, setRootPage] = useDirtyState(data.rootSite.rootPage, setDirty);

  useEffect(() => {
    if (navigation.state === 'idle' && actionData != null && !error) {
      setSuccess(true);
      setEdited(false);
    }
  }, [actionData, error, navigation.state]);

  usePageTitle('Root Site Settings');

  return (
    <Form method="PATCH">
      <BootstrapFormInput
        name="site_name"
        label="Site name"
        helpText="This will show on the left side of the navigation bar"
        value={siteName}
        onTextChange={setSiteName}
        disabled={updateInProgress}
      />

      <SelectWithLabel
        name="default_layout_id"
        label="Default layout for pages"
        value={defaultLayout}
        isClearable
        getOptionValue={(option) => option.id.toString()}
        getOptionLabel={(option) => option.name ?? ''}
        options={data.rootSite.cmsLayouts}
        onChange={(newValue: (typeof data)['rootSite']['cmsLayouts'][0]) => setDefaultLayout(newValue)}
        isDisabled={updateInProgress}
      />

      <SelectWithLabel
        name="root_page_id"
        label="Root page"
        value={rootPage}
        isClearable
        getOptionValue={(option) => option.id.toString()}
        getOptionLabel={(option) => option.name ?? ''}
        options={data.rootSite.cmsPages}
        onChange={(newValue: (typeof data)['rootSite']['rootPage']) => setRootPage(newValue)}
        isDisabled={updateInProgress}
      />

      <ErrorDisplay graphQLError={error as ApolloError} />

      <button className="btn btn-primary" type="submit" disabled={!edited || updateInProgress}>
        Save changes
      </button>

      {success ? ' Saved!' : null}
    </Form>
  );
}

export default EditRootSite;
