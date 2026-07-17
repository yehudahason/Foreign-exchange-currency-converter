export function downsample<T>(arr: T[], maxPoints: number) {
  if (arr.length <= maxPoints) return arr;

  const step = Math.ceil(arr.length / maxPoints);

  return arr.filter((_, i) => i % step === 0 || i === arr.length - 1);
}
