import SignupButtonDisplay from './SignupButtonDisplay';
import { SignupOption } from './buildSignupOptions';

export type SignupButtonsProps = {
  signupOptions: SignupOption[];
  onClick?: (signupOption: SignupOption) => void;
  disabled?: boolean;
};

function SignupButtons({ signupOptions, onClick, disabled }: SignupButtonsProps): JSX.Element {
  if (signupOptions.length === 0) {
    return <></>;
  }

  return (
    <div className="d-flex flex-wrap justify-content-center">
      {signupOptions.map((signupOption) => (
        <SignupButtonDisplay key={signupOption.key} signupOption={signupOption} onClick={onClick} disabled={disabled} />
      ))}
    </div>
  );
}

export default SignupButtons;
