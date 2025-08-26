import { createContext, useState, useCallback, ReactNode, useMemo } from 'react';
import findIndex from 'lodash/findIndex';
import keyBy from 'lodash/keyBy';
import { getSortedFormSections } from '../Models/Form';
import { CommonFormSectionFieldsFragment, CommonFormFieldsFragment } from '../Models/commonFormFragments.generated';

export type SectionTraversalContextValue = {
  currentSection?: CommonFormSectionFieldsFragment;
  currentSectionId?: string;
  currentSectionIndex?: number;
  hasNextSection: boolean;
  hasPreviousSection: boolean;
  nextSection: () => void;
  previousSection: () => void;
  sectionCount: number;
};

export const SectionTraversalContext = createContext<SectionTraversalContextValue>({
  currentSection: undefined,
  currentSectionId: undefined,
  currentSectionIndex: undefined,
  hasNextSection: false,
  hasPreviousSection: false,
  nextSection: () => {},
  previousSection: () => {},
  sectionCount: 0,
});

export type SectionTraversalProviderProps = {
  form: CommonFormFieldsFragment;
  children: ReactNode;
};

export function SectionTraversalProvider({ form, children }: SectionTraversalProviderProps): React.JSX.Element {
  const sortedFormSections = useMemo(() => getSortedFormSections(form), [form]);
  const formSectionsById = useMemo(() => keyBy(form.form_sections, (section) => section.id), [form]);
  const [currentSectionId, setCurrentSectionId] = useState(sortedFormSections[0]?.id);

  const sectionCount = sortedFormSections.length;
  const currentSectionIndex = useMemo(
    () => findIndex(sortedFormSections, (section) => section.id === currentSectionId),
    [currentSectionId, sortedFormSections],
  );

  const setCurrentSectionIndex = useCallback(
    (newSectionIndex: number) => {
      setCurrentSectionId(sortedFormSections[newSectionIndex].id);
    },
    [sortedFormSections],
  );

  const addToSectionIndex = useCallback(
    (offset: number, limiter: (n: number) => number) => {
      const newSectionIndex = limiter(currentSectionIndex + offset);
      setCurrentSectionIndex(newSectionIndex);
    },
    [currentSectionIndex, setCurrentSectionIndex],
  );

  const previousSection = useCallback(() => {
    addToSectionIndex(-1, (newSectionIndex) => Math.max(newSectionIndex, 0));
  }, [addToSectionIndex]);

  const nextSection = useCallback(() => {
    const maxSectionIndex = sectionCount - 1;

    addToSectionIndex(1, (newSectionIndex) => Math.min(newSectionIndex, maxSectionIndex));
  }, [sectionCount, addToSectionIndex]);

  return (
    <SectionTraversalContext.Provider
      value={{
        currentSection: formSectionsById[currentSectionId],
        currentSectionId,
        currentSectionIndex,
        hasNextSection: currentSectionIndex < sectionCount - 1,
        hasPreviousSection: currentSectionIndex > 0,
        nextSection,
        previousSection,
        sectionCount,
      }}
    >
      {children}
    </SectionTraversalContext.Provider>
  );
}
