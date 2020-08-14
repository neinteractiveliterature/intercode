import React, { ReactNode } from 'react';

import SelectWithLabel, { SelectWithLabelProps } from './SelectWithLabel';
import { Organization } from '../graphqlTypes.generated';

type OrganizationForSelect = Pick<Organization, 'id' | 'name'>;
export type OrganizationSelectProps = Omit<SelectWithLabelProps<OrganizationForSelect>, 'label'> & {
  organizations: OrganizationForSelect[],
  label?: ReactNode,
};

function OrganizationSelect({ organizations, label, ...props }: OrganizationSelectProps) {
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
