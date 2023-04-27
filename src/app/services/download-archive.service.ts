import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { MessageIn, MessageOut } from 'models/messages';


@Injectable({
  providedIn: 'root'
})
export class DownloadArchiveService {
  public messages$: BehaviorSubject<MessageOut.Message>;
  private worker: Worker;

  constructor() {
    this.messages$ = new BehaviorSubject<MessageOut.Message>(null);
    this.initializeWorker();
  }

  public download (message: MessageIn.Data) {
    this.worker.postMessage(message);
  }

  public onComplete () {
    this.messages$.next(null);
  }

  private initializeWorker () {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker('../workers/download-archive.worker', { type: 'module' });
      this.worker.onmessage = ({ data }) => this.messages$.next(data);

    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

}
