import { sortByLocaleString } from '@neinteractiveliterature/litform';

import NavigationSection from './NavigationSection';
import NavigationItem from './NavigationItem';

export type GeneratedNavigationItem = {
  label: string;
  url: string;
  icon: string;
};

export type GeneratedNavigationSectionProps = {
  label: string;
  items: GeneratedNavigationItem[];
};

function GeneratedNavigationSection({ label, items }: GeneratedNavigationSectionProps): React.JSX.Element {
  const sortedItems = sortByLocaleString(items, (item) => item?.label ?? '');

  if (items.some((item) => item)) {
    return (
      <NavigationSection label={label}>
        {sortedItems.map(
          (item) =>
            item && (
              <NavigationItem
                inSection
                key={`${item.label}-${item.url}`}
                label={item.label}
                url={item.url}
                icon={item.icon}
              />
            ),
        )}
      </NavigationSection>
    );
  }

  return <></>;
}

export default GeneratedNavigationSection;
