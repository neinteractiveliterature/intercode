import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import BooleanInput from '../../BuiltInFormControls/BooleanInput';
import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';
import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import SelectWithLabel from '../../BuiltInFormControls/SelectWithLabel';
import { sortByLocaleString } from '../../ValueUtils';
import { transformsReducer } from '../../ComposableFormUtils';
import useUniqueId from '../../useUniqueId';

export const pageReducer = transformsReducer({});

function CmsPageForm({
  page, dispatch, cmsParent, cmsLayouts, readOnly,
}) {
  const changeCallback = (key) => (value) => dispatch({ type: 'change', key, value });
  const slugInputId = useUniqueId('slug-');

  const cmsLayoutOptions = useMemo(
    () => sortByLocaleString(cmsLayouts, (layout) => layout.name).map((layout) => {
      if (cmsParent.default_layout && cmsParent.default_layout.id === layout.id) {
        return {
          ...layout,
          name: `${layout.name} (site default)`,
        };
      }

      return layout;
    }),
    [cmsLayouts, cmsParent.default_layout],
  );

  const cmsLayoutSelectPlaceholder = (
    cmsParent.default_layout
      ? `Default layout (currently set as ${cmsParent.default_layout.name})`
      : 'Default layout'
  );

  return (
    <>
      <BootstrapFormInput
        label="Name"
        value={page.name || ''}
        onTextChange={changeCallback('name')}
        readOnly={readOnly}
      />

      <BootstrapFormInput
        label="Admin notes"
        value={page.admin_notes || ''}
        onTextChange={changeCallback('admin_notes')}
        readOnly={readOnly}
      />

      <div className="form-group">
        <label htmlFor={slugInputId}>
          URL
        </label>
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">
              {`${new URL('/pages', window.location.href).toString()}/`}
            </span>
          </div>
          <input
            id={slugInputId}
            className="form-control"
            value={page.slug || ''}
            onChange={(event) => changeCallback('slug')(event.target.value)}
            readOnly={readOnly}
          />
        </div>
      </div>

      <BooleanInput
        caption="Skip clickwrap agreement"
        helpText="If selected, this page will not check whether the user has accepted the site clickwrap agreement."
        value={page.skip_clickwrap_agreement || false}
        onChange={changeCallback('skip_clickwrap_agreement')}
        disabled={readOnly}
      />

      <BooleanInput
        caption="Hidden from search"
        helpText="If selected, this page will not appear in site search results."
        value={page.hidden_from_search || false}
        onChange={changeCallback('hidden_from_search')}
        disabled={readOnly}
      />

      <SelectWithLabel
        label="Layout"
        value={page.cms_layout}
        isClearable
        getOptionValue={(option) => option.id}
        getOptionLabel={(option) => option.name}
        options={cmsLayoutOptions}
        onChange={changeCallback('cms_layout')}
        placeholder={cmsLayoutSelectPlaceholder}
        disabled={readOnly}
      />

      <div className="form-group">
        <legend className="col-form-label">Content</legend>
        <LiquidInput
          value={page.content}
          onChange={changeCallback('content')}
          codeMirrorOptions={{ readOnly }}
        />
      </div>
    </>
  );
}

CmsPageForm.propTypes = {
  page: PropTypes.shape({
    name: PropTypes.string,
    admin_notes: PropTypes.string,
    slug: PropTypes.string,
    skip_clickwrap_agreement: PropTypes.bool,
    hidden_from_search: PropTypes.bool,
    cms_layout: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
    content: PropTypes.string,
  }).isRequired,
  dispatch: PropTypes.func,
  cmsParent: PropTypes.shape({
    default_layout: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }).isRequired,
  cmsLayouts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  readOnly: PropTypes.bool,
};

CmsPageForm.defaultProps = {
  readOnly: false,
  dispatch: null,
};

export default CmsPageForm;
