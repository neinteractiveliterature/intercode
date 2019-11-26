import React, { useContext } from 'react';

import StaticTextEditor from './ItemEditors/StaticTextEditor';
import FreeTextEditor from './ItemEditors/FreeTextEditor';
import DateEditor from './ItemEditors/DateEditor';
import AgeRestrictionsEditor from './ItemEditors/AgeRestrictionsEditor';
import EventEmailEditor from './ItemEditors/EventEmailEditor';
import TimespanEditor from './ItemEditors/TimespanEditor';
import MultipleChoiceEditor from './ItemEditors/MultipleChoiceEditor';
import TimeblockPreferenceEditor from './ItemEditors/TimeblockPreferenceEditor';
import RegistrationPolicyItemEditor from './ItemEditors/RegistrationPolicyItemEditor';
import { FormItemEditorContext } from './FormEditorContexts';

function FormItemEditorContent() {
  const { formItem } = useContext(FormItemEditorContext);

  switch (formItem.item_type) {
    case 'age_restrictions':
      return <AgeRestrictionsEditor />;
    case 'date':
      return <DateEditor />;
    case 'event_email':
      return <EventEmailEditor />;
    case 'free_text':
      return <FreeTextEditor />;
    case 'multiple_choice':
      return <MultipleChoiceEditor />;
    case 'registration_policy':
      return <RegistrationPolicyItemEditor />;
    case 'static_text':
      return <StaticTextEditor />;
    case 'timeblock_preference':
      return <TimeblockPreferenceEditor />;
    case 'timespan':
      return <TimespanEditor />;
    default:
      return null;
  }
}

export default FormItemEditorContent;
