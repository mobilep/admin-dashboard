import { format } from 'date-fns';

import { DownloadVideoOptions } from 'models/download-video-options';
import { VideoByLearner } from 'models/video-by-learner';


function videoUrlToExt (url: string): string {
  const fileExtExtractor = /\.[0-9a-z]+$/i;

  return url.match(fileExtExtractor)[0];
}

export function videoByLearnerToDownloadVideoOptions (videoByLearner: VideoByLearner): DownloadVideoOptions[] {
  return videoByLearner.videos.map(video => ({
    fileName: `${video.id}_${videoByLearner.userName}_${format(video.creationTime, 'MMM-dd-yyyy')}${videoUrlToExt(video.url)}`,
    url: video.url
  }));
}
