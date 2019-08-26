import { useMemo } from 'react';

import { deserializeForm } from '../../FormPresenter/GraphQLFormDeserialization';

function getSectionizedFormItems(formData, formResponse) {
  const form = deserializeForm(formData);
  const displayFormItems = form.getAllItems().filter((item) => (
    item.identifier !== 'short_blurb'
    && item.identifier !== 'title'
    && item.public_description != null
    && formResponse[item.identifier]
  ));
  const shortFormItems = [];
  const longFormItems = [];
  displayFormItems.forEach((item) => {
    if (item.item_type === 'free_text' && item.properties.format === 'markdown') {
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

  return { shortFormItems, longFormItems };
}

export default function useSectionizedFormItems(event) {
  const formResponse = useMemo(
    () => (event ? JSON.parse(event.form_response_attrs_json_with_rendered_markdown) : null),
    [event],
  );

  const { shortFormItems, longFormItems } = useMemo(
    () => (event ? getSectionizedFormItems(event.form, formResponse) : {}),
    [event, formResponse],
  );

  return { shortFormItems, longFormItems, formResponse };
}
