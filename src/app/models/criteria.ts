export interface Criteria {
  _id: string;
  updatedAt: Date;
  createdAt: Date;
  name: string;
  _company: string;
  __v: number;
  isActive: boolean;
}

export const findByName = (name: string, criteria: Criteria) => criteria => criteria.name.toLowerCase().includes(name.toLowerCase());
