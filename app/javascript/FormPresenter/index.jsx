import React from 'react';
import PropTypes from 'prop-types';
import Form from '../Models/Form';
import { SectionTraversalProvider } from './SectionTraversalContext';
import { useItemInteractionTracking, ItemInteractionTrackerContext } from './ItemInteractionTracker';

const FormPresenterApp = ({ form, children }) => {
  const itemInteractionProps = useItemInteractionTracking();

  return (
    <SectionTraversalProvider form={form}>
      <ItemInteractionTrackerContext.Provider value={itemInteractionProps}>
        {children}
      </ItemInteractionTrackerContext.Provider>
    </SectionTraversalProvider>
  );
};

FormPresenterApp.propTypes = {
  form: Form.propType.isRequired,
  children: PropTypes.node.isRequired,
};

export default FormPresenterApp;
