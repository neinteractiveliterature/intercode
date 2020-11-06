export type SignupChoiceCellProps = {
  value?: number | null;
  original: {
    counted?: boolean | null;
  };
};

const SignupChoiceCell = ({ value, original }: SignupChoiceCellProps) => {
  if (original.counted) {
    return <>{value}</>;
  }

  return <>N/C</>;
};

export default SignupChoiceCell;
