import { useMemo } from 'react';
import * as React from 'react';

import BooleanInput from '../../BuiltInFormControls/BooleanInput';
import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';
import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import SelectWithLabel from '../../BuiltInFormControls/SelectWithLabel';
import { sortByLocaleString } from '../../ValueUtils';
import useUniqueId from '../../useUniqueId';
import { CmsLayout, Page } from '../../graphqlTypes.generated';
import { CmsPagesAdminQueryData } from './queries.generated';
import { usePropertySetters } from '../../usePropertySetters';

export type PageFormFields = Pick<
  Page,
  'name' | 'admin_notes' | 'slug' | 'skip_clickwrap_agreement' | 'hidden_from_search' | 'content'
> & { cms_layout?: Pick<CmsLayout, 'id' | 'name'> | null };

export type CmsPageFormProps<T extends PageFormFields> = {
  page: T;
  onChange?: React.Dispatch<React.SetStateAction<T>>;
  cmsParent: CmsPagesAdminQueryData['cmsParent'];
  cmsLayouts: CmsPagesAdminQueryData['cmsLayouts'];
  readOnly?: boolean;
};

function CmsPageForm<T extends PageFormFields>({
  page,
  onChange,
  cmsParent,
  cmsLayouts,
  readOnly,
}: CmsPageFormProps<T>) {
  const [
    setName,
    setAdminNotes,
    setSlug,
    setSkipClickwrapAgreement,
    setHiddenFromSearch,
    setCmsLayout,
    setContent,
  ] = usePropertySetters(
    onChange,
    'name',
    'admin_notes',
    'slug',
    'skip_clickwrap_agreement',
    'hidden_from_search',
    'cms_layout',
    'content',
  );

  const slugInputId = useUniqueId('slug-');
  const defaultLayout =
    cmsParent.__typename === 'RootSite'
      ? cmsParent.root_site_default_layout
      : cmsParent.default_layout;

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
      <BootstrapFormInput
        label="Name"
        value={page.name ?? ''}
        onTextChange={setName}
        readOnly={readOnly}
      />

      <BootstrapFormInput
        label="Admin notes"
        value={page.admin_notes ?? ''}
        onTextChange={setAdminNotes}
        readOnly={readOnly}
      />

      <div className="form-group">
        <label htmlFor={slugInputId}>URL</label>
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">
              {`${new URL('/pages', window.location.href).toString()}/`}
            </span>
          </div>
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <input
            id={slugInputId}
            className="form-control"
            value={page.slug ?? ''}
            onChange={(event) => setSlug(event.target.value)}
            readOnly={readOnly}
          />
        </div>
      </div>

      <BooleanInput
        caption="Skip clickwrap agreement"
        helpText="If selected, this page will not check whether the user has accepted the site clickwrap agreement."
        value={page.skip_clickwrap_agreement ?? false}
        onChange={setSkipClickwrapAgreement}
        disabled={readOnly}
      />

      <BooleanInput
        caption="Hidden from search"
        helpText="If selected, this page will not appear in site search results."
        value={page.hidden_from_search ?? false}
        onChange={setHiddenFromSearch}
        disabled={readOnly}
      />

      <SelectWithLabel<T['cms_layout']>
        label="Layout"
        value={page.cms_layout}
        isClearable
        getOptionValue={(option) => option?.id.toString() ?? ''}
        getOptionLabel={(option) => option?.name ?? ''}
        options={cmsLayoutOptions}
        onChange={setCmsLayout}
        placeholder={cmsLayoutSelectPlaceholder}
        disabled={readOnly}
      />

      <div className="form-group">
        <legend className="col-form-label">Content</legend>
        <LiquidInput
          value={page.content ?? ''}
          onChange={setContent}
          codeMirrorOptions={{ readOnly }}
        />
      </div>
    </>
  );
}

export default CmsPageForm;
