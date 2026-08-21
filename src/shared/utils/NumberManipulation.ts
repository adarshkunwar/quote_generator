export type TClamp = (value: number) => number;

export function clamp(minimum: number, maximum: number): TClamp {
  return function (value: number): number {
    return Math.max(minimum, Math.min(maximum, value));
  };
}
