import userAgent from 'ua-parser-js';

import { ALLOWED_FILE_FORMATS, MAX_FILE_SIZE_MB, osName, recording } from './constants';
import { Constraint, RecorderOptions } from './model';
import { TIME } from '../template-create/constants';


const getBrowserInfo = (parserFn) =>
  (userAgent) => {
    const { browser, engine, os = {} } = parserFn(userAgent);
    const isAndroid = os.name === osName.ANDROID;
    const isIos = os.name === osName.IOS;
    const isAndroidOrIos = isAndroid || isIos;
    return {
      browser,
      engine,
      os,
      isAndroid,
      isIos,
      isAndroidOrIos,
    };
  };

export const browserInfo = getBrowserInfo(userAgent)(navigator.userAgent);

// @ts-ignore
export const isFullscreenBusy = () => document.fullscreenElement || document.webkitFullscreenElement;


export namespace recordingFeatures {

  export function isRecorderSupported (): boolean {
    // @ts-ignore
    return typeof window.MediaRecorder !== 'undefined';
  }

  export function mediaErrorRecognizer (error) {
    if (!error || !error.name) return 'unknownError';
    switch (error.name) {
      case 'OverconstrainedError':
      case 'ConstraintNotSatisfiedError': return 'constraintsError';
      case 'NotAllowedError':
      case 'PermissionDeniedError': return 'permissionError';
      case 'NotReadableError':
      case 'TrackStartError': return 'deviceBusyError';
      case 'NotFoundError':
      case 'DevicesNotFoundError': return 'notFoundError';
      default: return 'unknownError';
    }
  }

  export function makeConstraints (deviceId, isHigh): Constraint {
    const constraints = isHigh ? recording.CONSTRAINTS.hq : recording.CONSTRAINTS.mq;
    if (deviceId) {
      constraints.video.deviceId = deviceId;
    } else {
      delete constraints.video.deviceId;
    }
    return constraints;
  }

  export function makeRecorderOptions (isHigh): RecorderOptions {
    const recorderOptions = browserInfo.isAndroid ? {} : { mimeType: recording.CODECS } as RecorderOptions;
    if (isHigh) {
      recorderOptions.videobitspersecond = browserInfo.isAndroid ? 2000000 : 3000000;
    } else {
      recorderOptions.videobitspersecond = 1500000;
    }
    return recorderOptions;
  }

  export function makeFrameShot (video) {
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    const { width, height } = video.getBoundingClientRect();
    c.width = width;
    c.height = height;
    ctx.drawImage(video, 0, 0, width, height);
    return c.toDataURL();
  }

  export async function lockOrientation () {
    // Added additional try/catch blocks to functions below as it can behave too unpredictable in different browsers
    try {
      const screen = window.screen;

      // @ts-ignore
      const lockCall = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation || (screen.orientation && screen.orientation.lock);
      const currentType = screen.orientation.type;
      return await lockCall.call(screen.orientation, currentType);
    } catch (err) {
      console.warn(err);
    }
  }

  export function unlockOrientation () {
    try {
      const screen = window.screen;

      // @ts-ignore
      const unlockCall = screen.unlockOrientation || screen.mozUnlockOrientation || screen.msUnlockOrientation || (screen.orientation && screen.orientation.unlock);
      return unlockCall.call(screen.orientation);
    } catch (err) {
      console.warn(err);
    }
  }
}

export namespace Time {

  /**
   * @param {number} seconds
   */
  export function getMinutesFromSeconds (seconds) {
    const m = parseInt(String((seconds / 60)), 10);
    return (m < 10) ? `0${m}` : m;
  }

  /**
   * @param {number} seconds
   */
  export function getRemainderSeconds (seconds) {
    const s = Math.floor(seconds % 60);
    return (s < 10) ? `0${s}` : s;
  }

  /**
   * @param {number} seconds
   */
  export function formatSecondsWithMinutes (seconds) {
    return `${getMinutesFromSeconds(seconds)}:${getRemainderSeconds(seconds)}`;
  }

  export function getHoursFromSeconds (seconds) {
    // @ts-ignore
    const h = parseInt((seconds / TIME.SEC_IN_HOURS), 10);

    if (!h) return null;

    return (h < 10) ? `0${h}` : h;
  }
}

function isFileType (type) {
  return (file) => file && file['type'].split('/')[0] === type;
}

export function getVideoMetadata(videoFile): Promise<HTMLMediaElement> {
  if (!isFileType('video')(videoFile)) return Promise.resolve(null);

  const video = document.createElement('video');
  video.preload = 'metadata';

  return new Promise((resolve) => {
    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);

      if (video.duration === Infinity) {
        video.currentTime = 1e101;
        video.ontimeupdate = function () {
          video.currentTime = 0;
          resolve(video);
        };
      } else {
        resolve(video);
      }
    };
    video.src = URL.createObjectURL(videoFile);
  });
}

export function calculateProgress (value, total) {
  return Math.round(value * 100 / total);
}

export const isTypeValid = (fileType, mediaType) => {
  const allAllowedFormats =
    Object
      .values(ALLOWED_FILE_FORMATS[mediaType])
      .reduce((accumulator: string[], currentValue: string[]) => ([...accumulator, ...currentValue]), []) as string[];

  return allAllowedFormats.some((format) => format === fileType);
};

export const convertBytesToMB = (bytes) => {
  return (bytes / 1048576).toFixed(1);
};

export const isSizeValid = (size, mediaType) => {
  return convertBytesToMB(size) < MAX_FILE_SIZE_MB[mediaType];
}
