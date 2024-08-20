import useSectionizedFormItems from './useSectionizedFormItems';
import { valueIsPresent } from './valueIsPresent';
import FormItemDisplay from '../../FormPresenter/ItemDisplays/FormItemDisplay';
import { EventPageQueryData } from './queries.generated';

export type LongFormEventDetailsProps = {
  data: EventPageQueryData;
};

export default function LongFormEventDetails({ data }: LongFormEventDetailsProps) {
  const { longFormItems, formResponse } = useSectionizedFormItems(data.convention.event);

  return (
    <>
      {longFormItems.map(
        (item, index) =>
          valueIsPresent(formResponse[item.identifier ?? '']) && (
            <section
              className="mb-4 event-details"
              id={item.identifier ?? `item${item.id}`}
              key={item.identifier ?? `item${item.id}`}
            >
              {index > 0 && <hr />}
              {item.identifier === 'description' ? null : <h4>{item.public_description}</h4>}

              <FormItemDisplay
                convention={data.convention}
                displayMode="public"
                formItem={item}
                value={formResponse[item.identifier ?? '']}
              />
            </section>
          ),
      )}
    </>
  );
}
