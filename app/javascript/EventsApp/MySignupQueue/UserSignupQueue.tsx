import { UserConProfileRankedChoiceQueueFieldsFragment } from './queries.generated';
import { InternalRefetchQueriesInclude } from '@apollo/client';
import { useMutation } from "@apollo/client/react";
import { usePendingChoices } from './usePendingChoices';
import UserSignupQueueItem from './UserSignupQueueItem';
import { useSortableDndSensors } from '~/SortableUtils';
import { closestCorners, DndContext } from '@dnd-kit/core';
import { useArrayBasicSortableHandlers } from '@neinteractiveliterature/litform';
import { useCallback, useState } from 'react';
import { UpdateSignupRankedChoicePriorityDocument } from './mutations.generated';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useRevalidator } from 'react-router';
import { useTranslation } from 'react-i18next';

export type UserSignupQueueProps = {
  userConProfile: UserConProfileRankedChoiceQueueFieldsFragment;
  refetchQueries: InternalRefetchQueriesInclude;
  readOnly: boolean;
};

function UserSignupQueue({ userConProfile, refetchQueries, readOnly }: UserSignupQueueProps) {
  const pendingChoices = usePendingChoices(userConProfile);
  const sensors = useSortableDndSensors();
  const revalidator = useRevalidator();
  const [enableDragDrop, setEnableDragDrop] = useState(false);
  const { t } = useTranslation();

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
      <div className="card-heading bg-light px-4 py-3 rounded-top">
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="enableDragDrop"
            aria-label={t('signups.mySignupQueue.enableDragDrop')}
            checked={enableDragDrop}
            onChange={(event) => setEnableDragDrop(event.target.checked)}
          />
          <label className="form-check-label" htmlFor="enableDragDrop">
            {t('signups.mySignupQueue.enableDragDrop')}
          </label>
        </div>
      </div>
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
                enableDragDrop={enableDragDrop}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </section>
  );
}

export default UserSignupQueue;
