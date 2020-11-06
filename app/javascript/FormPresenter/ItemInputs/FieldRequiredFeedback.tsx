export type FieldRequiredFeedbackProps = {
  valueInvalid: boolean;
};

const FieldRequiredFeedback = ({ valueInvalid }: FieldRequiredFeedbackProps) => {
  if (!valueInvalid) {
    return <></>;
  }

  return <div className="invalid-feedback">This field is required.</div>;
};

export default FieldRequiredFeedback;
