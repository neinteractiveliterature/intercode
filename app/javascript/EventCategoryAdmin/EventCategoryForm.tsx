import { useState } from 'react';
import * as React from 'react';
import { humanize, pluralize } from 'inflected';
import classNames from 'classnames';
import tinycolor2 from 'tinycolor2';
import {
  BootstrapFormInput,
  MultipleChoiceInput,
  BooleanInput,
  BootstrapFormTextarea,
  useToggleOpen,
  useLitformPopperWithAutoClosing,
  usePropertySetters,
} from '@neinteractiveliterature/litform';

import ColorPicker from '../ColorPicker';
import FakeEventRun, { FakeEventRunProps } from '../EventsApp/ScheduleGrid/FakeEventRun';
import SelectWithLabel from '../BuiltInFormControls/SelectWithLabel';
import SignupStatusBadge from '../EventsApp/ScheduleGrid/SignupStatusBadge';
import {
  Department,
  EventCategory,
  Form,
  SchedulingUi,
  TicketMode,
} from '../graphqlTypes.generated';
import { SignupStatus } from '../EventsApp/ScheduleGrid/StylingUtils';

export type EventCategoryForForm = Pick<
  EventCategory,
  | 'name'
  | 'team_member_name'
  | 'proposal_description'
  | 'default_color'
  | 'signed_up_color'
  | 'full_color'
  | 'can_provide_tickets'
> & {
  scheduling_ui?: EventCategory['scheduling_ui'] | null;
  department?: Pick<Department, 'id' | 'name'> | null;
  event_form?: Pick<Form, 'id' | 'title' | 'form_type'> | null;
  event_proposal_form?: Pick<Form, 'id' | 'title' | 'form_type'> | null;
};

function autogenerateColors<T extends EventCategoryForForm>(eventCategory: T) {
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
    signed_up_color:
      signedUpColor.getAlpha() === 1.0 ? signedUpColor.toHexString() : signedUpColor.toRgbString(),
  };
}

type EventColorPickerProps = {
  variant: 'default' | 'full' | 'signed_up';
  eventRunProps: Omit<
    FakeEventRunProps,
    'withRef' | 'onClick' | 'eventCategory' | 'availability' | 'children'
  >;
  eventCategory: EventCategoryForForm;
  color: string | null | undefined;
  setColor: React.Dispatch<string>;
};

function EventColorPicker({
  variant,
  eventRunProps,
  eventCategory,
  color,
  setColor,
}: EventColorPickerProps) {
  const [dropdownButton, setDropdownButton] = useState<HTMLDivElement | null>(null);
  const [tooltip, setTooltip] = useState<HTMLDivElement | null>(null);
  const [arrow, setArrow] = useState<HTMLSpanElement | null>(null);
  const [visible, setVisible] = useState(false);

  const { styles, attributes, state, update } = useLitformPopperWithAutoClosing(
    tooltip,
    dropdownButton,
    arrow,
    setVisible,
  );
  const toggle = useToggleOpen(setVisible, update);

  return (
    <>
      <div className="col-12 col-md-4 col-lg-3 p-1 cursor-pointer">
        <FakeEventRun
          withRef={setDropdownButton}
          onClick={toggle}
          eventCategory={eventCategory}
          availability={variant === 'full' ? 0.0 : 0.5}
          {...eventRunProps}
        >
          <SignupStatusBadge signupStatus={eventRunProps.signupStatus} />
          {humanize(variant)}
        </FakeEventRun>
      </div>
      <div
        className={classNames('card', 'popover', `bs-popover-${state?.placement}`, {
          'd-none': !visible,
        })}
        ref={setTooltip}
        style={styles.popper}
        {...attributes.popper}
      >
        <div className="card-body">
          <ColorPicker value={color} onChange={setColor} />
        </div>
        <span ref={setArrow} style={styles.arrow} className="popover-arrow" />
      </div>
    </>
  );
}

export type EventCategoryFormProps<T extends EventCategoryForForm> = {
  value: T;
  onChange: React.Dispatch<React.SetStateAction<T>>;
  departments: NonNullable<T['department']>[];
  forms: T['event_form'][];
  disabled?: boolean;
  ticketName: string;
  ticketMode: TicketMode;
};

function EventCategoryForm<T extends EventCategoryForForm>({
  value,
  onChange,
  departments,
  forms,
  disabled,
  ticketName,
  ticketMode,
}: EventCategoryFormProps<T>): JSX.Element {
  const [
    setName,
    setTeamMemberName,
    setDepartment,
    setSchedulingUi,
    setDefaultColor,
    setSignedUpColor,
    setFullColor,
    setEventForm,
    setEventProposalForm,
    setCanProvideTickets,
    setProposalDescription,
  ] = usePropertySetters(
    onChange,
    'name',
    'team_member_name',
    'department',
    'scheduling_ui',
    'default_color',
    'signed_up_color',
    'full_color',
    'event_form',
    'event_proposal_form',
    'can_provide_tickets',
    'proposal_description',
  );

  return (
    <>
      <BootstrapFormInput
        name="name"
        label="Name"
        value={value.name}
        onTextChange={setName}
        disabled={disabled}
      />

      <BootstrapFormInput
        name="team_member_name"
        label="Team member name"
        value={value.team_member_name ?? ''}
        onTextChange={setTeamMemberName}
        helpText={`
          This is the word the site will use to refer to team members of this event, e.g.
          "GM", "facilitator", etc.
        `}
        disabled={disabled}
      />

      <SelectWithLabel<T['department'] | null>
        label="Department"
        options={departments}
        getOptionValue={(option) => option?.id.toString() ?? ''}
        getOptionLabel={(option) => option?.name ?? ''}
        value={value.department}
        onChange={(newValue: T['department'] | null | undefined) => setDepartment(newValue)}
        disabled={disabled}
        isClearable
      />

      <BootstrapFormTextarea
        name="proposal_description"
        label="Proposal dialog description"
        value={value.proposal_description ?? ''}
        onTextChange={setProposalDescription}
        helpText={`
          When attendees propose an event and select this category, the proposal dialog will show
          the text you write here.  Use this to describe what they can expect after proposing the
          event.  For example: ”Your proposal will go to the Board Game Proposals Committee.  You‘ll
          hear back within a week or two.“
        `}
        disabled={disabled}
      />

      <MultipleChoiceInput
        name="scheduling_ui"
        caption="Scheduling UI"
        value={value.scheduling_ui}
        onChange={(newValue: SchedulingUi) => setSchedulingUi(newValue)}
        choices={[
          { value: 'regular', label: 'Regular (multi-run)' },
          { value: 'single_run', label: 'Single run' },
          { value: 'recurring', label: 'Recurring' },
        ]}
        disabled={disabled}
      />

      <fieldset className="mb-3">
        <legend className="col-form-label">Colors</legend>

        <div className="d-flex flex-wrap">
          {(
            [
              {
                variant: 'default',
                color: value.default_color,
                setColor: setDefaultColor,
                eventRunProps: {},
              },
              {
                variant: 'signed_up',
                color: value.signed_up_color,
                setColor: setSignedUpColor,
                eventRunProps: { signupStatus: SignupStatus.Confirmed },
              },
              {
                variant: 'full',
                color: value.full_color,
                setColor: setFullColor,
                eventRunProps: { runFull: true },
              },
            ] as const
          ).map(({ variant, color, setColor, eventRunProps }) => (
            <EventColorPicker
              key={variant}
              variant={variant}
              eventRunProps={eventRunProps}
              eventCategory={value}
              color={color}
              setColor={setColor}
            />
          ))}
        </div>

        <button
          type="button"
          className="mt-2 ms-1 btn btn-sm btn-outline-secondary"
          onClick={() => onChange(autogenerateColors(value))}
          disabled={disabled}
        >
          Generate signed up and full colors based on default color
        </button>
      </fieldset>

      <SelectWithLabel
        label="Event form (required)"
        options={forms.filter((form) => form?.form_type === 'event')}
        getOptionValue={(option) => option?.id.toString() ?? ''}
        getOptionLabel={(option) => option?.title ?? ''}
        value={value.event_form}
        onChange={(newValue: T['event_form']) => setEventForm(newValue)}
        disabled={disabled}
      />

      <SelectWithLabel
        label="Event proposal form (optional; if blank this event category cannot be proposed)"
        options={forms.filter((form) => form?.form_type === 'event_proposal')}
        getOptionValue={(option) => option?.id.toString() ?? ''}
        getOptionLabel={(option) => option?.title ?? ''}
        value={value.event_proposal_form}
        onChange={(newValue: T['event_proposal_form'] | null | undefined) =>
          setEventProposalForm(newValue)
        }
        disabled={disabled}
        isClearable
      />

      {ticketMode !== 'disabled' && (
        <BooleanInput
          name="can_provide_tickets"
          caption={`Can provide ${pluralize(ticketName)}?`}
          value={value.can_provide_tickets ?? false}
          onChange={setCanProvideTickets}
        />
      )}
    </>
  );
}

export default EventCategoryForm;
