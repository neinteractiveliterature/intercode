import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { DndProvider } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';

import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import useUniqueId from '../../useUniqueId';
import { formItemPropertyUpdater } from '../FormItemUtils';
import CommonQuestionFields from './CommonQuestionFields';
import MultipleChoiceInput from '../../BuiltInFormControls/MultipleChoiceInput';
import BootstrapFormCheckbox from '../../BuiltInFormControls/BootstrapFormCheckbox';
import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';
import MultipleChoiceOptionRow from './MultipleChoiceOptionRow';
import { FormItemEditorContext } from '../FormEditorContexts';
import useArrayProperty from './useArrayProperty';

function MultipleChoiceEditor({ disabled }) {
  const { formItem, setFormItem } = useContext(FormItemEditorContext);
  const captionInputId = useUniqueId('multiple-choice-caption-');
  const generateNewChoice = () => ({ caption: '', value: '' });

  const [addChoice, choiceChanged, deleteChoice, moveChoice] = useArrayProperty(
    'choices', setFormItem, generateNewChoice,
  );

  return (
    <>
      <CommonQuestionFields />
      <div className="form-group">
        <label htmlFor={captionInputId} className="form-item-label">
          Caption
        </label>
        <LiquidInput
          id={captionInputId}
          disabled={disabled}
          lines={2}
          disablePreview
          value={formItem.properties.caption || ''}
          onChange={formItemPropertyUpdater('caption', setFormItem)}
        />

        <MultipleChoiceInput
          caption="Style"
          choices={[
            { label: 'Single select, vertical layout', value: 'radio_vertical' },
            { label: 'Single select, horizontal layout', value: 'radio_horizontal' },
            { label: 'Multi-select, vertical layout', value: 'checkbox_vertical' },
            { label: 'Multi-select, horizontal layout', value: 'checkbox_horizontal' },
          ]}
          value={formItem.properties.style}
          onChange={formItemPropertyUpdater('style', setFormItem)}
        />

        <table className="table">
          <thead>
            <tr>
              <th />
              <th>Option text</th>
              <th>Output value</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <DndProvider backend={MultiBackend} options={HTML5toTouch}>
              {formItem.properties.choices.map((choice, index) => (
                <MultipleChoiceOptionRow
                  key={choice.generatedId}
                  choice={choice}
                  index={index}
                  deleteChoice={deleteChoice}
                  choiceChanged={choiceChanged}
                  moveChoice={moveChoice}
                  nonUnique={formItem.properties.choices
                    .filter((c) => c.value === choice.value).length > 1}
                />
              ))}
            </DndProvider>
          </tbody>
          <tfoot>
            <tr>
              <td />
              <td colSpan={3}>
                <button type="button" className="btn btn-outline-primary btn-sm" onClick={addChoice}>
                  <i className="fa fa-plus" />
                  {' '}
                  Add option
                </button>
              </td>
            </tr>
          </tfoot>
        </table>

        <fieldset>
          <legend className="col-form-label">“Other” option</legend>
          <div className="form-row">
            <div className="col-3">
              <BootstrapFormCheckbox
                label="Include?"
                checked={!!formItem.properties.other}
                onCheckedChange={formItemPropertyUpdater('other', setFormItem)}
              />
            </div>
            <div className="col">
              <BootstrapFormInput
                label="“Other” option text"
                disabled={!formItem.properties.other}
                value={formItem.properties.other_caption || ''}
                onTextChange={formItemPropertyUpdater('other_caption', setFormItem)}
              />
            </div>
          </div>
        </fieldset>
      </div>
    </>
  );
}

MultipleChoiceEditor.propTypes = {
  disabled: PropTypes.bool,
};

MultipleChoiceEditor.defaultProps = {
  disabled: false,
};

export default MultipleChoiceEditor;
