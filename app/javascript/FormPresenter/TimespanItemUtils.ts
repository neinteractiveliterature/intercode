export type TimeUnit = {
  name: 'hour' | 'minute';
  length_seconds: number;
};

export const UNITS: TimeUnit[] = [
  { name: 'hour', length_seconds: 60 * 60 },
  { name: 'minute', length_seconds: 60 },
];

export function isUnitName(name: string): name is TimeUnit['name'] {
  return UNITS.some((unit) => unit.name === name);
}

export function getUnitForValue(value: unknown): TimeUnit {
  if (typeof value === 'number') {
    return UNITS.find((unit) => value % unit.length_seconds === 0) || UNITS[UNITS.length - 1];
  }

  return UNITS[0];
}

export function breakValueIntoUnitQuantities(
  value: number,
): { unit: TimeUnit; quantity: number }[] {
  let accumulatedSeconds = 0;
  return UNITS.map((unit) => {
    const workingValue = value - accumulatedSeconds;
    const unitQuantity = Math.floor(workingValue / unit.length_seconds);
    accumulatedSeconds += unitQuantity * unit.length_seconds;
    return { unit, quantity: unitQuantity };
  }).filter(({ quantity }) => quantity > 0);
}
