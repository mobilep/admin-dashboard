export interface Video {
  videoId: string;
  duration: number;
  size: number;
  videoOrientation?: any;
  playList: string;
  dashList: string;
  thumb: string;
  state: State;
}

export enum State {
  CHECKING = 'CHECKING',
  PROCESSING = 'PROCESSING',
  COMPLETED = "COMPLETED"
}

export const inProcessing =
  (video: Video) => Boolean(video && video.state === State.PROCESSING);

export enum VideoOrientation {
  PORTRAIT = "portrait",
  LANDSCAPE = "landscape"
}

export interface VideoObject {
  videoId: string;
  size: number;
  state: State;
  thumbPathHLS: string;
  videoOrientation?: any;
  playPath?: string;
  playPathHLS?: string;
  playPathDASH?: string;
  thumbPath?: string;
  thumbPathDASH?: string;
}
