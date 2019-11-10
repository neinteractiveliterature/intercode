import React from 'react';

import FormSectionNav from './FormSectionNav';
import FormSectionEditorContent from './FormSectionEditorContent';

function FormSectionEditorLayout() {
  return (
    <div className="row m-0">
      <nav className="col-3 bg-light p-2">
        <FormSectionNav />
      </nav>
      <div className="col p-2 border overflow-auto" style={{ height: '90vh' }}>
        <FormSectionEditorContent />
      </div>
    </div>
  );
}

export default FormSectionEditorLayout;
