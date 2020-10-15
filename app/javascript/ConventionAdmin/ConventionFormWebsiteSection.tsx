import React, { CSSProperties } from 'react';

import SelectWithLabel from '../BuiltInFormControls/SelectWithLabel';
import LiquidInput from '../BuiltInFormControls/LiquidInput';
import BooleanInput from '../BuiltInFormControls/BooleanInput';
import type { ConventionFormConvention } from './ConventionForm';
import { ConventionAdminConventionQueryQuery } from './queries.generated';
import { usePartialState, usePartialStateFactory } from '../usePartialState';

// Since our selects come right above a CodeMirror, we need to override the z-index on the
// dropdown menu so that the text in the CodeMirror doesn't cover it
const selectStyles = {
  menu: (provided: CSSProperties) => ({ ...provided, zIndex: 5 }),
};

export type ConventionFormWebsiteSectionProps = {
  convention: ConventionFormConvention;
  setConvention: React.Dispatch<React.SetStateAction<ConventionFormConvention>>;
  disabled: boolean;
  rootSite: ConventionAdminConventionQueryQuery['rootSite'];
  cmsLayouts: ConventionAdminConventionQueryQuery['convention']['cms_layouts'];
  pages: ConventionAdminConventionQueryQuery['convention']['pages'];
};

function ConventionFormWebsiteSection({
  convention,
  rootSite,
  setConvention,
  cmsLayouts,
  pages,
  disabled,
}: ConventionFormWebsiteSectionProps) {
  const factory = usePartialStateFactory(convention, setConvention);
  const [defaultLayout, setDefaultLayout] = usePartialState(factory, 'default_layout');
  const [rootPage, setRootPage] = usePartialState(factory, 'root_page');
  const [clickwrapAgreement, setClickwrapAgreement] = usePartialState(
    factory,
    'clickwrap_agreement',
  );
  const [hidden, setHidden] = usePartialState(factory, 'hidden');

  return (
    <>
      <SelectWithLabel
        name="default_layout_id"
        label="Default layout for pages"
        value={defaultLayout}
        isClearable
        getOptionValue={(option) => option.id.toString()}
        getOptionLabel={(option) => option.name ?? ''}
        options={cmsLayouts}
        onChange={(newValue: typeof defaultLayout) => setDefaultLayout(newValue)}
        styles={selectStyles}
        disabled={disabled}
      />

      <SelectWithLabel
        name="root_page_id"
        label="Root page"
        value={convention.root_page}
        isClearable
        getOptionValue={(option) => option.id.toString()}
        getOptionLabel={(option) => option.name ?? ''}
        options={pages}
        onChange={(newValue: typeof rootPage) => setRootPage(newValue)}
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
        value={hidden}
        onChange={setHidden}
      />

      <fieldset className="mb-4">
        <legend className="col-form-label">
          Clickwrap agreement (if present, all users will be prompted to accept this agreement
          before using the site)
        </legend>
        <LiquidInput
          value={clickwrapAgreement || ''}
          onChange={setClickwrapAgreement}
          disabled={disabled}
        />
      </fieldset>
    </>
  );
}

export default ConventionFormWebsiteSection;
