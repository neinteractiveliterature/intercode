import useSectionizedFormItems from './useSectionizedFormItems';
import { useEventPageQuery } from './queries.generated';
import { LoadQueryWithVariablesWrapper } from '../../GraphqlLoadingWrappers';
import { valueIsPresent } from './valueIsPresent';
import FormItemDisplay from '../../FormPresenter/ItemDisplays/FormItemDisplay';

export type LongFormEventDetailsProps = {
  eventId: string;
};

export default LoadQueryWithVariablesWrapper(
  useEventPageQuery,
  ({ eventId }: LongFormEventDetailsProps) => ({ eventId }),
  function LongFormEventDetails({ data }) {
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
  },
);
