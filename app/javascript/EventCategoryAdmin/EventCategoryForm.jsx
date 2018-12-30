import React from 'react';
import PropTypes from 'prop-types';
import { humanize } from 'inflected';
import classNames from 'classnames';
import tinycolor2 from 'tinycolor2';

import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import ColorPicker from '../ColorPicker';
import FakeEventRun from '../EventsApp/ScheduleGrid/FakeEventRun';
import { mutator, Transforms } from '../ComposableFormUtils';
import PopperDropdown from '../UIComponents/PopperDropdown';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';

function autogenerateColors(eventCategory) {
  if (!eventCategory.default_color) {
    return eventCategory;
  }

  const signedUpColor = tinycolor2(eventCategory.default_color);
  signedUpColor.darken(50);

  const fullColor = tinycolor2(eventCategory.default_color);
  fullColor.setAlpha(fullColor.getAlpha() - 0.3);

  return {
    ...eventCategory,
    full_color: fullColor.toRgbString(),
    signed_up_color: (
      signedUpColor.getAlpha() === 1.0
        ? signedUpColor.toHexString()
        : signedUpColor.toRgbString()
    ),
  };
}

function EventCategoryForm({ value, onChange }) {
  const valueMutator = mutator({
    getState: () => value,
    setState: onChange,
    transforms: {
      name: Transforms.textInputChange,
      team_member_name: Transforms.textInputChange,
      default_color: Transforms.identity,
    },
  });

  return (
    <>
      <BootstrapFormInput
        name="name"
        label="Name"
        value={value.name}
        onChange={valueMutator.name}
      />

      <BootstrapFormInput
        name="team_member_name"
        label="Team member name"
        value={value.team_member_name || ''}
        onChange={valueMutator.team_member_name}
        helpText={`
          This is the word the site will use to refer to team members of this event, e.g.
          "GM", "facilitator", etc.
        `}
      />

      <MultipleChoiceInput
        name="scheduling_ui"
        caption="Scheduling UI"
        value={value.scheduling_ui}
        onChange={valueMutator.scheduling_ui}
        choices={[
          { value: 'regular', label: 'Regular (multi-run)' },
          { value: 'single_run', label: 'Single run' },
          { value: 'recurring', label: 'Recurring' },
        ]}
      />

      <fieldset>
        <legend className="col-form-label">Colors</legend>

        <div className="d-flex flex-wrap">
          {[
            { variant: 'default', eventRunProps: {} },
            { variant: 'signed_up', eventRunProps: { signupStatus: 'confirmed' } },
            { variant: 'full', eventRunProps: { runFull: true } },
          ].map(({ variant, eventRunProps }) => (
            <PopperDropdown
              placement="bottom"
              renderReference={({ ref, toggle }) => (
                <div className="col-12 col-md-4 col-lg-3 p-1 cursor-pointer">
                  <FakeEventRun
                    withRef={ref}
                    clickable
                    onClick={toggle}
                    eventCategory={value}
                    availability={1.0}
                    {...eventRunProps}
                  >
                    {humanize(variant)}
                  </FakeEventRun>
                </div>
              )}
            >
              {({
                placement,
                visible,
                arrowProps,
                ref,
                style,
              }) => (
                <div
                  className={classNames(
                    'card',
                    'popover',
                    `bs-popover-${placement}`,
                    { 'd-none': !visible },
                  )}
                  ref={ref}
                  style={style}
                  data-placement={placement}
                >
                  <div className="card-body">
                    <ColorPicker
                      value={value[`${variant}_color`]}
                      onChange={valueMutator[`${variant}_color`]}
                    />
                  </div>
                  <span ref={arrowProps.ref} style={arrowProps.style} className="arrow" />
                </div>
              )}
            </PopperDropdown>
          ))}
        </div>

        <button
          type="button"
          className="mt-2 ml-1 btn btn-sm btn-outline-secondary"
          onClick={() => onChange(autogenerateColors(value))}
        >
          Generate signed up and full colors based on default color
        </button>
      </fieldset>
    </>
  );
}

EventCategoryForm.propTypes = {
  value: PropTypes.shape({
    name: PropTypes.string,
    team_member_name: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default EventCategoryForm;
