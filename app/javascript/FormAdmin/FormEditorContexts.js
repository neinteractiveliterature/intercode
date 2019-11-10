import React from 'react';

export const FormEditorContext = React.createContext({
  convention: {},
  currentSection: null,
  form: {},
  formType: {},
  renderedFormItemsById: new Map(),
});

export const FormItemEditorContext = React.createContext({
  formItem: {},
  renderedFormItem: {},
  setFormItem: () => {},
  standardItem: null,
});
