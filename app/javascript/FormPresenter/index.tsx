import { ReactNode } from 'react';
import { SectionTraversalProvider } from './SectionTraversalContext';
import { useItemInteractionTracking, ItemInteractionTrackerContext } from './ItemInteractionTracker';
import { CommonFormFieldsFragment } from '../Models/commonFormFragments.generated';

export type FormPresenterAppProps = {
  form: CommonFormFieldsFragment;
  children: ReactNode;
};

export default function FormPresenterApp({ form, children }: FormPresenterAppProps): React.JSX.Element {
  const itemInteractionProps = useItemInteractionTracking();

  return (
    <SectionTraversalProvider form={form}>
      <ItemInteractionTrackerContext.Provider value={itemInteractionProps}>
        {children}
      </ItemInteractionTrackerContext.Provider>
    </SectionTraversalProvider>
  );
}
