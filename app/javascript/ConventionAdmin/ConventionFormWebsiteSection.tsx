import { CSSObject } from '@emotion/serialize';
import * as React from 'react';
import { BooleanInput, usePropertySetters } from '@neinteractiveliterature/litform';

import SelectWithLabel from '../BuiltInFormControls/SelectWithLabel';
import LiquidInput from '../BuiltInFormControls/LiquidInput';
import type { ConventionFormConvention } from './ConventionForm';
import { ConventionAdminConventionQueryData } from './queries.generated';

// Since our selects come right above a CodeMirror, we need to override the z-index on the
// dropdown menu so that the text in the CodeMirror doesn't cover it
const selectStyles = {
  menu: (provided: CSSObject) => ({ ...provided, zIndex: 5 }),
};

export type ConventionFormWebsiteSectionProps = {
  convention: ConventionFormConvention;
  setConvention: React.Dispatch<React.SetStateAction<ConventionFormConvention>>;
  disabled: boolean;
  rootSite: ConventionAdminConventionQueryData['rootSite'];
  cmsLayouts: ConventionAdminConventionQueryData['convention']['cms_layouts'];
  pages: ConventionAdminConventionQueryData['convention']['pages'];
};

function ConventionFormWebsiteSection({
  convention,
  rootSite,
  setConvention,
  cmsLayouts,
  pages,
  disabled,
}: ConventionFormWebsiteSectionProps) {
  const [setDefaultLayout, setRootPage, setClickwrapAgreement, setHidden] = usePropertySetters(
    setConvention,
    'default_layout',
    'root_page',
    'clickwrap_agreement',
    'hidden',
  );

  return (
    <>
      <SelectWithLabel
        name="default_layout_id"
        label="Default layout for pages"
        value={convention.default_layout}
        isClearable
        getOptionValue={(option) => option?.id.toString() ?? ''}
        getOptionLabel={(option) => option?.name ?? ''}
        options={cmsLayouts}
        onChange={(newValue: typeof convention.default_layout) => setDefaultLayout(newValue)}
        styles={selectStyles}
        disabled={disabled}
      />

      <SelectWithLabel
        name="root_page_id"
        label="Root page"
        value={convention.root_page ?? null}
        isClearable
        getOptionValue={(option) => option?.id.toString() ?? ''}
        getOptionLabel={(option) => option?.name ?? ''}
        options={pages}
        onChange={(newValue: typeof convention.root_page) => setRootPage(newValue)}
        styles={selectStyles}
        disabled={disabled}
      />

      <BooleanInput
        caption={
          <>
            Hide convention from public list on{' '}
            <a href={rootSite.url} target="_blank" rel="noreferrer">
              {rootSite.url}
            </a>
            ?
          </>
        }
        value={convention.hidden}
        onChange={setHidden}
      />

      <fieldset className="mb-4">
        <legend className="col-form-label">
          Clickwrap agreement (if present, all users will be prompted to accept this agreement
          before using the site)
        </legend>
        <LiquidInput
          value={convention.clickwrap_agreement ?? ''}
          onChange={setClickwrapAgreement}
          disabled={disabled}
        />
      </fieldset>
    </>
  );
}

export default ConventionFormWebsiteSection;
