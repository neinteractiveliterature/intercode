import { DateTime } from 'luxon';
import { waitFor, render, fireEvent } from '../testUtils';
import ConventionForm, {
  ConventionFormConvention,
  ConventionFormProps,
} from '../../../app/javascript/ConventionAdmin/ConventionForm';
import {
  EmailMode,
  ShowSchedule,
  SignupAutomationMode,
  SignupMode,
  SiteMode,
  TicketMode,
  TimezoneMode,
} from '../../../app/javascript/graphqlTypes.generated';

describe('ConventionForm', () => {
  const defaultInitialConvention: ConventionFormConvention = {
    __typename: 'Convention',
    canceled: false,
    cmsLayouts: [],
    defaultLayout: {
      __typename: 'CmsLayout',
      id: '0',
    },
    email_from: 'noreply@convention.test',
    id: '0',
    language: 'en',
    cmsPages: [],
    signup_requests_open: false,
    stripe_account_ready_to_charge: true,
    ticket_mode: TicketMode.RequiredForSignup,
    starts_at: '',
    ends_at: '',
    name: '',
    domain: 'convention.test',
    timezone_name: 'America/New_York',
    timezone_mode: TimezoneMode.ConventionLocal,
    site_mode: SiteMode.Convention,
    signup_mode: SignupMode.SelfService,
    signup_automation_mode: SignupAutomationMode.None,
    accepting_proposals: false,
    show_schedule: ShowSchedule.No,
    show_event_list: ShowSchedule.No,
    hidden: false,
    maximum_event_signups: {
      timespans: [{ start: null, finish: null, value: 'unlimited' }],
    },
    maximum_tickets: null,
    ticket_name: 'ticket',
    ticketNamePlural: 'tickets',
    staff_positions: [],
    email_mode: EmailMode.Forward,
    rootPage: {
      __typename: 'Page',
      id: '0',
    },
  };

  const renderConventionForm = (
    props?: Partial<ConventionFormProps>,
    initialConventionProps?: Partial<ConventionFormConvention>,
  ) =>
    render(
      <ConventionForm
        initialConvention={{ ...defaultInitialConvention, ...initialConventionProps }}
        rootSite={{ __typename: 'RootSite', url: 'https://example.com', id: '123' }}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        saveConvention={async () => {}}
        cmsLayouts={[]}
        pages={[]}
        {...props}
      />,
    );

  test('it renders the given values', async () => {
    const now = DateTime.fromISO('2019-04-18T18:34:04.283Z', { zone: 'Etc/UTC' }).toISO();
    const { getByLabelText, getByText, getMultipleChoiceInput } = await renderConventionForm(
      {},
      {
        ...defaultInitialConvention,
        starts_at: now,
        ends_at: now,
        name: 'myName',
        domain: 'myDomain',
        timezone_name: 'Etc/UTC',
        accepting_proposals: true,
        show_schedule: ShowSchedule.Gms,
        maximum_event_signups: {
          timespans: [
            { start: null, finish: now, value: 'not_yet' },
            { start: now, finish: null, value: 'unlimited' },
          ],
        },
        maximum_tickets: 100,
      },
    );

    expect((getByLabelText('Convention starts') as HTMLInputElement).value).toEqual('2019-04-18');
    expect((getByLabelText('Convention ends') as HTMLInputElement).value).toEqual('2019-04-18');
    expect((getByLabelText('Name') as HTMLInputElement).value).toEqual('myName');
    expect((getByLabelText('Convention domain name') as HTMLInputElement).value).toEqual('myDomain');
    expect(getByText('Time zone').closest('div')).toHaveTextContent(
      'Time zoneUTC+00:00 Etc/UTC (Coordinated Universal Time)',
    );

    fireEvent.click(getByText('Events'));

    expect(getMultipleChoiceInput('Accepting event proposals', 'Yes')?.checked).toBe(true);
    expect(
      getMultipleChoiceInput(
        'Show event schedule',
        'Only to event team members and users with any schedule viewing permissions',
      )?.checked,
    ).toBe(true);

    fireEvent.click(getByText('Payments'));
    expect((getByLabelText('Maximum tickets') as HTMLInputElement).value).toEqual('100');
  });

  test('mutating form fields', async () => {
    const { getByText, getMultipleChoiceInput } = await renderConventionForm();

    fireEvent.click(getByText('Events'));
    expect(getMultipleChoiceInput('Accepting event proposals', 'Yes')?.checked).toBe(false);
    fireEvent.change(getMultipleChoiceInput('Accepting event proposals', 'Yes'), {
      target: { checked: true },
    });
    expect(getMultipleChoiceInput('Accepting event proposals', 'Yes')?.checked).toBe(true);
  });

  test('onClickSave', async () => {
    const saveConvention = jest.fn();
    const { getByText } = await renderConventionForm({ saveConvention });

    fireEvent.click(getByText('Save settings'), { selector: 'button' });
    await waitFor(() => expect(saveConvention).toHaveBeenCalledTimes(1));
    expect(saveConvention).toHaveBeenCalledWith(defaultInitialConvention, undefined, undefined);
  });
});
