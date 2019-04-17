import React from 'react';
import PropTypes from 'prop-types';
import { humanize, pluralize } from 'inflected';
import classNames from 'classnames';
import tinycolor2 from 'tinycolor2';

import BooleanInput from '../BuiltInFormControls/BooleanInput';
import BootstrapFormInput from '../BuiltInFormControls/BootstrapFormInput';
import ColorPicker from '../ColorPicker';
import FakeEventRun from '../EventsApp/ScheduleGrid/FakeEventRun';
import MultipleChoiceInput from '../BuiltInFormControls/MultipleChoiceInput';
import { mutator, Transforms } from '../ComposableFormUtils';
import PopperDropdown from '../UIComponents/PopperDropdown';
import SelectWithLabel from '../BuiltInFormControls/SelectWithLabel';

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

function EventCategoryForm({
  value, onChange, forms, disabled, ticketName,
}) {
  const valueMutator = mutator({
    getState: () => value,
    setState: onChange,
    transforms: {
      name: Transforms.identity,
      team_member_name: Transforms.identity,
      scheduling_ui: Transforms.identity,
      default_color: Transforms.identity,
      signed_up_color: Transforms.identity,
      full_color: Transforms.identity,
      event_form: Transforms.identity,
      event_proposal_form: Transforms.identity,
      can_provide_tickets: Transforms.identity,
    },
  });

  return (
    <>
      <BootstrapFormInput
        name="name"
        label="Name"
        value={value.name}
        onTextChange={valueMutator.name}
        disabled={disabled}
      />

      <BootstrapFormInput
        name="team_member_name"
        label="Team member name"
        value={value.team_member_name || ''}
        onTextChange={valueMutator.team_member_name}
        helpText={`
          This is the word the site will use to refer to team members of this event, e.g.
          "GM", "facilitator", etc.
        `}
        disabled={disabled}
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
        disabled={disabled}
      />

      <fieldset className="form-group">
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
                      disabled={disabled}
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
          disabled={disabled}
        >
          Generate signed up and full colors based on default color
        </button>
      </fieldset>

      <SelectWithLabel
        label="Event form (required)"
        options={forms}
        getOptionValue={option => option.id}
        getOptionLabel={option => option.title}
        value={value.event_form}
        onChange={valueMutator.event_form}
        disabled={disabled}
      />

      <SelectWithLabel
        label="Event proposal form (optional; if blank this event category cannot be proposed)"
        options={forms}
        getOptionValue={option => option.id}
        getOptionLabel={option => option.title}
        value={value.event_proposal_form}
        onChange={valueMutator.event_proposal_form}
        disabled={disabled}
        isClearable
      />

      <BooleanInput
        name="can_provide_tickets"
        caption={`Can provide ${pluralize(ticketName)}?`}
        value={value.can_provide_tickets}
        onChange={valueMutator.can_provide_tickets}
      />
    </>
  );
}

EventCategoryForm.propTypes = {
  value: PropTypes.shape({
    name: PropTypes.string,
    team_member_name: PropTypes.string,
    scheduling_ui: PropTypes.string,
    default_color: PropTypes.string,
    signed_up_color: PropTypes.string,
    full_color: PropTypes.string,
    event_form: PropTypes.shape({}),
    event_proposal_form: PropTypes.shape({}),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  forms: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
  })).isRequired,
  disabled: PropTypes.bool,
  ticketName: PropTypes.string.isRequired,
};

EventCategoryForm.defaultProps = {
  disabled: false,
};

export default EventCategoryForm;
