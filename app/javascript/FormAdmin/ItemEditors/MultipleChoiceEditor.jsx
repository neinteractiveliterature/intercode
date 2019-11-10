import React, { useCallback } from 'react';
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
import generateChoiceId from '../generateChoiceId';

function MultipleChoiceEditor({
  convention, form, formItem, onChange, disabled, renderedFormItem,
}) {
  const captionInputId = useUniqueId('multiple-choice-caption-');
  const updateChoices = useCallback(
    (updater) => onChange((prevFormItem) => ({
      ...prevFormItem,
      properties: {
        ...prevFormItem.properties,
        choices: updater(prevFormItem.properties.choices),
      },
    })),
    [onChange],
  );

  const addChoice = useCallback(
    () => {
      updateChoices((prevChoices) => [
        ...prevChoices,
        { caption: '', value: '', generatedId: generateChoiceId() },
      ]);
    },
    [updateChoices],
  );

  const choiceChanged = useCallback(
    (index, newProperties) => {
      updateChoices((prevChoices) => {
        const newChoices = [...prevChoices];
        newChoices.splice(index, 1, { ...newChoices[index], ...newProperties });
        return newChoices;
      });
    },
    [updateChoices],
  );

  const deleteChoice = useCallback(
    (index) => {
      updateChoices((prevChoices) => {
        const newChoices = [...prevChoices];
        newChoices.splice(index, 1);
        return newChoices;
      });
    },
    [updateChoices],
  );

  const swapChoices = useCallback(
    (dragIndex, hoverIndex) => {
      updateChoices((prevChoices) => {
        const newChoices = [...prevChoices];
        const dragChoice = newChoices[dragIndex];
        newChoices.splice(dragIndex, 1);
        newChoices.splice(hoverIndex, 0, dragChoice);
        return newChoices;
      });
    },
    [updateChoices],
  );

  return (
    <>
      <CommonQuestionFields
        convention={convention}
        form={form}
        formItem={formItem}
        onChange={onChange}
        renderedFormItem={renderedFormItem}
      />
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
          onChange={formItemPropertyUpdater('caption', onChange)}
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
          onChange={formItemPropertyUpdater('style', onChange)}
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
              {formItem.properties.choices.map(({ caption, value, generatedId }, index) => (
                <MultipleChoiceOptionRow
                  // eslint-disable-next-line react/no-array-index-key
                  key={generatedId}
                  caption={caption}
                  value={value}
                  index={index}
                  deleteChoice={deleteChoice}
                  choiceChanged={choiceChanged}
                  swapChoices={swapChoices}
                  nonUnique={formItem.properties.choices
                    .filter((choice) => choice.value === value).length > 1}
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
                onCheckedChange={formItemPropertyUpdater('other', onChange)}
              />
            </div>
            <div className="col">
              <BootstrapFormInput
                label="“Other” option text"
                disabled={!formItem.properties.other}
                value={formItem.properties.other_caption || ''}
                onTextChange={formItemPropertyUpdater('other_caption', onChange)}
              />
            </div>
          </div>
        </fieldset>
      </div>
    </>
  );
}

MultipleChoiceEditor.propTypes = {
  convention: PropTypes.shape({}).isRequired,
  disabled: PropTypes.bool,
  form: PropTypes.shape({}).isRequired,
  formItem: PropTypes.shape({
    properties: PropTypes.shape({
      caption: PropTypes.string,
      style: PropTypes.string,
      choices: PropTypes.arrayOf(PropTypes.shape({
        caption: PropTypes.string,
        value: PropTypes.string,
      })).isRequired,
      other: PropTypes.bool,
      other_caption: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  renderedFormItem: PropTypes.shape({}).isRequired,
};

MultipleChoiceEditor.defaultProps = {
  disabled: false,
};

export default MultipleChoiceEditor;
