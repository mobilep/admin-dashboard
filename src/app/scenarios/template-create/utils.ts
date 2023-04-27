import { State, Video, VideoObject } from 'models/video';
import { environment } from '../../../environments/environment';


const S3_ASSETS_URL = environment.s3.assetUrl;

export function normalizeVideoObject(duration, {videoId, thumbPathDASH, playPathHLS, playPathDASH, size, videoOrientation, state}: VideoObject): Partial<Video> {
  if (state === State.COMPLETED) {
    return {
      videoId,
      duration,
      size,
      videoOrientation,
      playList: playPathHLS && `${S3_ASSETS_URL}/${playPathHLS}.m3u8`,
      dashList: `${S3_ASSETS_URL}/${playPathDASH}.mpd`,
      thumb: thumbPathDASH && `${S3_ASSETS_URL}/${thumbPathDASH}`
    }
  } else {
    return {
      size,
      state,
      videoId
    }
  }
}
