import { DownloadVideoOptions } from 'models/download-video-options';

export namespace MessageIn {
  export interface Data {
    downloadVideoOptions: DownloadVideoOptions[];
  }

  export interface Root {
    data: Data;
  }
}

export namespace MessageOut {
  export interface Metadata  {
    percent: number;
    currentFile?: string;
    path?: string;
    originalEvent?: any;
    loaded?: number;
    total?: number;
  }

  export enum Status {
    COMPLETED = "Completed",
    ARCHIVING = "Archiving",
    DOWNLOADING = "Downloading",
  }

  export class Archiving {
    status = Status.ARCHIVING;

    constructor(
      public metadata: Metadata
    ) {
    }
  }

  export class Completed {
    status = Status.COMPLETED;

    constructor(
      public content: Blob
    ) {
    }
  }

  export class Downloading {
    status = Status.DOWNLOADING;

    constructor(
      public metadata: Metadata
    ) {
    }
  }

  export type Message = Archiving | Completed | Downloading;

  export const isArchiving = (message: Message) => message.status === Status.ARCHIVING;
  export const isCompleted = (message: Message) => message.status === Status.COMPLETED;
  export const isDownloading = (message: Message) => message.status === Status.DOWNLOADING;
}
