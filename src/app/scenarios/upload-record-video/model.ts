interface Width {
  ideal: number;
}

interface Height {
  ideal: number;
}

interface Video {
  width: Width;
  height: Height;
  deviceId?: string;
}


export interface Constraint {
  video: Video;
  audio: boolean;
}

interface Constraints {
  hq: Constraint;
  mq: Constraint;
}

export interface Recording {
  CODECS: string;
  TIME_SLICE: number;
  MAX_LENGTH: number;
  CONSTRAINTS: Constraints;
}


export interface RecorderOptions {
  mimeType?: string;
  videobitspersecond?: number;
}
