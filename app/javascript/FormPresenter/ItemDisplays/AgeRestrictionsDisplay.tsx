import MarkdownDisplay from './MarkdownDisplay';
import { FormItemDisplayMode } from './FormItemDisplayMode';
import { AgeRestrictionsValue } from '../../FormAdmin/FormItemUtils';

export type AgeRestrictionsDisplayProps = {
  displayMode: FormItemDisplayMode;
  value: AgeRestrictionsValue;
};

function AgeRestrictionsDisplay(props: AgeRestrictionsDisplayProps): JSX.Element {
  const value = props.value || {};

  if (props.displayMode === 'public') {
    return <MarkdownDisplay markdown={value.age_restrictions_description} />;
  }

  return (
    <ul className="list-unstyled">
      <li>
        <strong>Minimum age:</strong> {value.minimum_age ?? <em>none set</em>}
      </li>

      <li>
        <strong>Public description:</strong>{' '}
        <MarkdownDisplay markdown={value.age_restrictions_description} />
      </li>
    </ul>
  );
}

export default AgeRestrictionsDisplay;
