import { useContext } from 'react';
import { assertNever } from 'assert-never';
import AgeRestrictionsEditor from 'FormAdmin/ItemEditors/AgeRestrictionsEditor';
import DateEditor from 'FormAdmin/ItemEditors/DateEditor';
import EventEmailEditor from 'FormAdmin/ItemEditors/EventEmailEditor';
import { FormItemEditorContext } from 'FormAdmin/FormEditorContexts';
import FreeTextEditor from 'FormAdmin/ItemEditors/FreeTextEditor';
import MultipleChoiceEditor from 'FormAdmin/ItemEditors/MultipleChoiceEditor';
import RegistrationPolicyItemEditor from 'FormAdmin/ItemEditors/RegistrationPolicyItemEditor';
import StaticTextEditor from 'FormAdmin/ItemEditors/StaticTextEditor';
import TimeblockPreferenceEditor from 'FormAdmin/ItemEditors/TimeblockPreferenceEditor';
import TimespanEditor from 'FormAdmin/ItemEditors/TimespanEditor';
import errorReporting from 'ErrorReporting';

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
      errorReporting().warning(`Unknown form item type: ${formItem.item_type}`);
      return <></>;
  }
}

export default FormItemEditorContent;
