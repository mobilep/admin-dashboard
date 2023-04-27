import { Location } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  Params,
  RouterState,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { flatten } from '@angular/compiler';
import { Subscription, combineLatest, throwError, Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';

// services
import { ScenariosService } from '../../services/scenarios.service';
import { UserService } from 'services/user.service';
import { DownloadArchiveService } from 'services/download-archive.service';

// models
import { ScenarioMetrics, MappedPractice } from '../../models/scenarioPracticesData';
import { ScenarioDetails } from '../../models/scenario-details';
import { DownloadVideoOptions } from 'models/download-video-options';
import { MessageOut } from 'models/messages';

import { videoByLearnerToDownloadVideoOptions } from './utils';


const toastOptions = {
  positionClass: 'toast-top-center',
  toastClass: 'toast-custom',
  enableHtml: true
};

@Component({
  selector: 'mpw-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.sass']
})
export class DetailsComponent implements OnInit, OnDestroy {
  downloadStatus: MessageOut.Status | null;
  scenario: ScenarioDetails;
  practices: MappedPractice[] = [];
  selectedLearnerIds: string[] = [];
  loadingVideos = false;
  progress = 0;
  downloadAll = false;
  scenarioMetrics: ScenarioMetrics;
  opened: boolean;
  routerSubscription: Subscription;
  isAdmin$: Observable<any>;
  public loaded: boolean;
  @ViewChild('linksTextInput') linksTextInput: ElementRef;

  private companyId: string;
  private scenarioId: string;

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private scenariosService: ScenariosService,
    private translate: TranslateService,
    private user: UserService,
    private downloadArchive: DownloadArchiveService,
    private toasts: ToastrService
  ) {
    this.loaded = true;
    this.isAdmin$ = this.user.getCurrentUser().pipe(map(user => user.isSysAdmin || user.isCompanyAdmin));
  }

  ngOnInit() {
    this.routerSubscription = this.route.params.subscribe((data: Params) => {
      const state: RouterState = this.router.routerState;
      const snapshot: RouterStateSnapshot = state.snapshot;
      const root: ActivatedRouteSnapshot = snapshot.root;
      const child = root.firstChild;
      this.companyId = child.params.id;
      this.scenarioId = data.scenarioId;

      combineLatest(
        this.scenariosService.getOneScenariosByCompany(this.companyId, this.scenarioId),
        this.scenariosService.getScenarioPracticesData(this.companyId, this.scenarioId)
      ).subscribe(
        res => {
          this.scenario = res[0];
          this.practices = res[1].list;
          this.scenarioMetrics = res[1].summary;
          this.loaded = false;
        },
        err => {
          this.loaded = false;
          this.location.back();
        }
      );
    });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  toggleOpen() {
    this.opened = !this.opened;
  }

  onSelectedLearnerIdsChanged(ids: string[]) {
    this.selectedLearnerIds = ids;
  }

  onDownloadAllChanged(downloadAll: boolean): void {
    this.downloadAll = downloadAll;
  }

  downloadVideo(): void {
    if (this.loadingVideos)
      return;

    const selectedLearnerIds = this.downloadAll ? [] : this.selectedLearnerIds;

    this.loadingVideos = true;

    this.scenariosService.getVideosByLearnerIds(this.companyId, this.scenarioId, selectedLearnerIds)
      .pipe(
        switchMap((videosByLearner) => {
          if (videosByLearner.length) {
            return of(videosByLearner.map(videoByLearnerToDownloadVideoOptions));
          } else {
            return throwError(new Error(this.translate.instant('scenarioDetails.noVideosFound')));
          }
        }),
        map((downloadVideoOptions:  DownloadVideoOptions[][]) => flatten(downloadVideoOptions)),
        tap((downloadVideoOptions) => this.downloadArchive.download({ downloadVideoOptions })),
        switchMap(() => this.downloadArchive.messages$.pipe(
          filter<MessageOut.Message>(Boolean),
          tap((message) => {
            if (MessageOut.isArchiving(message) || MessageOut.isDownloading(message)) {
              this.updateProgress(message as MessageOut.Archiving);
            }
            this.downloadStatus = message.status;
          }),
          filter<MessageOut.Completed>(MessageOut.isCompleted),
          take(1),
          tap(() => this.downloadArchive.onComplete()),
        )),
      )
      .subscribe((message) => {
        saveAs(message.content, "videos.zip");

        this.toasts.show(this.translate.instant('scenarioDetails.videosSuccessfullyDownloaded'), null, toastOptions);
        this.reset();
      }, (error) => {
        this.reset();
        this.toasts.show(error, null, toastOptions);
      });
  }

  updateProgress (message: MessageOut.Archiving): void {
    this.progress = Number(message.metadata.percent.toFixed(2));
  }

  reset (): void {
    this.loadingVideos = false;
    this.progress = 0;
    this.downloadStatus = null;
  }
}
