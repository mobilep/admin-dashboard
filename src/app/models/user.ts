export interface User {
  _id: string;
  avatar_lg?: any;
  avatar_md?: any;
  avatar_sm?: any;
  avatarColor: string;
  country: string;
  createdAt: string;
  email: string;
  extraInformation: ExtraInformation[];
  firstName: string;
  havePassword: boolean;
  isActive: boolean;
  isInviteSent: boolean;
  lang: string;
  lastName: string;
  messagesCount: number;
  name: string;
  postcode: string;
  videosCount: number;
  isSelected?: boolean;
  isCoach: boolean;
}

interface ExtraInformation {
  title: string;
  description: string;
}
