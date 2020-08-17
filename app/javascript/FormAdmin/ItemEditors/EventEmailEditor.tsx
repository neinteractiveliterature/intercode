import React from 'react';

import CommonQuestionFields from './CommonQuestionFields';
import { FormItemEditorProps } from '../FormItemEditorProps';
import { EventEmailFormItem } from '../FormItemUtils';

export type EventEmailEditorProps = FormItemEditorProps<EventEmailFormItem>;
function EventEmailEditor(props: EventEmailEditorProps) {
  return <CommonQuestionFields {...props} />;
}

export default EventEmailEditor;
