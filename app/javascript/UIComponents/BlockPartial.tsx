import { CmsPartial, CmsPartialBlockName } from 'graphqlTypes.generated';
import { DropdownMenu } from './DropdownMenu';
import MenuIcon from 'NavigationBar/MenuIcon';
import { ErrorDisplay, useConfirm } from '@neinteractiveliterature/litform';
import { useRevalidator } from 'react-router-dom';
import { useState } from 'react';
import LiquidInput from 'BuiltInFormControls/LiquidInput';
import { useTranslation } from 'react-i18next';
import { useApolloClient, useMutation } from '@apollo/client';
import {
  CreatePartialDocument,
  DeletePartialDocument,
  UpdatePartialDocument,
} from 'CmsAdmin/CmsPartialsAdmin/mutations.generated';
import parseCmsContent from 'parseCmsContent';

export type BlockPartialProps = {
  name: CmsPartialBlockName;
  blockPartial:
    | Pick<CmsPartial, 'id' | 'content' | 'content_html' | 'current_ability_can_update' | 'current_ability_can_delete'>
    | null
    | undefined;
  currentAbilityCanCreate: boolean;
};

export default function BlockPartial({ blockPartial, currentAbilityCanCreate, name }: BlockPartialProps) {
  const confirm = useConfirm();
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [editingContent, setEditingContent] = useState(blockPartial?.content ?? '');
  const client = useApolloClient();
  const revalidator = useRevalidator();

  const [createMutate, { loading: createLoading, error: createError }] = useMutation(CreatePartialDocument);
  const [updateMutate, { loading: updateLoading, error: updateError }] = useMutation(UpdatePartialDocument);
  const [deleteMutate] = useMutation(DeletePartialDocument);

  const submitInProgress = createLoading || updateLoading;
  const submitError = createError ?? updateError;

  const submitted = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (blockPartial) {
      await updateMutate({
        variables: {
          id: blockPartial.id,
          cmsPartial: {
            content: editingContent,
          },
        },
      });
    } else {
      await createMutate({
        variables: {
          partialBlockName: name,
          cmsPartial: {
            content: editingContent,
          },
        },
      });
    }

    await client.resetStore();
    revalidator.revalidate();
    setEditing(false);
  };

  const deleteConfirmed = async () => {
    if (!blockPartial) {
      return;
    }

    await deleteMutate({ variables: { id: blockPartial.id } });
    await client.resetStore();
    revalidator.revalidate();
  };

  if (editing) {
    return (
      <form onSubmit={submitted}>
        <LiquidInput value={editingContent} onChange={setEditingContent} disabled={submitInProgress} />
        <div className="d-flex justify-content-end mt-2 mb-2 gap-2">
          <button
            className="btn btn-secondary"
            onClick={() => {
              setEditing(false);
              setEditingContent(blockPartial?.content ?? '');
            }}
            disabled={submitInProgress}
          >
            {t('buttons.cancel')}
          </button>
          <input
            type="submit"
            className="btn btn-primary"
            value={blockPartial ? t('buttons.saveChanges') : t('buttons.save')}
            aria-label={blockPartial ? t('buttons.saveChanges') : t('buttons.save')}
            disabled={submitInProgress}
          />
        </div>
        <ErrorDisplay graphQLError={submitError} />
      </form>
    );
  }

  return (
    <div className="overflow-hidden">
      {(currentAbilityCanCreate ||
        blockPartial?.current_ability_can_delete ||
        blockPartial?.current_ability_can_update) && (
        <div className="float-end mb-2">
          <DropdownMenu
            buttonClassName="btn btn-dark dropdown-toggle"
            buttonContent={
              <i className="bi-pencil-square">
                <span className="visually-hidden">Admin options</span>
              </i>
            }
            popperOptions={{ placement: 'bottom-end' }}
          >
            {!blockPartial && currentAbilityCanCreate && (
              <button className="dropdown-item" onClick={() => setEditing(true)}>
                <MenuIcon icon="bi-pencil-fill" />
                {t('cms.blockPartial.addContent')}
              </button>
            )}
            {blockPartial?.current_ability_can_update && (
              <>
                <button className="dropdown-item" onClick={() => setEditing(true)}>
                  <MenuIcon icon="bi-pencil-fill" />
                  {t('cms.blockPartial.editContent')}
                </button>
              </>
            )}
            {blockPartial?.current_ability_can_delete ? (
              <button
                className="dropdown-item text-danger"
                onClick={() =>
                  confirm({
                    action: deleteConfirmed,
                    prompt: 'Are you sure you want to delete this content?',
                  })
                }
                type="button"
              >
                <MenuIcon icon="bi-trash" colorClass="text-danger" />
                {t('cms.blockPartial.deleteContent')}
              </button>
            ) : null}
          </DropdownMenu>
        </div>
      )}
      {blockPartial && parseCmsContent(blockPartial.content_html).bodyComponents}
    </div>
  );
}
