import { Component, ElementRef, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, fromEvent, merge, Observable, of, pipe, Subject, timer } from 'rxjs';
import { browserInfo, getVideoMetadata, recordingFeatures, calculateProgress, isTypeValid, isSizeValid } from './utils';
import {
  catchError,
  delay,
  filter,
  map,
  mapTo,
  skip,
  switchMap,
  switchMapTo,
  take,
  takeUntil,
  tap
} from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { Constraint } from './model';
import { DRAG_END_EVENTS, DRAG_START_EVENTS, recording } from './constants';
import { UploadService } from 'services/upload.service';
import { Upload } from 'models/upload';
import { TranslateService } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';
import { CustomValidators } from '../template-create/validators';


export interface Data {
  getDescription?: boolean;
}

export interface Result {
  fileID?: string;
  duration?: number;
}

enum Screens {
  Select,
  Record,
  RecordResult,
  RecordPlayer,
  RecordUploading,
  RecordError,
  RecordWithDescription,
  UploadExisting
}

enum FileTypes {
  PHOTO = 'photo',
  VIDEO = 'video',
  IMAGE = 'image',
  FILE = 'file',
}

export const frontCameraFirst = (videoDevice: MediaDeviceInfo) =>
  (videoDevice && videoDevice.label && videoDevice.label.includes('front')) ? -1 : 1;

export const isVideoDevice = (device: MediaDeviceInfo) => device.kind === 'videoinput';

@Component({
  selector: 'mpw-upload-record-video',
  templateUrl: './upload-record-video.component.html',
  styleUrls: ['./upload-record-video.component.sass']
})
export class UploadRecordVideoComponent implements OnInit, OnDestroy {
  static DEFAULT_CONFIG = {
    minWidth: '332px',
    minHeight: '204px',
    panelClass: 'upload-record-video__dialog',
    disableClose: true,
  } as MatDialogConfig<Data>;

  onDestroy$: Subject<void>;
  loading$: BehaviorSubject<boolean>;
  currentScreen$: BehaviorSubject<Screens>;
  screens = Screens;

  videoDevices$: Observable<MediaDeviceInfo[]>;
  stream: MediaStream;
  recorder;
  recordData = [];
  timer = null;
  currentDuration = 0;
  error = null;
  streamReady = false;
  isRecording = false;
  selectedDeviceIndex$: BehaviorSubject<number>;
  highQuality$: BehaviorSubject<boolean>;
  highQuality = false;
  showSwitchCamera$: Observable<boolean>;
  videoStream$: Observable<MediaStream>;
  progress = 0;

  @ViewChild('video') video: ElementRef<HTMLMediaElement>;
  @ViewChild('recordPlayerVideo') recordPlayerVideo: ElementRef<HTMLMediaElement>;
  @ViewChild('browseInput') browseInput: ElementRef;

  imageFrameShot: string;
  file: any;
  fileObjectUrl: string;
  fileReady: boolean;
  dimensions: any;
  private isUploading: boolean;
  private xhr: any;

  dragging: boolean;
  dropError: any;
  fileType: FileTypes;
  fileTypes = FileTypes;
  ACCEPTED_INPUT = '.mp4,.mov';
  MAX_FILE_SIZE = 100;
  nameControl: FormControl;

  constructor(
    private uploadService: UploadService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<UploadRecordVideoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Data
  ) {
    this.onDestroy$ = new Subject<void>();
    this.loading$ = new BehaviorSubject<boolean>(false);
    this.currentScreen$ = new BehaviorSubject<Screens>(this.initialScreen);
    this.selectedDeviceIndex$ = new BehaviorSubject<number>(0);
    this.highQuality$ = new BehaviorSubject<boolean>(false);
    this.videoDevices$ = fromPromise(window.navigator.mediaDevices.enumerateDevices()).pipe(
      map((devices) => devices.filter(isVideoDevice).sort(frontCameraFirst)));
    this.showSwitchCamera$ = this.videoDevices$.pipe(map(videoDevices => videoDevices.length > 1));
    this.videoStream$ = combineLatest([
      this.selectedDeviceIndex$,
      this.highQuality$,
      this.videoDevices$
    ]).pipe(
      map(([index, highQuality, devices]) =>
        recordingFeatures.makeConstraints(devices[index] ? devices[index].deviceId : null, highQuality)
      ),
      switchMap((constraints: Constraint) =>
        fromPromise(window.navigator.mediaDevices.getUserMedia(constraints))
      )
    );
    this.dragging = false;
    this.nameControl = new FormControl('', CustomValidators.Name);
  }

  ngOnInit(): void {

    merge(fromEvent(window, 'drop'), fromEvent(window, 'dragover'))
      .pipe(takeUntil(this.onDestroy$))
      .subscribe( event => {
        event.preventDefault();
      });

    this.currentScreen$.pipe(
      filter(screen => screen === this.screens.Record),
      tap(() => this.loading$.next(true)),
      switchMapTo(this.videoStream$.pipe(catchError(error => of({error})))),
      delay(1000),
      takeUntil(this.onDestroy$)
    )
      .subscribe(
        (stream) => {
          if (stream instanceof MediaStream) {
            this.onStreamReady(stream)
          } else {
            this.onStreamError(stream.error);
          }
        });

    merge(this.selectedDeviceIndex$, this.highQuality$)
      .pipe(skip(1), takeUntil(this.onDestroy$))
      .subscribe(() => this.resetRecorderOptions());

    merge(
      ...DRAG_START_EVENTS.map(eventName => fromEvent(window, eventName).pipe(mapTo(true))),
      ...DRAG_END_EVENTS.map(eventName => fromEvent(window, eventName).pipe(mapTo(false)))
    ).pipe(
      takeUntil(this.onDestroy$)
    ).subscribe(dragging => this.dragging = dragging);
  }

  ngOnDestroy(): void {
    this.resetRecorderOptions();
    this.cancelFileSend();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private get initialScreen(): Screens {
    if (recordingFeatures.isRecorderSupported() && browserInfo.browser.name === 'Chrome') {
      return this.screens.Select;
    } else {
      return this.screens.UploadExisting;
    }
  }

  onStreamReady(stream: MediaStream): void {
    this.stream = stream;
    this.setDimensions(this.stream.getVideoTracks()[0].getSettings());
    this.video.nativeElement.srcObject = this.stream;
    this.video.nativeElement.muted = true;
    this.loading$.next(false);
    this.streamReady = true;
    // @ts-ignore
    this.recorder = new MediaRecorder(this.stream, recordingFeatures.makeRecorderOptions(this.highQuality));
    this.recorder.ondataavailable = (event) => {
      this.recordData.push(event.data);
    };
  }

  onStreamError(error: any): void {
    const errorKey = recordingFeatures.mediaErrorRecognizer(error);

    this.loading$.next(false);
    this.currentScreen$.next(this.screens.RecordError);
    this.error = {
      titleKey: `templates.${errorKey}.title`,
      messageKey: `templates.${errorKey}.message`
    };
  }

  setDimensions({ width = 0, aspectRatio = 1 }): void {
    const maxWidth = window.innerWidth * 0.7;
    const dialogWidth = width > maxWidth ? maxWidth : width;
    const dialogHeight = Math.round((dialogWidth / aspectRatio) + 60);

    this.dimensions = {height: dialogHeight, width: dialogWidth};
  }

  resetRecorderOptions(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.recorder) {
      this.recorder = null;
    }
    this.currentDuration = 0;
    this.recordData = [];
  }

  close(result = null): void {
    this.dialogRef.close(result);
  }

  switchCamera() {
    combineLatest([
      this.videoDevices$,
      this.selectedDeviceIndex$
    ]).pipe(
      take(1),
      map(([videoDevices, deviceIndex]) => deviceIndex + 1 >= videoDevices.length ? 0: deviceIndex + 1)
    ).subscribe((deviceIndex) => {
      this.selectedDeviceIndex$.next(deviceIndex);
    })
  }

  toggleRecording() {
    if (this.isRecording) {
      this.handleStopRecording();
    } else {
      this.handleStartRecording();
    }
  }

  handleStartRecording = async () => {
    if (browserInfo.isAndroid) await recordingFeatures.lockOrientation();
    this.isRecording = true;
    this.recorder.start(recording.TIME_SLICE);
    this.toggleTimer();
  }

  handleStopRecording = () => {
    this.toggleTimer();
    this.recorder.stop();
    if (browserInfo.isAndroid) recordingFeatures.unlockOrientation();
    this.imageFrameShot = recordingFeatures.makeFrameShot(this.video.nativeElement);
    this.file = new Blob(this.recordData, { type: recording.CODECS });
    this.fileObjectUrl = URL.createObjectURL(this.file);
    this.isRecording = false;
    this.fileReady = true;
    this.currentScreen$.next(this.screens.RecordResult);
    this.resetRecorderOptions();
  }

  toggleTimer () {
    if (this.timer) {
      clearInterval(this.timer);
    } else {
      this.timer = setInterval(() => {
        this.currentDuration += recording.TIME_SLICE;
        if (this.currentDuration >= recording.MAX_LENGTH) {
          this.handleStopRecording();
        }
      }, recording.TIME_SLICE);
    }
  }

  recordAgain() {
    this.resetRecorderOptions();
    this.currentScreen$.next(this.screens.Record);
  }

  showRecordPlayer() {
    this.currentScreen$.next(this.screens.RecordPlayer);

    timer()
      .pipe(
        tap(() => {
          this.recordPlayerVideo.nativeElement.loop = true;
          this.recordPlayerVideo.nativeElement.autoplay = false;
          this.recordPlayerVideo.nativeElement.src = URL.createObjectURL(this.file);
          this.recordPlayerVideo.nativeElement.currentTime = Number.MAX_SAFE_INTEGER;
        }),
        switchMap(() => fromEvent(this.recordPlayerVideo.nativeElement, 'durationchange')),
        filter<any>((e) => (e.target.duration !== Infinity)),
        take(1),
      )
      .subscribe(() => {
        this.recordPlayerVideo.nativeElement.currentTime = 0.1;
        this.recordPlayerVideo.nativeElement.play();
        this.recordPlayerVideo.nativeElement.loop = false;
    })
  }

  sendVideo(description = '') {
    if (this.file) {
      this.isUploading = true;

      combineLatest([
        fromPromise(getVideoMetadata(this.file)),
        this.uploadFile()
      ])
      .subscribe(([{duration}, fileID]) => {
        this.isUploading = false;
        this.close({fileID, duration, name: this.nameControl.value});
      }, (error) => {
        this.isUploading = false;
        this.error = error;
      });
    }
  }

  uploadFile() {
    const uploadProgress = (e) => {
      if (e.lengthComputable) {
        this.progress = calculateProgress(e.loaded, e.total);
      }
    };

    return this.uploadService.generatePresignedUrl(this.file.type).pipe(
      switchMap(({url, fileID}: Upload) => {
        const {xhr, promise} = this.uploadService.upload(url, this.file, fileID, uploadProgress);
        this.xhr = xhr;
        return fromPromise(promise);
      })
    )
  }

  cancelFileSend() {
    if (this.xhr) {
      this.xhr.abort();
      this.xhr = null;
    }
  }


  handleAddFile(event) {
    const { files } =  event.target;

    if (this.isFileValid(files)) {
      this.file = files[0];
    }
  }

  handleDropFile(event) {
    event.preventDefault();
    const { files } = event.dataTransfer;

    if (this.isFileValid(files)) {
      this.file = files[0];
    }
  }

  isFileValid(files): boolean {
    if (files.length > 1) {
      this.dropError = this.translate.instant('templates.multipleFiles');
      return false;
    }

    const { type, size } = files[0];

    if (!isTypeValid(type, this.fileTypes.VIDEO)) {
      this.dropError = this.translate.instant('templates.wrongFormat');
      return false;
    }

    if (!isSizeValid(size, this.fileTypes.VIDEO)) {
      this.dropError = this.translate.instant('templates.wrongSize');
      return false;
    }

    return true;
  }

  handleFileCancel() {
    this.file = null;
    this.progress = 0;
    this.browseInput.nativeElement.value = null;
  }

  handleSendClick() {
    if (this.data && this.data.getDescription) {
      this.currentScreen$.next(this.screens.RecordWithDescription);
    } else {
      this.sendVideo();
      this.currentScreen$.next(this.screens.RecordUploading);
    }
  }
}
