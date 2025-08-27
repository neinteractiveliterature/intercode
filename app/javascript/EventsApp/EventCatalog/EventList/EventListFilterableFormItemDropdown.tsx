import { useMemo } from 'react';
import { useLocation } from 'react-router';

import { DropdownMenu } from '../../../UIComponents/DropdownMenu';
import { locationsEqualWithSearchParamsTransform } from '../../../URLUtils';
import FormItemFilter, { ConventionForFormItemFilter } from '../../../FormPresenter/ItemFilters/FormItemFilter';
import { TypedFormItem } from '../../../FormAdmin/FormItemUtils';

type LocationType = ReturnType<typeof useLocation>;

export type EventListFilterableFormItemDropdownProps = {
  convention: ConventionForFormItemFilter;
  formItem: TypedFormItem;
  value: string[];
  onChange: React.Dispatch<string[]>;
};

function EventListFilterableFormItemDropdown({
  convention,
  formItem,
  value,
  onChange,
}: EventListFilterableFormItemDropdownProps): React.JSX.Element {
  const shouldAutoCloseOnNavigate = useMemo(
    () => (prevLocation: LocationType, location: LocationType) => {
      return !locationsEqualWithSearchParamsTransform(prevLocation, location, (params) => {
        const formItemFilterValue = params.get('filters.form_items');
        if (!formItemFilterValue) {
          return params;
        }

        const parsedFilters = JSON.parse(formItemFilterValue ?? '{}');
        delete parsedFilters[formItem.identifier ?? ''];
        params.set(`filters.form_items`, JSON.stringify(parsedFilters));
        return params;
      });
    },
    [formItem.identifier],
  );

  return (
    <DropdownMenu
      buttonContent={
        <>
          {value?.length > 0 && (
            <>
              <i className="bi-funnel-fill" />{' '}
            </>
          )}
          {formItem.public_description}
        </>
      }
      buttonClassName="btn btn-link dropdown-toggle"
      dropdownClassName="p-2"
      shouldAutoCloseOnNavigate={shouldAutoCloseOnNavigate}
    >
      <FormItemFilter convention={convention} formItem={formItem} onChange={onChange} value={value} />
    </DropdownMenu>
  );
}

export default EventListFilterableFormItemDropdown;
