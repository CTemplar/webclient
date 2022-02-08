export const intersection = (a: any[], b: any[]) => a?.filter((x: any) => b?.includes(x));

export const difference = (a: any[], b: any[]) => a?.filter((x: any) => !b?.includes(x));
