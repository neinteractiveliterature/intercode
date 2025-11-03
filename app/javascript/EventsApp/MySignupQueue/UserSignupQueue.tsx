import { UserConProfileRankedChoiceQueueFieldsFragment } from './queries.generated';
import { InternalRefetchQueriesInclude, useMutation } from '@apollo/client';
import { usePendingChoices } from './usePendingChoices';
import UserSignupQueueItem from './UserSignupQueueItem';
import { useSortableDndSensors } from 'SortableUtils';
import { closestCorners, DndContext } from '@dnd-kit/core';
import { useArrayBasicSortableHandlers } from '@neinteractiveliterature/litform';
import { useCallback } from 'react';
import { UpdateSignupRankedChoicePriorityDocument } from './mutations.generated';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useRevalidator } from 'react-router';

export type UserSignupQueueProps = {
  userConProfile: UserConProfileRankedChoiceQueueFieldsFragment;
  refetchQueries: InternalRefetchQueriesInclude;
  readOnly: boolean;
};

function UserSignupQueue({ userConProfile, refetchQueries, readOnly }: UserSignupQueueProps) {
  const pendingChoices = usePendingChoices(userConProfile);
  const sensors = useSortableDndSensors();
  const revalidator = useRevalidator();

  const [updateSignupRankedChoicePriority, { loading: updatePriorityLoading }] = useMutation(
    UpdateSignupRankedChoicePriorityDocument,
    {
      refetchQueries,
      awaitRefetchQueries: true,
    },
  );

  const moveItem = useCallback(
    async (dragIndex: number, hoverIndex: number) => {
      const itemId = pendingChoices[dragIndex].id;
      await updateSignupRankedChoicePriority({ variables: { id: itemId, priority: hoverIndex + 1 } });
      await revalidator.revalidate();
    },
    [pendingChoices, updateSignupRankedChoicePriority, revalidator],
  );

  const { draggingItem, ...sortableHandlers } = useArrayBasicSortableHandlers(pendingChoices, moveItem, 'id');

  return (
    <section className="card">
      <DndContext sensors={sensors} {...sortableHandlers} collisionDetection={closestCorners}>
        <SortableContext items={pendingChoices.map((choice) => choice.id)} strategy={verticalListSortingStrategy}>
          <ul className="list-group list-group-flush">
            {pendingChoices.map((_, index) => (
              <UserSignupQueueItem
                key={index}
                index={index}
                readOnly={readOnly}
                refetchQueries={refetchQueries}
                userConProfile={userConProfile}
                loading={updatePriorityLoading}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </section>
  );
}

export default UserSignupQueue;
