import { useCallback, useId, useMemo } from 'react';
import classNames from 'classnames';
import { EditorView } from '@codemirror/view';

import FieldRequiredFeedback from './FieldRequiredFeedback';
import MarkdownInput from '../../BuiltInFormControls/MarkdownInput';
import CaptionLabel from './CaptionLabel';
import { CommonFormItemInputProps } from './CommonFormItemInputProps';
import { FreeTextFormItem } from '../../FormAdmin/FormItemUtils';
import { VisibilityDisclosureCard } from './PermissionDisclosures';

function getLimitClass(count: number, limit: number) {
  const warningThreshold = Math.min(limit * 0.9, limit - 10);
  if (count < warningThreshold) {
    return 'text-success';
  }

  if (count <= limit) {
    return 'text-warning';
  }

  return 'text-danger';
}

type AdvisoryLimitDisplayProps = {
  content: string;
  advisoryWordLimit?: number;
  advisoryCharacterLimit?: number;
};

function AdvisoryLimitDisplay({ content, advisoryCharacterLimit, advisoryWordLimit }: AdvisoryLimitDisplayProps) {
  const characterCount = content.length;
  const wordCount = useMemo(() => content.split(/\s+/).filter((word) => word.length > 0).length, [content]);
  const showLabels = advisoryCharacterLimit != null && advisoryWordLimit != null;

  return (
    <div style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', textAlign: 'right' }}>
      {advisoryCharacterLimit && (
        <>
          <span className={getLimitClass(characterCount, advisoryCharacterLimit)}>
            {characterCount}/{advisoryCharacterLimit}
            {showLabels && ' characters'}
          </span>
          {advisoryWordLimit && <br />}
        </>
      )}
      {advisoryWordLimit && (
        <>
          <span className={getLimitClass(wordCount, advisoryWordLimit)}>
            {wordCount}/{advisoryWordLimit}
            {showLabels && ' words'}
          </span>
        </>
      )}
    </div>
  );
}

export type FreeTextItemInputProps = CommonFormItemInputProps<FreeTextFormItem>;

function FreeTextItemInput(props: FreeTextItemInputProps): React.JSX.Element {
  const {
    formItem,
    formResponseReference,
    formTypeIdentifier,
    imageAttachmentConfig,
    onChange,
    onInteract,
    value: uncheckedValue,
    valueInvalid,
  } = props;
  const domId = useId();
  const value = uncheckedValue ?? '';

  const userInteracted = useCallback(() => onInteract(formItem.identifier), [onInteract, formItem.identifier]);

  const extensions = useMemo(
    () => [
      EditorView.domEventHandlers({
        blur: userInteracted,
      }),
    ],
    [userInteracted],
  );

  const valueChanged = useCallback(
    (newValue: string) => {
      onChange(newValue);
      userInteracted();
    },
    [onChange, userInteracted],
  );

  const renderInput = () => {
    if (formItem.rendered_properties.format === 'markdown') {
      return (
        <div className="position-relative">
          <MarkdownInput
            value={value || ''}
            onChange={valueChanged}
            extensions={extensions}
            lines={formItem.rendered_properties.lines}
            formControlClassName={classNames({ 'is-invalid': valueInvalid })}
            eventId={formResponseReference?.type === 'Event' ? formResponseReference.id : undefined}
            eventProposalId={formResponseReference?.type === 'EventProposal' ? formResponseReference.id : undefined}
            imageAttachmentConfig={imageAttachmentConfig}
          >
            <FieldRequiredFeedback valueInvalid={valueInvalid} />
          </MarkdownInput>
          <AdvisoryLimitDisplay
            content={value}
            advisoryCharacterLimit={formItem.rendered_properties.advisory_character_limit}
            advisoryWordLimit={formItem.rendered_properties.advisory_word_limit}
          />
        </div>
      );
    }
    if (formItem.rendered_properties.lines === 1) {
      return (
        <div className="position-relative">
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <input
            id={domId}
            name={formItem.identifier}
            type={formItem.rendered_properties.free_text_type || 'text'}
            className={classNames('form-control', { 'is-invalid': valueInvalid })}
            value={value || ''}
            onChange={(event) => valueChanged(event.target.value)}
            onBlur={userInteracted}
          />
          <AdvisoryLimitDisplay
            content={value}
            advisoryCharacterLimit={formItem.rendered_properties.advisory_character_limit}
            advisoryWordLimit={formItem.rendered_properties.advisory_word_limit}
          />
        </div>
      );
    }

    return (
      <div className="position-relative">
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <textarea
          id={domId}
          name={formItem.identifier}
          rows={formItem.rendered_properties.lines}
          className={classNames('form-control', { 'is-invalid': valueInvalid })}
          value={value || ''}
          onChange={(event) => valueChanged(event.target.value)}
          onBlur={userInteracted}
        />
        <AdvisoryLimitDisplay
          content={value}
          advisoryCharacterLimit={formItem.rendered_properties.advisory_character_limit}
          advisoryWordLimit={formItem.rendered_properties.advisory_word_limit}
        />
      </div>
    );
  };

  return (
    <div className="mb-3">
      <VisibilityDisclosureCard formItem={formItem} formTypeIdentifier={formTypeIdentifier}>
        <CaptionLabel formItem={formItem} htmlFor={domId} />
        {renderInput()}
        <FieldRequiredFeedback valueInvalid={valueInvalid} />
      </VisibilityDisclosureCard>
    </div>
  );
}

export default FreeTextItemInput;
