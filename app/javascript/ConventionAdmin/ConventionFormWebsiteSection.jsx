import React from 'react';
import PropTypes from 'prop-types';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import { useChangeDispatchers } from '../ComposableFormUtils';
import SelectWithLabel from '../BuiltInFormControls/SelectWithLabel';
import LiquidInput from '../BuiltInFormControls/LiquidInput';

// Since our selects come right above a CodeMirror, we need to override the z-index on the
// dropdown menu so that the text in the CodeMirror doesn't cover it
const selectStyles = {
  menu: (provided) => ({ ...provided, zIndex: 5 }),
};

function ConventionFormWebsiteSection({
  convention, dispatch, cmsLayouts, pages, disabled,
}) {
  const [
    changeEventMailingListDomain,
    changeEmailFrom,
    changeDefaultLayout,
    changeRootPage,
    changeClickwrapAgreement,
  ] = useChangeDispatchers(
    dispatch,
    ['event_mailing_list_domain', 'email_from', 'default_layout', 'root_page', 'clickwrap_agreement'],
  );

  return (
    <>
      <BootstrapFormInput
        name="email_from"
        label="Email from"
        value={convention.email_from || ''}
        helpText="Site-generated emails will come from this address."
        onTextChange={changeEmailFrom}
        disabled={disabled}
      />

      <BootstrapFormInput
        name="event_mailing_list_domain"
        label="Event mailing list domain name"
        value={convention.event_mailing_list_domain || ''}
        helpText="If present, event teams can use this domain name to create automatically-managed mailing lists for their team."
        onTextChange={changeEventMailingListDomain}
        disabled={disabled}
      />

      <SelectWithLabel
        name="default_layout_id"
        label="Default layout for pages"
        value={convention.default_layout}
        isClearable
        getOptionValue={(option) => option.id}
        getOptionLabel={(option) => option.name}
        options={cmsLayouts}
        onChange={changeDefaultLayout}
        styles={selectStyles}
        disabled={disabled}
      />

      <SelectWithLabel
        name="root_page_id"
        label="Root page"
        value={convention.root_page}
        isClearable
        getOptionValue={(option) => option.id}
        getOptionLabel={(option) => option.name}
        options={pages}
        onChange={changeRootPage}
        styles={selectStyles}
        disabled={disabled}
      />

      <fieldset className="mb-4">
        <legend className="col-form-label">
          Clickwrap agreement (if present, all users will be prompted to accept this agreement
          before using the site)
        </legend>
        <LiquidInput
          value={convention.clickwrap_agreement || ''}
          onChange={changeClickwrapAgreement}
          disabled={disabled}
        />
      </fieldset>
    </>
  );
}

ConventionFormWebsiteSection.propTypes = {
  convention: PropTypes.shape({
    event_mailing_list_domain: PropTypes.string,
    default_layout: PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
    }),
    root_page: PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
    }),
    clickwrap_agreement: PropTypes.string,
    email_from: PropTypes.string,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  cmsLayouts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  pages: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  disabled: PropTypes.bool,
};

ConventionFormWebsiteSection.defaultProps = {
  disabled: false,
};

export default ConventionFormWebsiteSection;
