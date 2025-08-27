import { useContext, useMemo } from 'react';
import findIndex from 'lodash/findIndex';

import { SectionTraversalContext } from '../SectionTraversalContext';
import { getSortedFormItems, sortFormItems } from '../../Models/Form';
import { CommonFormFieldsFragment } from '../../Models/commonFormFragments.generated';

export type FormProgressProps = {
  form: CommonFormFieldsFragment;
};

export default function FormProgress({ form }: FormProgressProps): React.JSX.Element {
  const { currentSection, currentSectionIndex } = useContext(SectionTraversalContext);
  const items = useMemo(() => getSortedFormItems(form), [form]);
  const sectionItems = useMemo(() => sortFormItems(currentSection?.form_items ?? []), [currentSection]);
  const progressPercentValue = useMemo(() => {
    const lastSectionItem = sectionItems[sectionItems.length - 1];
    const itemIndex = findIndex(items, (item) => item.id === lastSectionItem.id) + 1;
    return Math.round((itemIndex / items.length) * 100);
  }, [items, sectionItems]);

  if (form.form_sections.length < 2) {
    return <></>;
  }

  const progressPercent = `${progressPercentValue}%`;

  return (
    <div className="progress card-img-top" style={{ borderRadius: 0 }}>
      <div
        className="progress-bar"
        role="progressbar"
        style={{ width: progressPercent }}
        aria-valuenow={progressPercentValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        Page {(currentSectionIndex ?? 0) + 1} of {form.form_sections.length}
      </div>
    </div>
  );
}
