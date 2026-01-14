




export const getPercentage = (value: number, total: number): number => {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}
