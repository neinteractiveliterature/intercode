import { useState, useContext } from 'react';
import { Modal } from 'react-bootstrap4-modal';

import FormItemInput from '../../FormPresenter/ItemInputs/FormItemInput';
import { FormItemEditorContext, FormEditorContext } from '../FormEditorContexts';
import { FormItemEditorProps } from '../FormItemEditorProps';
import { TypedFormItem } from '../FormItemUtils';

export type DefaultAnswerModalProps<FormItemType extends TypedFormItem> = FormItemEditorProps<FormItemType> & {
  close: () => void;
  visible: boolean;
};

function DefaultAnswerModal<FormItemType extends TypedFormItem>({
  close,
  visible,
  formItem,
  setFormItem,
}: DefaultAnswerModalProps<FormItemType>): React.JSX.Element {
  const { convention, formTypeIdentifier } = useContext(FormEditorContext);
  const { previewFormItem } = useContext(FormItemEditorContext);
  const [defaultValue, setDefaultValue] = useState<FormItemType['default_value']>(formItem.default_value);
  const inputChanged = (identifier: string, newValue: typeof defaultValue) => setDefaultValue(newValue);

  const setDefaultAnswer = () => {
    setFormItem({ ...formItem, default_value: defaultValue });
    close();
  };

  const clearDefaultAnswer = () => {
    setFormItem({ ...formItem, default_value: undefined });
    close();
  };

  return (
    <Modal visible={visible} dialogClassName="modal-lg">
      <div className="modal-header">Change default answer</div>
      <div className="modal-body">
        {previewFormItem && (
          <FormItemInput
            convention={convention}
            formItem={previewFormItem}
            formTypeIdentifier={formTypeIdentifier}
            onInteract={() => {}}
            value={defaultValue}
            onChange={inputChanged}
            valueInvalid={false}
          />
        )}
      </div>
      <div className="modal-footer">
        <div className="flex-grow-1">
          <button type="button" className="btn btn-warning" onClick={clearDefaultAnswer}>
            Clear default answer
          </button>
        </div>
        <div>
          <button type="button" className="btn btn-secondary me-2" onClick={close}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={setDefaultAnswer}>
            Set default answer
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DefaultAnswerModal;
