export type GetRadians = (degrees: number) => number;
export const getRadians = (degrees: number) => (Math.PI / 180) * degrees;
