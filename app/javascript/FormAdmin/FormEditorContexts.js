import React from 'react';

export const FormEditorContext = React.createContext({
  convention: {},
  form: {},
  renderedFormItemsById: new Map(),
});

export const FormSectionEditorContext = React.createContext({
  currentSection: null,
});

export const FormItemEditorContext = React.createContext({
  formItem: {},
  renderedFormItem: {},
  setFormItem: () => {},
});
