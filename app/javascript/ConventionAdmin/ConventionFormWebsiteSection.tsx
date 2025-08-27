import { CSSObject } from '@emotion/serialize';
import * as React from 'react';
import { BooleanInput, HelpText, usePropertySetters } from '@neinteractiveliterature/litform';

import SelectWithLabel from '../BuiltInFormControls/SelectWithLabel';
import LiquidInput from '../BuiltInFormControls/LiquidInput';
import type { ConventionFormConvention } from './ConventionForm';
import { ConventionAdminConventionQueryData } from './queries.generated';
import FileInputWithPreview from '../CmsAdmin/CmsFilesAdmin/FileInputWithPreview';
import { useTranslation } from 'react-i18next';

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
  cmsLayouts: ConventionAdminConventionQueryData['convention']['cmsLayouts'];
  pages: ConventionAdminConventionQueryData['convention']['cmsPages'];
  openGraphImage: File | null | undefined;
  setOpenGraphImage: React.Dispatch<File | null | undefined>;
  favicon: File | null | undefined;
  setFavicon: React.Dispatch<File | null | undefined>;
};

function ConventionFormWebsiteSection({
  convention,
  rootSite,
  setConvention,
  cmsLayouts,
  pages,
  disabled,
  openGraphImage,
  setOpenGraphImage,
  favicon,
  setFavicon,
}: ConventionFormWebsiteSectionProps): React.JSX.Element {
  const [setDefaultLayout, setRootPage, setClickwrapAgreement, setHidden] = usePropertySetters(
    setConvention,
    'defaultLayout',
    'rootPage',
    'clickwrap_agreement',
    'hidden',
  );
  const { t } = useTranslation();

  return (
    <>
      <SelectWithLabel
        name="default_layout_id"
        label="Default layout for pages"
        value={convention.defaultLayout}
        isClearable
        getOptionValue={(option) => option?.id.toString() ?? ''}
        getOptionLabel={(option) => option?.name ?? ''}
        options={cmsLayouts}
        onChange={(newValue: typeof convention.defaultLayout) => setDefaultLayout(newValue)}
        styles={selectStyles}
        isDisabled={disabled}
      />
      <SelectWithLabel
        name="root_page_id"
        label="Root page"
        value={convention.rootPage ?? null}
        isClearable
        getOptionValue={(option) => option?.id.toString() ?? ''}
        getOptionLabel={(option) => option?.name ?? ''}
        options={pages}
        onChange={(newValue: typeof convention.rootPage) => setRootPage(newValue)}
        styles={selectStyles}
        isDisabled={disabled}
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
          Clickwrap agreement (if present, all users will be prompted to accept this agreement before using the site)
        </legend>
        <LiquidInput
          value={convention.clickwrap_agreement ?? ''}
          onChange={setClickwrapAgreement}
          disabled={disabled}
        />
      </fieldset>
      <fieldset className="mb-4">
        <legend className="col-form-label">{t('admin.convention.openGraphImageLabel')}</legend>
        <HelpText>{t('admin.convention.openGraphImageHelpText')}</HelpText>
        <FileInputWithPreview
          existingFileUrl={convention.open_graph_image?.url}
          file={openGraphImage}
          onChange={setOpenGraphImage}
          disabled={disabled}
        />
      </fieldset>
      <fieldset className="mb-4">
        <legend className="col-form-label">{t('admin.convention.faviconLabel')}</legend>
        <HelpText>{t('admin.convention.faviconHelpText')}</HelpText>
        <FileInputWithPreview
          existingFileUrl={convention.favicon?.url}
          file={favicon}
          onChange={setFavicon}
          disabled={disabled}
        />
      </fieldset>
    </>
  );
}

export default ConventionFormWebsiteSection;
