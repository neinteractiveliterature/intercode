import { ReactNode } from 'react';

import SelectWithLabel, { SelectWithLabelProps } from './SelectWithLabel';
import { Organization } from '../graphqlTypes.generated';

type OrganizationForSelect = Pick<Organization, 'name'> & { id: string };
export type OrganizationSelectProps<IsMulti extends boolean> = Omit<
  SelectWithLabelProps<OrganizationForSelect, IsMulti>,
  'label'
> & {
  organizations: OrganizationForSelect[];
  label?: ReactNode;
};

function OrganizationSelect<IsMulti extends boolean = false>({
  organizations,
  label,
  ...props
}: OrganizationSelectProps<IsMulti>): React.JSX.Element {
  return (
    <SelectWithLabel
      label={label || 'Organization'}
      options={organizations}
      getOptionValue={(organization) => organization.id.toString()}
      getOptionLabel={(organization) => organization.name}
      {...props}
    />
  );
}

export default OrganizationSelect;
