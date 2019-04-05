import React from 'react';
import PropTypes from 'prop-types';
import Form from '../Models/Form';
import { SectionTraversalProvider } from './SectionTraversalContext';
import { useItemInteractionTracking, ItemInteractionProvider } from './ItemInteractionTracker';

const FormPresenterApp = ({ form, children }) => {
  const { interactWithItem, hasInteractedWithItem } = useItemInteractionTracking();

  return (
    <SectionTraversalProvider form={form}>
      <ItemInteractionProvider
        interactWithItem={interactWithItem}
        hasInteractedWithItem={hasInteractedWithItem}
      >
        {children}
      </ItemInteractionProvider>
    </SectionTraversalProvider>
  );
};

FormPresenterApp.propTypes = {
  form: Form.propType.isRequired,
  children: PropTypes.node.isRequired,
};

export default FormPresenterApp;
