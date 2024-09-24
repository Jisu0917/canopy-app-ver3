/* eslint-disable @typescript-eslint/no-explicit-any */
export type RelatedData<T = any> = {
  id: number;
  data: T;
};

export interface Option {
  id: number;
  label: string;
}
