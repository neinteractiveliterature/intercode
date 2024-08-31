import React, { useCallback, useMemo, useState } from 'react';
import { TabList, TabBody, useTabsWithRouter, ErrorDisplay } from '@neinteractiveliterature/litform';

import { ApolloError } from '@apollo/client';
import { useNavigate, useLocation, useNavigation } from 'react-router-dom';
import ConventionFormGeneralSection from './ConventionFormGeneralSection';
import ConventionFormWebsiteSection from './ConventionFormWebsiteSection';
import ConventionFormBillingSection from './ConventionFormBillingSection';
import ConventionFormEventsSection from './ConventionFormEventsSection';
import useAsyncFunction from '../useAsyncFunction';
import ConventionFormEmailSection from './ConventionFormEmailSection';
import { ConventionAdminConventionQueryData } from './queries.generated';

export type ConventionFormConvention = ConventionAdminConventionQueryData['convention'];

export type ConventionFormProps = {
  initialConvention: ConventionFormConvention;
  saveConvention: (
    convention: ConventionFormConvention,
    openGraphImage: File | null | undefined,
    favicon: File | null | undefined,
  ) => Promise<void>;
  cmsLayouts: ConventionAdminConventionQueryData['convention']['cmsLayouts'];
  pages: ConventionAdminConventionQueryData['convention']['cmsPages'];
  rootSite: ConventionAdminConventionQueryData['rootSite'];
};

function ConventionForm({
  initialConvention,
  cmsLayouts,
  pages,
  saveConvention,
  rootSite,
}: ConventionFormProps): JSX.Element {
  const [convention, setConvention] = useState(initialConvention);
  const [save, saveError, saveInProgress] = useAsyncFunction(saveConvention);
  const [openGraphImage, setOpenGraphImage] = useState<File | null | undefined>();
  const [favicon, setFavicon] = useState<File | null | undefined>();

  const onClickSave = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      save(convention, openGraphImage, favicon);
    },
    [convention, save, openGraphImage, favicon],
  );

  const commonProps = { convention, setConvention, disabled: saveInProgress };

  const tabs = [
    {
      id: 'general',
      name: 'General',
      renderContent: () => <ConventionFormGeneralSection {...commonProps} />,
    },
    {
      id: 'website',
      name: 'Website',
      renderContent: () => (
        <ConventionFormWebsiteSection
          {...commonProps}
          cmsLayouts={cmsLayouts}
          pages={pages}
          rootSite={rootSite}
          openGraphImage={openGraphImage}
          setOpenGraphImage={setOpenGraphImage}
          favicon={favicon}
          setFavicon={setFavicon}
        />
      ),
    },
    {
      id: 'email',
      name: 'Email',
      renderContent: () => (
        <ConventionFormEmailSection {...commonProps} staffPositions={initialConvention.staff_positions} />
      ),
    },
    {
      id: 'payments',
      name: 'Payments',
      renderContent: () => <ConventionFormBillingSection {...commonProps} />,
    },
    {
      id: 'events',
      name: 'Events',
      renderContent: () => <ConventionFormEventsSection {...commonProps} />,
    },
  ];

  const location = useLocation();
  const navigate = useNavigate();
  const fakeHistory = useMemo(() => ({ replace: navigate }), [navigate]);
  const tabProps = useTabsWithRouter(tabs, '/convention/edit', location, fakeHistory);
  const navigation = useNavigation();

  return (
    <form>
      <TabList {...tabProps} />

      <div className="pt-3 pb-2 px-3 border border-top-0 mb-4">
        <TabBody {...tabProps} />
      </div>

      <ErrorDisplay graphQLError={saveError as ApolloError} />

      <button className="btn btn-primary" onClick={onClickSave} type="button" disabled={navigation.state !== 'idle'}>
        Save settings
      </button>
    </form>
  );
}

export default ConventionForm;
