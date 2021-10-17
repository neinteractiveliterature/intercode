import CommonQuestionFields from './CommonQuestionFields';
import { FormItemEditorProps } from '../FormItemEditorProps';
import { EventEmailFormItem } from '../FormItemUtils';

export type EventEmailEditorProps = FormItemEditorProps<EventEmailFormItem>;
function EventEmailEditor(props: EventEmailEditorProps): JSX.Element {
  return <CommonQuestionFields {...props} />;
}

export default EventEmailEditor;
