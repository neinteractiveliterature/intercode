import { useCallback, useState } from 'react';

import { ApolloError } from '@apollo/client';
import ConventionFormGeneralSection from './ConventionFormGeneralSection';
import ConventionFormWebsiteSection from './ConventionFormWebsiteSection';
import ConventionFormBillingSection from './ConventionFormBillingSection';
import ConventionFormEventsSection from './ConventionFormEventsSection';
import { TabList, TabBody, useTabsWithRouter } from '../UIComponents/Tabs';
import useAsyncFunction from '../useAsyncFunction';
import ErrorDisplay from '../ErrorDisplay';
import { EditingScheduledValue } from '../BuiltInFormControls/ScheduledValueEditor';
import ConventionFormEmailSection from './ConventionFormEmailSection';
import { ConventionAdminConventionQueryData } from './queries.generated';
import { MaximumEventSignupsValue } from './MaximumEventSignupsPreview';

export type ConventionFormConvention = Omit<
  ConventionAdminConventionQueryData['convention'],
  'maximum_event_signups'
> & {
  maximum_event_signups: EditingScheduledValue<MaximumEventSignupsValue>;
};

export type ConventionFormProps = {
  initialConvention: ConventionFormConvention;
  saveConvention: (convention: ConventionFormConvention) => Promise<void>;
  cmsLayouts: ConventionAdminConventionQueryData['convention']['cms_layouts'];
  pages: ConventionAdminConventionQueryData['convention']['pages'];
  rootSite: ConventionAdminConventionQueryData['rootSite'];
};

function ConventionForm({
  initialConvention,
  cmsLayouts,
  pages,
  saveConvention,
  rootSite,
}: ConventionFormProps) {
  const [convention, setConvention] = useState(initialConvention);
  const [save, saveError, saveInProgress] = useAsyncFunction(saveConvention);

  const onClickSave = useCallback(
    (event) => {
      event.preventDefault();
      save(convention);
    },
    [convention, save],
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
        />
      ),
    },
    {
      id: 'email',
      name: 'Email',
      renderContent: () => (
        <ConventionFormEmailSection
          {...commonProps}
          staffPositions={initialConvention.staff_positions}
        />
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

  const tabProps = useTabsWithRouter(tabs, '/convention/edit');

  return (
    <form>
      <TabList {...tabProps} />

      <div className="pt-3 pb-2 px-3 border border-top-0 mb-4">
        <TabBody {...tabProps} />
      </div>

      <ErrorDisplay graphQLError={saveError as ApolloError} />

      <button className="btn btn-primary" onClick={onClickSave} type="button">
        Save settings
      </button>
    </form>
  );
}

export default ConventionForm;
