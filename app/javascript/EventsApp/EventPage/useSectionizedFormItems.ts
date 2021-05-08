import { useMemo } from 'react';
import { FreeTextFormItem, TypedFormItem } from '../../FormAdmin/FormItemUtils';

import { getSortedParsedFormItems } from '../../Models/Form';
import { EventPageQueryData } from './queries.generated';

type EventPageForm = NonNullable<EventPageQueryData['event']['form']>;

function getSectionizedFormItems(formData: EventPageForm, formResponse: { [x: string]: any }) {
  const displayFormItems = getSortedParsedFormItems(formData).filter(
    (item) =>
      item.identifier &&
      item.identifier !== 'short_blurb' &&
      item.identifier !== 'title' &&
      item.public_description != null &&
      formResponse[item.identifier],
  );
  const shortFormItems: TypedFormItem[] = [];
  const secretFormItems: FreeTextFormItem[] = [];
  const longFormItems: TypedFormItem[] = [];
  displayFormItems.forEach((item) => {
    if (item.item_type === 'free_text' && item.rendered_properties.hide_from_public) {
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

export default function useSectionizedFormItems(event?: EventPageQueryData['event']) {
  const formResponse = useMemo(
    () => (event ? JSON.parse(event.form_response_attrs_json_with_rendered_markdown) : null),
    [event],
  );

  const { shortFormItems, secretFormItems, longFormItems } = useMemo(
    () =>
      event?.form
        ? getSectionizedFormItems(event.form, formResponse)
        : {
            shortFormItems: [] as TypedFormItem[],
            secretFormItems: [] as FreeTextFormItem[],
            longFormItems: [] as TypedFormItem[],
            formResponse: {},
          },
    [event, formResponse],
  );

  return { shortFormItems, longFormItems, secretFormItems, formResponse };
}
