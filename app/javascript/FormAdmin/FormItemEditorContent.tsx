import { useContext } from 'react';
import { assertNever } from 'assert-never';

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

function FormItemEditorContent(): JSX.Element {
  const { formItem, setFormItem } = useContext(FormItemEditorContext);

  switch (formItem.item_type) {
    case 'age_restrictions':
      return <AgeRestrictionsEditor formItem={formItem} setFormItem={setFormItem} />;
    case 'date':
      return <DateEditor formItem={formItem} setFormItem={setFormItem} />;
    case 'event_email':
      return <EventEmailEditor formItem={formItem} setFormItem={setFormItem} />;
    case 'free_text':
      return <FreeTextEditor formItem={formItem} setFormItem={setFormItem} />;
    case 'multiple_choice':
      return <MultipleChoiceEditor formItem={formItem} setFormItem={setFormItem} />;
    case 'registration_policy':
      return <RegistrationPolicyItemEditor formItem={formItem} setFormItem={setFormItem} />;
    case 'static_text':
      return <StaticTextEditor formItem={formItem} setFormItem={setFormItem} />;
    case 'timeblock_preference':
      return <TimeblockPreferenceEditor formItem={formItem} setFormItem={setFormItem} />;
    case 'timespan':
      return <TimespanEditor formItem={formItem} setFormItem={setFormItem} />;
    default:
      assertNever(formItem, true);
      Rollbar?.warn(`Unknown form item type: ${formItem.item_type}`);
      return <></>;
  }
}

export default FormItemEditorContent;
