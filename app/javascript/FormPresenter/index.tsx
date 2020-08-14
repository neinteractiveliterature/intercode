import React, { ReactNode } from 'react';
import { SectionTraversalProvider } from './SectionTraversalContext';
import {
  useItemInteractionTracking,
  ItemInteractionTrackerContext,
} from './ItemInteractionTracker';
import { CommonFormFieldsFragment } from '../Models/commonFormFragments.generated';

export type FormPresenterAppProps = {
  form: CommonFormFieldsFragment;
  children: ReactNode;
};

const FormPresenterApp = ({ form, children }: FormPresenterAppProps) => {
  const itemInteractionProps = useItemInteractionTracking();

  return (
    <SectionTraversalProvider form={form}>
      <ItemInteractionTrackerContext.Provider value={itemInteractionProps}>
        {children}
      </ItemInteractionTrackerContext.Provider>
    </SectionTraversalProvider>
  );
};

export default FormPresenterApp;
