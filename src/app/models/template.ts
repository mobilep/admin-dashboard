interface User {
  _id: string;
  firstName: string;
  lastName: string;
}

interface Log {
  user: User;
  sentAt: Date;
}

export interface Video {
  videoId: string;
  duration: number;
  size: number;
  videoOrientation: string;
  playList: string;
  dashList: string;
  thumb: string;
}

export interface Template {
  _id: string;
  updatedAt: Date;
  createdAt: Date;
  dueDate: number;
  videoId: string;
  _company: string;
  logs: Log[];
  isActive: boolean;
  canEditVideo: boolean;
  examples: any[];
  _criterias: any[];
  steps: string[];
  size: number;
  duration: number;
  videoOrientation: string;
  info: string;
  name: string;
  video: Video;
}
