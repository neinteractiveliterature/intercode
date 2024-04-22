import { useMemo } from 'react';
import { SignupRankedChoice } from '../../graphqlTypes.generated';
import SignupButtonDisplay from './SignupButtonDisplay';
import { SignupOption } from './buildSignupOptions';
import sortBy from 'lodash/sortBy';

export type SignupButtonsProps = {
  signupOptions: SignupOption[];
  onClick?: (signupOption: SignupOption) => void;
  disabled?: boolean;
  myPendingRankedChoices: Pick<SignupRankedChoice, 'requested_bucket_key' | 'priority'>[];
};

function SignupButtons({ signupOptions, onClick, disabled, myPendingRankedChoices }: SignupButtonsProps): JSX.Element {
  const rankedChoicesSorted = useMemo(
    () => sortBy(myPendingRankedChoices, (choice) => choice.priority),
    [myPendingRankedChoices],
  );

  if (signupOptions.length === 0) {
    return <></>;
  }

  return (
    <div className="d-flex flex-wrap justify-content-center">
      {signupOptions.map((signupOption) => (
        <SignupButtonDisplay
          key={signupOption.key}
          signupOption={signupOption}
          onClick={onClick}
          disabled={disabled}
          rankedChoices={rankedChoicesSorted.filter(
            (choice) => choice.requested_bucket_key === signupOption.bucket?.key,
          )}
        />
      ))}
    </div>
  );
}

export default SignupButtons;
