import { useState } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { BootstrapFormInput, ErrorDisplay } from '@neinteractiveliterature/litform';

import SelectWithLabel from '../BuiltInFormControls/SelectWithLabel';
import usePageTitle from '../usePageTitle';
import { RootSiteAdminQueryDocument } from './queries.generated';
import { data, useActionData, useLoaderData, useNavigation } from 'react-router';
import { apolloClientContext } from 'AppContexts';
import { Form } from 'react-router';
import { UpdateRootSiteDocument } from './mutations.generated';
import type { Route } from './+types/EditRootSite';

export const clientAction = async ({ context, request }: Route.ClientActionArgs) => {
  const client = context.get(apolloClientContext);
  try {
    const formData = await request.formData();
    const result = await client.mutate({
      mutation: UpdateRootSiteDocument,
      variables: {
        authLayoutId: formData.get('auth_layout_id')?.toString(),
        defaultLayoutId: formData.get('default_layout_id')?.toString(),
        rootPageId: formData.get('root_page_id')?.toString(),
        siteName: formData.get('site_name')?.toString(),
      },
    });
    return data(result.data);
  } catch (error) {
    return error;
  }
};

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

export const clientLoader = async ({ context }: Route.ClientLoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: RootSiteAdminQueryDocument, errorPolicy: 'none' });
  return data;
};

function EditRootSite() {
  const data = useLoaderData<typeof clientLoader>();
  const actionData = useActionData<typeof clientAction>();
  const error = actionData instanceof Error ? actionData : undefined;
  const navigation = useNavigation();
  const updateInProgress = navigation.state !== 'idle';
  const { t } = useTranslation();

  const [edited, setEdited] = useState(false);
  const [success, setSuccess] = useState(false);
  const setDirty = () => {
    setSuccess(false);
    setEdited(true);
  };

  const [siteName, setSiteName] = useDirtyState(data.rootSite.site_name, setDirty);
  const [authLayout, setAuthLayout] = useDirtyState(data.rootSite.auth_layout, setDirty);
  const [defaultLayout, setDefaultLayout] = useDirtyState(data.rootSite.defaultLayout, setDirty);
  const [rootPage, setRootPage] = useDirtyState(data.rootSite.rootPage, setDirty);

  if (navigation.state === 'idle' && actionData != null && !error) {
    setSuccess(true);
    setEdited(false);
  }

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
        onChange={(newValue) => newValue && setDefaultLayout(newValue)}
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
        onChange={(newValue) => newValue && setRootPage(newValue)}
        isDisabled={updateInProgress}
      />

      <SelectWithLabel
        name="auth_layout_id"
        label={t('rootSiteAdmin.editRootSite.authLayoutLabel')}
        helpText={t('rootSiteAdmin.editRootSite.authLayoutHelpText')}
        value={authLayout}
        isClearable
        getOptionValue={(option) => option.id.toString()}
        getOptionLabel={(option) => option.name ?? ''}
        options={data.rootSite.cmsLayouts}
        onChange={(newValue) => setAuthLayout(newValue ?? null)}
        isDisabled={updateInProgress}
      />

      <ErrorDisplay graphQLError={error} />

      <button className="btn btn-primary" type="submit" disabled={!edited || updateInProgress}>
        Save changes
      </button>

      {success ? <span className="text-success ms-2">{t('buttons.saved')}</span> : null}
    </Form>
  );
}

export default EditRootSite;
