import { useMemo } from 'react';
import { FreeTextFormItem, TypedFormItem } from '../../FormAdmin/FormItemUtils';

import { getSortedParsedFormItems } from '../../Models/Form';
import { EventPageQueryData } from './queries.generated';

type EventPageForm = NonNullable<EventPageQueryData['convention']['event']['form']>;

function getSectionizedFormItems(formData: EventPageForm, formResponse: Record<string, unknown>) {
  const displayFormItems = getSortedParsedFormItems(formData).filter(
    (item) =>
      item.identifier &&
      item.identifier !== 'short_blurb' &&
      item.identifier !== 'title' &&
      item.public_description != null &&
      item.public_description.trim().length > 0 &&
      (formResponse[item.identifier] || formResponse[item.identifier] === false),
  );
  const shortFormItems: TypedFormItem[] = [];
  const secretFormItems: TypedFormItem[] = [];
  const longFormItems: FreeTextFormItem[] = [];
  displayFormItems.forEach((item) => {
    if (item.visibility !== 'normal') {
      secretFormItems.push(item);
    } else if (item.item_type === 'free_text' && item.rendered_properties.format === 'markdown') {
      longFormItems.push(item);
    } else {
      shortFormItems.push(item);
    }
  });
  longFormItems.sort((a, b) => {
    if (a.identifier === 'description') {
      return -1;
    }

    if (b.identifier === 'description') {
      return 1;
    }

    return 0;
  });

  return { shortFormItems, secretFormItems, longFormItems };
}

export default function useSectionizedFormItems(event?: EventPageQueryData['convention']['event']): {
  shortFormItems: TypedFormItem[];
  longFormItems: FreeTextFormItem[];
  secretFormItems: TypedFormItem[];
  formResponse: Record<string, unknown>;
} {
  const formResponse = useMemo(
    () =>
      event?.form_response_attrs_json_with_rendered_markdown
        ? JSON.parse(event.form_response_attrs_json_with_rendered_markdown)
        : {},
    [event],
  );

  const { shortFormItems, secretFormItems, longFormItems } = useMemo(
    () =>
      event?.form
        ? getSectionizedFormItems(event.form, formResponse)
        : {
            shortFormItems: [] as TypedFormItem[],
            secretFormItems: [] as TypedFormItem[],
            longFormItems: [] as FreeTextFormItem[],
            formResponse: {},
          },
    [event, formResponse],
  );

  return { shortFormItems, longFormItems, secretFormItems, formResponse };
}
