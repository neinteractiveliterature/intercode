import React, { useMemo } from 'react';

import BooleanInput from '../../BuiltInFormControls/BooleanInput';
import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';
import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import SelectWithLabel from '../../BuiltInFormControls/SelectWithLabel';
import { sortByLocaleString } from '../../ValueUtils';
import useUniqueId from '../../useUniqueId';
import { CmsLayout, Page } from '../../graphqlTypes.generated';
import { CmsPagesAdminQueryQuery } from './queries.generated';
import { usePartialState, usePartialStateFactory } from '../../usePartialState';
import { onChangeSingleValue } from '../../ReactSelectUtils';

export type PageFormFields = Pick<
  Page,
  'name' | 'admin_notes' | 'slug' | 'skip_clickwrap_agreement' | 'hidden_from_search' | 'content'
> & { cms_layout?: Pick<CmsLayout, 'id' | 'name'> | null };

export type CmsPageFormProps<T extends PageFormFields> = {
  page: T;
  onChange?: React.Dispatch<React.SetStateAction<T>>;
  cmsParent: CmsPagesAdminQueryQuery['cmsParent'];
  cmsLayouts: CmsPagesAdminQueryQuery['cmsLayouts'];
  readOnly?: boolean;
};

function CmsPageForm<T extends PageFormFields>({
  page,
  onChange,
  cmsParent,
  cmsLayouts,
  readOnly,
}: CmsPageFormProps<T>) {
  const factory = usePartialStateFactory(page, onChange);
  const [name, setName] = usePartialState(factory, 'name');
  const [adminNotes, setAdminNotes] = usePartialState(factory, 'admin_notes');
  const [slug, setSlug] = usePartialState(factory, 'slug');
  const [skipClickwrapAgreement, setSkipClickwrapAgreement] = usePartialState(
    factory,
    'skip_clickwrap_agreement',
  );
  const [hiddenFromSearch, setHiddenFromSearch] = usePartialState(factory, 'hidden_from_search');
  const [cmsLayout, setCmsLayout] = usePartialState(factory, 'cms_layout');
  const [content, setContent] = usePartialState(factory, 'content');

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
        value={name ?? ''}
        onTextChange={setName}
        readOnly={readOnly}
      />

      <BootstrapFormInput
        label="Admin notes"
        value={adminNotes ?? ''}
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
            value={slug ?? ''}
            onChange={(event) => setSlug(event.target.value)}
            readOnly={readOnly}
          />
        </div>
      </div>

      <BooleanInput
        caption="Skip clickwrap agreement"
        helpText="If selected, this page will not check whether the user has accepted the site clickwrap agreement."
        value={skipClickwrapAgreement ?? false}
        onChange={setSkipClickwrapAgreement}
        disabled={readOnly}
      />

      <BooleanInput
        caption="Hidden from search"
        helpText="If selected, this page will not appear in site search results."
        value={hiddenFromSearch ?? false}
        onChange={setHiddenFromSearch}
        disabled={readOnly}
      />

      <SelectWithLabel<T['cms_layout']>
        label="Layout"
        value={cmsLayout}
        isClearable
        getOptionValue={(option) => option?.id.toString() ?? ''}
        getOptionLabel={(option) => option?.name ?? ''}
        options={cmsLayoutOptions}
        onChange={onChangeSingleValue(setCmsLayout)}
        placeholder={cmsLayoutSelectPlaceholder}
        disabled={readOnly}
      />

      <div className="form-group">
        <legend className="col-form-label">Content</legend>
        <LiquidInput value={content ?? ''} onChange={setContent} codeMirrorOptions={{ readOnly }} />
      </div>
    </>
  );
}

export default CmsPageForm;
