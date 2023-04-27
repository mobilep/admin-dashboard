export interface ScenarioDetails {
  name: string;
  info: string;
  _company: string;
  coach: Coach;
  video: VideoObject;
  steps: string[];
  criterias: string[];
  bestPractices: BestPractice[];
}

interface BestPractice {
  name: string;
  video: VideoObject;
}

export interface VideoObject {
  videoId: string;
  duration: number;
  size: number;
  videoOrientation: string;
  playList: string;
  dashList: string;
  thumb: string;
}

interface Coach {
  _id: string;
  name: string;
  firstName: string;
  lastName: string;
  avatarSm: string;
  avatarMd: string;
  avatarLg: string;
  avatarColor: string;
}
