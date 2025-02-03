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
import { CmsPagesAdminQueryData } from './queries.generated';

export type PageFormFields = Pick<
  Page,
  'name' | 'admin_notes' | 'slug' | 'skip_clickwrap_agreement' | 'hidden_from_search' | 'content' | 'meta_description'
> & { cms_layout?: (Pick<CmsLayout, 'name'> & { id: string }) | null };

export type CmsPageFormProps<T extends PageFormFields> = {
  page: T;
  onChange?: React.Dispatch<React.SetStateAction<T>>;
  cmsParent: CmsPagesAdminQueryData['cmsParent'];
  cmsLayouts: CmsPagesAdminQueryData['cmsParent']['cmsLayouts'];
  readOnly?: boolean;
};

function CmsPageForm<T extends PageFormFields>({
  page,
  onChange,
  cmsParent,
  cmsLayouts,
  readOnly,
}: CmsPageFormProps<T>): JSX.Element {
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
  const defaultLayout =
    cmsParent.__typename === 'RootSite' ? cmsParent.root_site_default_layout : cmsParent.defaultLayout;

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
    ? `Default layout (currently set as ${defaultLayout.name})`
    : 'Default layout';

  return (
    <>
      <BootstrapFormInput label="Name" name="name" value={page.name ?? ''} onTextChange={setName} readOnly={readOnly} />

      <BootstrapFormInput
        label="Admin notes"
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
        caption="Skip clickwrap agreement"
        helpText="If selected, this page will not check whether the user has accepted the site clickwrap agreement."
        value={page.skip_clickwrap_agreement ?? false}
        onChange={setSkipClickwrapAgreement}
        disabled={readOnly}
      />

      <BooleanInput
        name="hidden_from_search"
        caption="Hidden from search"
        helpText="If selected, this page will not appear in site search results."
        value={page.hidden_from_search ?? false}
        onChange={setHiddenFromSearch}
        disabled={readOnly}
      />

      <SelectWithLabel<T['cms_layout']>
        name="cms_layout_id"
        label="Layout"
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
        label="Meta description"
        value={page.meta_description ?? ''}
        onTextChange={setMetaDescription}
        helpText="If present, this text will be used as the description for link previews from sites such as Facebook and Twitter."
      />

      <div className="mb-3">
        <legend className="col-form-label">Content</legend>
        <LiquidInput value={page.content ?? ''} onChange={setContent} extensions={extensions} />
        <input type="hidden" name="content" value={page.content ?? ''} />
      </div>
    </>
  );
}

export default CmsPageForm;
