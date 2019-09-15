import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Form from '../Models/Form';

export const SectionTraversalContext = React.createContext({
  currentSection: null,
  currentSectionId: null,
  currentSectionIndex: null,
  hasNextSection: false,
  hasPreviousSection: false,
  nextSection: () => {},
  previousSection: () => {},
  sectionCount: 0,
});

export function SectionTraversalProvider({ form, children }) {
  const [currentSectionId, setCurrentSectionId] = useState((form.getSections()[0] || {}).id);

  const sectionCount = form.getSections().length;
  const currentSectionIndex = form.getSectionIndex(currentSectionId);

  const setCurrentSectionIndex = useCallback(
    (newSectionIndex) => {
      setCurrentSectionId(form.getSections()[newSectionIndex].id);
    },
    [form],
  );

  const addToSectionIndex = useCallback(
    (offset, limiter) => {
      const newSectionIndex = limiter(currentSectionIndex + offset);
      setCurrentSectionIndex(newSectionIndex);
    },
    [currentSectionIndex, setCurrentSectionIndex],
  );

  const previousSection = useCallback(
    () => {
      addToSectionIndex(
        -1,
        (newSectionIndex) => Math.max(newSectionIndex, 0),
      );
    },
    [addToSectionIndex],
  );

  const nextSection = useCallback(
    () => {
      const maxSectionIndex = sectionCount - 1;

      addToSectionIndex(
        1,
        (newSectionIndex) => Math.min(newSectionIndex, maxSectionIndex),
      );
    },
    [sectionCount, addToSectionIndex],
  );

  return (
    <SectionTraversalContext.Provider
      value={{
        currentSection: form.getSection(currentSectionId),
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

SectionTraversalProvider.propTypes = {
  form: Form.propType.isRequired,
  children: PropTypes.node.isRequired,
};
