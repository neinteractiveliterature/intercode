import { UnrenderedMarkdownDisplay } from './MarkdownDisplay';
import { FormItemDisplayMode } from './FormItemDisplayMode';
import { AgeRestrictionsValue } from '../../FormAdmin/FormItemUtils';

export type AgeRestrictionsDisplayProps = {
  displayMode: FormItemDisplayMode;
  value: AgeRestrictionsValue;
};

function AgeRestrictionsDisplay(props: AgeRestrictionsDisplayProps): React.JSX.Element {
  const value = props.value || {};

  if (props.displayMode === 'public') {
    return <UnrenderedMarkdownDisplay markdown={value.age_restrictions_description} />;
  }

  return (
    <ul className="list-unstyled">
      <li>
        <strong>Minimum age:</strong> {value.minimum_age ?? <em>none set</em>}
      </li>

      <li>
        <strong>Public description:</strong> <UnrenderedMarkdownDisplay markdown={value.age_restrictions_description} />
      </li>
    </ul>
  );
}

export default AgeRestrictionsDisplay;
