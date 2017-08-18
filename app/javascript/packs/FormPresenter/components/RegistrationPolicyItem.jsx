// @flow

import React from 'react';
import { enableUniqueIds } from 'react-html-id';
import RegistrationPolicy, { type RegistrationPolicyAPIRepresentation } from '../../Models/RegistrationPolicy';
import RegistrationPolicyEditor from '../../BuiltInFormControls/RegistrationPolicyEditor';
import type { RegistrationPolicyPreset } from '../../BuiltInFormControls/RegistrationPolicyEditor';

type Props = {
  formItem: {},
  value?: RegistrationPolicyAPIRepresentation,
  onChange: (any) => undefined,
};

type State = {
  registrationPolicy: RegistrationPolicy,
};

const presets: Array<RegistrationPolicyPreset> = [
  {
    name: 'Unlimited slots',
    policy: {
      buckets: [
        {
          key: 'unlimited',
          name: 'Signups',
          description: 'Signups for this event',
          slots_limited: true,
        },
      ],
    },
  },
  {
    name: 'Limited slots',
    policy: {
      buckets: [
        {
          key: 'signups',
          name: 'Signups',
          description: 'Signups for this event',
          slots_limited: true,
        },
      ],
    },
  },
  {
    name: 'Limited slots by gender',
    policy: {
      buckets: [
        {
          key: 'male',
          name: 'Male',
          description: 'Male characters',
          slots_limited: true,
        },
        {
          key: 'female',
          name: 'Female',
          description: 'Female characters',
          slots_limited: true,
        },
        {
          key: 'anything',
          name: 'Anything',
          description: 'Characters that are not strictly defined as male or female',
          slots_limited: true,
          anything: true,
        },
      ],
    },
  },
];

class RegistrationPolicyItem extends React.Component {
  constructor(props: Props) {
    super(props);
    enableUniqueIds(this);

    this.state = {
      registrationPolicy: RegistrationPolicy.fromAPI(this.props.value),
    };
  }

  state: State
  props: Props

  registrationPolicyChanged = (newRegistrationPolicy: RegistrationPolicy) => {
    this.setState(
      { registrationPolicy: newRegistrationPolicy },
      () => { this.props.onChange(newRegistrationPolicy.getAPIRepresentation()); },
    );
  }

  render = () => (
    <fieldset className="form-group">
      <RegistrationPolicyEditor
        registrationPolicy={this.state.registrationPolicy}
        onChange={this.registrationPolicyChanged}
        presets={presets}
      />
    </fieldset>
  )
}

export default RegistrationPolicyItem;
