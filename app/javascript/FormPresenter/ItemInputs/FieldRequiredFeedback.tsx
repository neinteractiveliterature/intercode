export type FieldRequiredFeedbackProps = {
  valueInvalid: boolean;
};

export default function FieldRequiredFeedback({ valueInvalid }: FieldRequiredFeedbackProps): React.JSX.Element {
  if (!valueInvalid) {
    return <></>;
  }

  return <div className="invalid-feedback">This field is required.</div>;
}
