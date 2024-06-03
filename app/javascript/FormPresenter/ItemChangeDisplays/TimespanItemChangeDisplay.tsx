import { useMemo } from 'react';
import TextDiffDisplay from './TextDiffDisplay';
import { describeDuration } from '../ItemDisplays/TimespanItemDisplay';
import { ParsedFormResponseChange } from './FormItemChangeUtils';
import { TimespanFormItem } from '../../FormAdmin/FormItemUtils';
import { useTranslation } from 'react-i18next';

export type TimespanItemChangeDisplayProps = {
  change: ParsedFormResponseChange<TimespanFormItem>;
};

function TimespanItemChangeDisplay({ change }: TimespanItemChangeDisplayProps): JSX.Element {
  const { t } = useTranslation();

  const before = useMemo(() => describeDuration(change.previous_value || 0, t), [change.previous_value, t]);
  const after = useMemo(() => describeDuration(change.new_value || 0, t), [change.new_value, t]);

  return <TextDiffDisplay before={before} after={after} />;
}

export default TimespanItemChangeDisplay;
