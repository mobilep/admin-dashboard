import { IS_COACH_OPTIONS } from '../components/people/people-filters/constants';

export interface PeopleFilters {
  name: string;
  email: string;
  isInviteSent: string;
  country: string;
  businessUnit: string;
  isCoach: IS_COACH_OPTIONS;
  region: string;
  globalRegion: string;
}
