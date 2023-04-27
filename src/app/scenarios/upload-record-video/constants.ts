import { Recording } from './model';

export const osName = {
  ANDROID: 'Android',
  IOS: 'iOS',
  WINDOWS: 'Windows',
};

export const recording = {
  CODECS: 'video/webm;codecs=vp9',
  TIME_SLICE: 100,
  MAX_LENGTH: 600000,
  CONSTRAINTS: {
    hq: {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: true,
    },
    mq: {
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
      },
      audio: true,
    },
  },
} as Recording;

export const DRAG_START_EVENTS = ['dragover', 'dragenter', 'dragstart'];
export const DRAG_END_EVENTS = ['dragleave', 'dragend', 'drop'];

export const ALLOWED_FILE_FORMATS = {
  photo: {
    jpg: ['image/jpeg', 'image/x-citrix-jpeg'],
    png: ['image/png', 'image/x-citrix-png', 'image/x-png'],
  },
  image: {
    jpg: ['image/jpeg', 'image/x-citrix-jpeg'],
    png: ['image/png', 'image/x-citrix-png', 'image/x-png'],
    gif: ['image/gif'],
  },
  video: {
    mp4: ['video/mp4', 'application/mp4'],
    mov: ['video/quicktime'],
  },
  file: {
    pdf: ['application/pdf'],
  },
};

export const MAX_FILE_SIZE_MB = {
  video: 100,
  photo: 100,
  image: 10,
  file: 100,
};
