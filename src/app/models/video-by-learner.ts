export interface Video {
  url: string;
  id: string;
  creationTime: any;
}

export interface VideoByLearner {
  userName: string;
  videos: Video[];
}
