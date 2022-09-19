import uniqBy from 'lodash/uniqBy';
import { useMemo } from 'react';
import { parseTypedFormItemArray } from '../FormAdmin/FormItemUtils';
import { FormItemExposeIn } from '../graphqlTypes.generated';
import { CommonConventionDataQueryData } from './queries.generated';

export default function useFilterableFormItems(convention: CommonConventionDataQueryData['convention']) {
  return useMemo(
    () =>
      uniqBy(
        convention.event_categories.flatMap((eventCategory) =>
          eventCategory.event_form.form_sections.flatMap((formSection) =>
            parseTypedFormItemArray(
              formSection.form_items.filter((item) => item.expose_in?.includes(FormItemExposeIn.EventCatalog)),
            ),
          ),
        ) ?? [],
        (formItem) => formItem.identifier,
      ),
    [convention.event_categories],
  );
}
