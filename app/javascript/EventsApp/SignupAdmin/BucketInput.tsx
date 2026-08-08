import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { MultipleChoiceInput } from '@neinteractiveliterature/litform';

import { SignupFieldsFragment } from './queries.generated';
import { ComponentProps } from 'react';

type BucketType = NonNullable<SignupFieldsFragment['run']['event']['registration_policy']>['buckets'][0];

function getLabelForBucketChoice(signup: SignupFieldsFragment, bucket: BucketType, t: TFunction) {
  const addenda = [];
  if (bucket.id === signup.bucket?.id) {
    addenda.push(t('events.signupAdmin.bucketInput.currentBucketLabel'));
  }
  if (bucket.id === signup.requested_bucket?.id) {
    addenda.push(t('events.signupAdmin.bucketInput.userRequestedBucketLabel'));
  }
  const addendaString = addenda.length > 0 ? ` (${addenda.join(', ')})` : '';

  return `${bucket.name}${addendaString}`;
}

function shouldBucketChoiceBeDisabled(signup: SignupFieldsFragment, bucket: BucketType) {
  return bucket.id === signup.bucket?.id || (bucket.anything && signup.bucket != null);
}

export type BucketInputProps = Omit<
  ComponentProps<typeof MultipleChoiceInput>,
  'choices' | 'value' | 'onChange' | 'multiple'
> & {
  signup: SignupFieldsFragment;
  value: string | null | undefined;
  onChange: (newValue: string | null | undefined) => void;
};

export default function BucketInput({ signup, ...otherProps }: BucketInputProps): React.JSX.Element {
  const { t } = useTranslation();
  const bucketChoices = (signup.run.event.registration_policy?.buckets ?? []).map((bucket) => ({
    value: bucket.key,
    label: getLabelForBucketChoice(signup, bucket, t),
    disabled: shouldBucketChoiceBeDisabled(signup, bucket),
  }));

  return <MultipleChoiceInput multiple={false} choices={bucketChoices} {...otherProps} />;
}
