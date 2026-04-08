import CommonQuestionFields, { CommonQuestionFieldsProps } from './CommonQuestionFields';
import { FormItemEditorProps } from '../FormItemEditorProps';
import { EventEmailFormItem } from '../FormItemUtils';

export type EventEmailEditorProps = FormItemEditorProps<EventEmailFormItem>;
function EventEmailEditor(props: EventEmailEditorProps): React.JSX.Element {
  return <CommonQuestionFields {...(props as CommonQuestionFieldsProps)} />;
}

export default EventEmailEditor;
