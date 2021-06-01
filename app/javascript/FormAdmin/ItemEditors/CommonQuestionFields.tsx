import { useContext } from 'react';
import { BootstrapFormInput, BooleanInput , useModal } from '@neinteractiveliterature/litform';


import {
  formItemPropertyUpdater,
  TypedFormItem,
  WithRequiredProperties,
  CommonQuestionProperties,
  ParsedFormItem,
} from '../FormItemUtils';
import DefaultAnswerModal from './DefaultAnswerModal';
import { FormEditorContext, FormItemEditorContext } from '../FormEditorContexts';
import FormItemIdentifierInput from './FormItemIdentifierInput';
import { FormItemEditorProps } from '../FormItemEditorProps';

export type CommonQuestionFieldsProps = FormItemEditorProps<TypedFormItem>;

type CommonQuestionFieldsFormItem = CommonQuestionFieldsProps['formItem'];
type QuestionFormItem = WithRequiredProperties<
  ParsedFormItem<CommonQuestionProperties, any, CommonQuestionFieldsFormItem['item_type']>
>;

function formItemIsQuestion(formItem: CommonQuestionFieldsFormItem): formItem is QuestionFormItem {
  return formItem.item_type !== 'static_text';
}

function CommonQuestionFields({ formItem, setFormItem }: CommonQuestionFieldsProps) {
  const { formType } = useContext(FormEditorContext);
  const { standardItem } = useContext(FormItemEditorContext);
  const defaultAnswerModal = useModal();

  return (
    <div>
      <DefaultAnswerModal
        formItem={formItem}
        setFormItem={setFormItem}
        close={defaultAnswerModal.close}
        visible={defaultAnswerModal.visible}
      />
      {formItemIsQuestion(formItem) && !standardItem && (
        <FormItemIdentifierInput
          value={formItem.identifier ?? undefined}
          onChange={(identifier) =>
            setFormItem((prevFormItem) => ({ ...prevFormItem, identifier }))
          }
          formType={formType}
        />
      )}
      {formItemIsQuestion(formItem) &&
        (standardItem && standardItem.required ? (
          <div className="small mb-2">Response always required</div>
        ) : (
          <BooleanInput
            caption="Response required?"
            value={!!formItem.properties.required}
            onChange={formItemPropertyUpdater<QuestionFormItem, 'required'>(
              'required',
              setFormItem,
            )}
          />
        ))}
      <BootstrapFormInput
        label="Admin description"
        helpText="The name for this item in admin-facing reports.  If blank, the caption of the item will be used."
        value={formItem.admin_description ?? ''}
        onTextChange={(value) =>
          setFormItem((prevFormItem) => ({
            ...prevFormItem,
            admin_description: value,
          }))
        }
      />
      <BootstrapFormInput
        label="Public description"
        helpText="The name for this item in public-facing views.  If blank, the item will not appear in public-facing views."
        value={formItem.public_description ?? ''}
        onTextChange={(value) =>
          setFormItem((prevFormItem) => ({
            ...prevFormItem,
            public_description: value,
          }))
        }
      />
      <button type="button" className="btn btn-secondary" onClick={defaultAnswerModal.open}>
        {formItem.default_value ? 'Edit default answer' : 'Add default answer'}
      </button>
    </div>
  );
}

export default CommonQuestionFields;
