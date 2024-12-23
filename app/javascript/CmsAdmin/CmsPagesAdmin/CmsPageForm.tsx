import { useId, useMemo } from 'react';
import * as React from 'react';
import {
  BooleanInput,
  BootstrapFormInput,
  usePropertySetters,
  sortByLocaleString,
  BootstrapFormTextarea,
} from '@neinteractiveliterature/litform';
import { EditorView } from '@codemirror/view';

import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import SelectWithLabel from '../../BuiltInFormControls/SelectWithLabel';
import { CmsLayout, Page } from '../../graphqlTypes.generated';
import { CmsPageAdminLayoutFieldsFragment, CmsPagesAdminQueryData } from './queries.generated';
import { useTranslation } from 'react-i18next';

export type PageFormFields = Pick<
  Page,
  'name' | 'admin_notes' | 'slug' | 'skip_clickwrap_agreement' | 'hidden_from_search' | 'content' | 'meta_description'
> & { cms_layout?: (Pick<CmsLayout, 'name'> & { id: string }) | null };

export type CmsPageFormProps<T extends PageFormFields> = {
  page: T;
  onChange?: React.Dispatch<React.SetStateAction<T>>;
  defaultLayout: CmsPageAdminLayoutFieldsFragment;
  cmsLayouts: CmsPagesAdminQueryData['cmsParent']['cmsLayouts'];
  readOnly?: boolean;
};

function CmsPageForm<T extends PageFormFields>({
  page,
  onChange,
  defaultLayout,
  cmsLayouts,
  readOnly,
}: CmsPageFormProps<T>): JSX.Element {
  const { t } = useTranslation();
  const [
    setName,
    setAdminNotes,
    setSlug,
    setSkipClickwrapAgreement,
    setHiddenFromSearch,
    setCmsLayout,
    setContent,
    setMetaDescription,
  ] = usePropertySetters(
    onChange,
    'name',
    'admin_notes',
    'slug',
    'skip_clickwrap_agreement',
    'hidden_from_search',
    'cms_layout',
    'content',
    'meta_description',
  );

  const extensions = React.useMemo(() => [EditorView.editable.of(!readOnly)], [readOnly]);

  const slugInputId = useId();

  const cmsLayoutOptions = useMemo(
    () =>
      sortByLocaleString(cmsLayouts, (layout) => layout.name ?? '').map((layout) => {
        if (defaultLayout && defaultLayout.id === layout.id) {
          return {
            ...layout,
            name: `${layout.name} (site default)`,
          };
        }

        return layout;
      }),
    [cmsLayouts, defaultLayout],
  );

  const cmsLayoutSelectPlaceholder = defaultLayout
    ? t('cms.pages.defaultLayout', { name: defaultLayout.name })
    : t('cms.pages.defaultLayoutUnset');

  return (
    <>
      <BootstrapFormInput
        label={t('cms.pages.nameLabel')}
        name="name"
        value={page.name ?? ''}
        onTextChange={setName}
        readOnly={readOnly}
      />

      <BootstrapFormInput
        label={t('admin.adminNotes.label')}
        name="admin_notes"
        value={page.admin_notes ?? ''}
        onTextChange={setAdminNotes}
        readOnly={readOnly}
      />

      <div className="mb-3">
        <label className="form-label" htmlFor={slugInputId}>
          URL
        </label>
        <div className="input-group">
          <span className="input-group-text">{`${new URL('/pages', window.location.href).toString()}/`}</span>
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <input
            id={slugInputId}
            name="slug"
            className="form-control"
            value={page.slug ?? ''}
            onChange={(event) => setSlug(event.target.value)}
            readOnly={readOnly}
          />
        </div>
      </div>

      <BooleanInput
        name="skip_clickwrap_agreement"
        caption={t('cms.pages.skipClickwrapAgreementLabel')}
        helpText={t('cms.pages.skipClickwrapAgreementHelpText')}
        value={page.skip_clickwrap_agreement ?? false}
        onChange={setSkipClickwrapAgreement}
        disabled={readOnly}
      />

      <BooleanInput
        name="hidden_from_search"
        caption={t('cms.pages.hiddenFromSearchLabel')}
        helpText={t('cms.pages.hiddenFromSearchHelpText')}
        value={page.hidden_from_search ?? false}
        onChange={setHiddenFromSearch}
        disabled={readOnly}
      />

      <SelectWithLabel<T['cms_layout']>
        name="cms_layout_id"
        label={t('cms.pages.layoutLabel')}
        value={page.cms_layout}
        isClearable
        getOptionValue={(option) => option?.id.toString() ?? ''}
        getOptionLabel={(option) => option?.name ?? ''}
        options={cmsLayoutOptions}
        onChange={setCmsLayout}
        placeholder={cmsLayoutSelectPlaceholder}
        isDisabled={readOnly}
      />

      <BootstrapFormTextarea
        name="meta_description"
        label={t('cms.pages.metaDescriptionLabel')}
        value={page.meta_description ?? ''}
        onTextChange={setMetaDescription}
        helpText={t('cms.pages.metaDescriptionHelpText')}
      />

      <div className="mb-3">
        <legend className="col-form-label">{t('cms.pages.contentLabel')}</legend>
        <LiquidInput value={page.content ?? ''} onChange={setContent} extensions={extensions} />
        <input type="hidden" name="content" value={page.content ?? ''} />
      </div>
    </>
  );
}

export default CmsPageForm;
