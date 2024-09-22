import { notEmpty } from '@neinteractiveliterature/litform';
import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';
import { useMemo } from 'react';
import {
  FreeTextFormItem,
  MultipleChoiceFormItem,
  MultipleChoiceProperties,
  parseTypedFormItemArray,
  TypedFormItem,
} from '../FormAdmin/FormItemUtils';
import { FormItemExposeIn } from '../graphqlTypes.generated';
import { CommonConventionDataQueryData } from './queries.generated';

function isAllFreeTextItems(items: TypedFormItem[]): items is FreeTextFormItem[] {
  return items.length > 0 && items.every((item) => item.item_type === 'free_text');
}

function isAllMultipleChoiceItems(items: TypedFormItem[]): items is MultipleChoiceFormItem[] {
  return items.length > 0 && items.every((item) => item.item_type === 'multiple_choice');
}

function mergeMultipleChoiceProperties(a: undefined, b: undefined): undefined;
function mergeMultipleChoiceProperties(a: undefined, b: MultipleChoiceProperties): MultipleChoiceProperties;
function mergeMultipleChoiceProperties(a: MultipleChoiceProperties, b: undefined): MultipleChoiceProperties;
function mergeMultipleChoiceProperties(
  a: MultipleChoiceProperties,
  b: MultipleChoiceProperties,
): MultipleChoiceProperties;
function mergeMultipleChoiceProperties(
  a: MultipleChoiceProperties | undefined,
  b: MultipleChoiceProperties | undefined,
): MultipleChoiceProperties | undefined;
function mergeMultipleChoiceProperties(
  a: MultipleChoiceProperties | undefined,
  b: MultipleChoiceProperties | undefined,
): MultipleChoiceProperties | undefined {
  if (a == null) {
    return b;
  }

  if (b == null) {
    return a;
  }

  return {
    ...a,
    choices: uniqBy([...a.choices, ...b.choices], (choice) => choice.value),
  };
}

function mergeFormItemsForFilter(items: TypedFormItem[]): TypedFormItem | undefined {
  if (items.length === 0) {
    return undefined;
  }

  // for filtering purposes, free text doesn't require merging
  if (isAllFreeTextItems(items)) {
    return items[0];
  }

  if (isAllMultipleChoiceItems(items)) {
    return items.reduce((previousValue, currentValue) => ({
      ...previousValue,
      properties: mergeMultipleChoiceProperties(previousValue.properties, currentValue.properties),
      rendered_properties: mergeMultipleChoiceProperties(
        previousValue.rendered_properties,
        currentValue.rendered_properties,
      ),
    }));
  }

  console.warn(
    `Don't know how to merge form items for filtering (types: ${items.map((item) => item.item_type).join(', ')})`,
  );
  return items[0];
}

export function getFilterableFormItems(convention: CommonConventionDataQueryData['convention']) {
  return Object.values(
    groupBy(
      convention.event_categories.flatMap((eventCategory) =>
        eventCategory.event_form.form_sections.flatMap((formSection) =>
          parseTypedFormItemArray(
            formSection.form_items.filter((item) => item.expose_in?.includes(FormItemExposeIn.EventCatalog)),
          ),
        ),
      ) ?? [],
      (formItem) => formItem.identifier,
    ),
  )
    .map(mergeFormItemsForFilter)
    .filter(notEmpty);
}

export default function useFilterableFormItems(convention: CommonConventionDataQueryData['convention']) {
  return useMemo(() => getFilterableFormItems(convention), [convention]);
}
