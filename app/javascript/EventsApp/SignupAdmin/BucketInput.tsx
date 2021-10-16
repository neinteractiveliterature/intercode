import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { MultipleChoiceInput } from '@neinteractiveliterature/litform';
import { MultipleChoiceInputProps } from '@neinteractiveliterature/litform/lib/MultipleChoiceInput';

import { SignupFieldsFragment } from './queries.generated';

type BucketType = NonNullable<
  SignupFieldsFragment['run']['event']['registration_policy']
>['buckets'][0];

function getLabelForBucketChoice(signup: SignupFieldsFragment, bucket: BucketType, t: TFunction) {
  const addenda = [];
  if (bucket.key === signup.bucket_key) {
    addenda.push(t('events.signupAdmin.bucketInput.currentBucketLabel', 'current'));
  }
  if (bucket.key === signup.requested_bucket_key) {
    addenda.push(t('events.signupAdmin.bucketInput.userRequestedBucketLabel', 'user requested'));
  }
  const addendaString = addenda.length > 0 ? ` (${addenda.join(', ')})` : '';

  return `${bucket.name}${addendaString}`;
}

function shouldBucketChoiceBeDisabled(signup: SignupFieldsFragment, bucket: BucketType) {
  return bucket.key === signup.bucket_key || (bucket.anything && signup.bucket_key != null);
}

export type BucketInputProps = Omit<
  MultipleChoiceInputProps,
  'choices' | 'value' | 'onChange' | 'multiple'
> & {
  signup: SignupFieldsFragment;
  value: string | null | undefined;
  onChange: (newValue: string | null | undefined) => void;
};

export default function BucketInput({ signup, ...otherProps }: BucketInputProps): JSX.Element {
  const { t } = useTranslation();
  const bucketChoices = (signup.run.event.registration_policy?.buckets ?? []).map((bucket) => ({
    value: bucket.key,
    label: getLabelForBucketChoice(signup, bucket, t),
    disabled: shouldBucketChoiceBeDisabled(signup, bucket),
  }));

  return <MultipleChoiceInput multiple={false} choices={bucketChoices} {...otherProps} />;
}
