export interface Person {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  lang: string;
  postcode: string;
  extraInformation: ExtraInformation[];
  isCompanyAdmin: boolean;
  password: string;
}

export interface ExtraInformation {
  title: string;
  description: string;
}
