import { breakValueIntoUnitQuantities } from "../FormPresenter/TimespanItemUtils";

export default function DurationCell({ value }: { value: number | null | undefined }) {
  if (value == null) {
    return <></>;
  }
  const unitQuantities = breakValueIntoUnitQuantities(value);
  const hours = (unitQuantities.find(({ unit }) => unit.name === 'hour') || {}).quantity || 0;
  const minutes = (unitQuantities.find(({ unit }) => unit.name === 'minute') || {}).quantity || 0;

  return <div className="text-nowrap text-end">{`${hours}:${minutes.toString().padStart(2, '0')}`}</div>;
}
