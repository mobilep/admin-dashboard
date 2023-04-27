import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';
// vendor
import { addDays, endOfDay } from 'date-fns';
import { MatDialog } from '@angular/material/dialog';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
// rxjs
import { combineLatest, Observable } from 'rxjs';
import { filter, map, mapTo, startWith, switchMap, takeUntil } from 'rxjs/operators';
// services
import { TemplateService } from 'services/template.service';
import { CriteriaService } from 'services/criteria.service';
// models
import { Template } from 'models/template';
import { Criteria } from 'models/criteria';
import { inProcessing, State as VideoObjectState, Video, VideoObject } from 'models/video';
// misc
import { toRootParams } from '../utils';
import { MATCHER } from '../../utils/matcher';
import { TIME } from './constants';
import { CustomValidators } from './validators';
import { normalizeVideoObject } from './utils';
import { Time } from '../upload-record-video/utils';

// components
import {
  Data as UploadRecordVideoData,
  Result as UploadRecordVideoResult,
  UploadRecordVideoComponent
} from '../upload-record-video/upload-record-video.component';
import { PlayerComponent } from '../player/player.component';
import { DateAdapter } from '@angular/material/core';

enum Locale {
  en = 'en-EN',
  fr = 'fr-FR'
}

enum FormErrors {
  infoRequired = 'infoRequired',
  videoRequired = 'videoRequired',
  stepsRequired = 'stepsRequired',
  criteriasRequired = 'criteriasRequired'
}

@Component({
  selector: 'mpw-template-create',
  templateUrl: './template-create.component.html',
  styleUrls: ['./template-create.component.sass']
})
export class TemplateCreateComponent implements OnInit, OnDestroy {
  template: Template;
  templateForm: FormGroup;
  criterias: Partial<Criteria>[];
  filteredCriterias: Partial<Criteria>[];
  companyId: string;
  MIN_DATE: Date;
  MAX_LENGTH: number;
  formSubmitted: boolean;
  currentExampleId: number;
  videoStates = VideoObjectState;
  formErrors = FormErrors;

  private onDestroy$: EventEmitter<void>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private templateService: TemplateService,
    private criteriaService: CriteriaService,
    private dialog: MatDialog,
    private db: AngularFireDatabase,
    private toasts: ToastrService,
    private translate: TranslateService,
    private _adapter: DateAdapter<any>
  ) {
    this.MIN_DATE = endOfDay(+new Date() + TIME.MS_IN_DAY);
    this.MAX_LENGTH = CustomValidators.MAX_LENGTH;
    this.formSubmitted = false;
    this.currentExampleId = 0;
    this.onDestroy$ = new EventEmitter<void>();
  }

  ngOnInit(): void {
    this.buildFormModel();
    this.loadTemplate();
    this.loadCriteria();
    this.setCompanyId();
    this.setCriterias();
    this.updateDatePickerLang();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  buildFormModel(): void {
    this.templateForm = new FormGroup({
      _id: new FormControl(''),
      name: new FormControl('', CustomValidators.Name),
      info: new FormControl(''),
      videoId: new FormControl(''),
      duration: new FormControl(0),
      steps: new FormControl([]),
      step: new FormControl(''),
      examples: new FormControl([]),
      _criterias: new FormControl([]),
      criteria: new FormControl(''),
      dueDate: new FormControl(addDays(endOfDay(+new Date()), TIME.SCENARIO_DEFAULT_DUE_DAYS)),
      canEditVideo: new FormControl(true),
      video: new FormControl(null)
    }, this.validateIfCantEditVideo.bind(this));
  }

  private validateIfCantEditVideo(form: FormGroup): ValidationErrors | null {
    const canEditVideo = form.get('canEditVideo').value;

    if (canEditVideo) {
      return null;
    } else {
      const validationError = {};
      const info = form.get('info').value;
      const videoId = form.get('videoId').value;
      const steps = form.get('steps').value;
      const _criterias = form.get('_criterias').value;

      if (!info.trim()) {
        validationError[this.formErrors.infoRequired] = true;
      }
      if (!videoId) {
        validationError[this.formErrors.videoRequired] = true;
      }
      if (!steps.length) {
        validationError[this.formErrors.stepsRequired] = true;
      }
      if (!_criterias.length) {
        validationError[this.formErrors.criteriasRequired] = true;
      }
      return Object.keys(validationError).length ? validationError : null;
    }
  }

  loadTemplate() {
    this.route.paramMap
      .pipe(
        map(paramMap => paramMap.get('templateId')),
        filter<string>(Boolean),
        map(templateId => {
          const {id: companyId} = toRootParams(this.router.routerState);

          return {templateId, companyId};
        }),
        switchMap(({companyId, templateId}) =>
          this.templateService.loadTemplate(companyId, templateId)
        ),
        takeUntil(this.onDestroy$)
      )
      .subscribe(template => {
        this.templateForm.patchValue({...template, _criterias: template._criterias.map(({_id}) => _id)});
        this.template = template;
      });
  }

  loadCriteria() {
    this.route.paramMap
      .pipe(
        mapTo(toRootParams(this.router.routerState)),
        switchMap(({id: companyId}) => this.criteriaService.load(companyId)),
        takeUntil(this.onDestroy$)
      )
      .subscribe();
  }

  setCriterias():void {
    combineLatest([
      this.criteriaService.data$,
      this.templateForm.get('criteria').valueChanges.pipe(startWith(''), map(name => name ? name.trim() : '')),
      this.templateForm.get('_criterias').valueChanges.pipe(startWith([]))
    ])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([criterias, trimmedQuery, addedCriteriaIds]) => {
        this.criterias = criterias;

        this.filteredCriterias = criterias
          .filter(criteria => (!trimmedQuery || MATCHER.stringMatch(trimmedQuery, criteria.name)) && !addedCriteriaIds.includes(criteria._id));
      });
  }

  setCompanyId():void {
    this.route.paramMap
      .pipe(mapTo(toRootParams(this.router.routerState)), takeUntil(this.onDestroy$))
      .subscribe(({id}) => this.companyId = id)
  }

  updateDatePickerLang(): void {
    this.translate.onLangChange
      .pipe(startWith({lang: this.translate.currentLang}), map(({lang}) => lang), takeUntil(this.onDestroy$))
      .subscribe(lang => this._adapter.setLocale(Locale[lang]))
  }

  get stepNameValue(): string {
    return this.templateForm.get('step').value
  }


  addStep(step: string):void {
    const stepTrimmed = step && step.trim();
    if (stepTrimmed) {
      const steps = this.templateForm.get('steps').value as string[];
      this.templateForm.patchValue({steps: steps.concat(stepTrimmed), step: ''})
    }
  }

  removeStep(indexOfRemovedItem: number): void {
    const steps = this.templateForm.get('steps').value.filter((item, index) => indexOfRemovedItem !== index);
    this.templateForm.patchValue({steps});
  }

  handleAddCriteriaBtnClick(event: Event, trigger: MatAutocompleteTrigger): void {
    event.stopPropagation();

    if (!this.criteriaAlreadyAdded) {
      this.addCriteria({ name: this.templateForm.get('criteria').value });
    } else {
      trigger.openPanel();
    }
  }

  addCriteria(criteria: Partial<Criteria>):void {
    const criteriaIds = this.criteriaIds;
    const criteriaNameTrimmed = criteria.name && criteria.name.trim();

    if (criteria._id) {
      this.templateForm.patchValue({_criterias: criteriaIds.concat(criteria._id), criteria: ''});
    } else if (criteriaNameTrimmed) {
      this.criteriaService.create(this.companyId, criteriaNameTrimmed)
        .subscribe((criteria) => {
          this.templateForm.patchValue({_criterias: criteriaIds.concat(criteria._id), criteria: ''});
        })
    }
  }

  removeCriteria(id: string): void {
    const criteriaIds = this.criteriaIds.filter((criteriaId) => id !== criteriaId);

    return this.templateForm.patchValue({_criterias: criteriaIds});
  }

  get criteriaAlreadyAdded(): boolean {
    const name = this.templateForm.get('criteria').value.trim();
    const criteria = this.criterias.find(criteria => MATCHER.stringsToLowerEquals(criteria.name, name));

    return criteria && this.criteriaIds.includes(criteria._id);
  }

  get criteriaExists(): boolean {
    const name = this.templateForm.get('criteria').value.trim();

    return Boolean(this.criterias.find(criteria => MATCHER.stringsToLowerEquals(criteria.name, name)));
  }

  get criteriaIds(): string[] {
    return this.templateForm.get('_criterias').value;
  }

  getCriteriaById(id: string): Partial<Criteria> {
    return this.criterias.find(criteria => criteria._id === id);
  }

  get startAtDate(): Date {
    return new Date(this.templateForm.get('dueDate').value);
  }


  openAddVideoDialog(): void {
    const dialogRef = this.dialog.open<UploadRecordVideoComponent, UploadRecordVideoData, UploadRecordVideoResult>(
      UploadRecordVideoComponent, UploadRecordVideoComponent.DEFAULT_CONFIG);

    dialogRef.afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(({fileID, duration}) => this.loadVideo({fileID, duration})),
        takeUntil(this.onDestroy$)
      )
      .subscribe((video) => {
        this.templateForm.patchValue({videoId: video.videoId, duration: video.duration, video, state: video.state});
      });
  }

  loadVideo({fileID, duration}): Observable<Partial<Video>> {
    return this.getVideoObject(fileID).pipe(
      map(videoObject => videoObject || {state: VideoObjectState.PROCESSING} as Partial<VideoObject>),
      filter<VideoObject>(Boolean),
      map((videoObject) => normalizeVideoObject(duration, videoObject))
    );
  }

  get video(): Partial<Video> {
    return this.templateForm.get('video').value;
  }

  openAddBestPracticeDialog(): void {
    const dialogRef = this.dialog.open<UploadRecordVideoComponent, UploadRecordVideoData>(
      UploadRecordVideoComponent, {...UploadRecordVideoComponent.DEFAULT_CONFIG, data: {getDescription: true}});

    dialogRef.afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(({fileID, duration, name}) =>
          this.loadVideo({fileID, duration}).pipe(map(video => ({videoId: fileID, duration, name, video})))
        ),
        takeUntil(this.onDestroy$)
      )
      .subscribe((newExample) => {
        const examples = this.templateForm.get('examples').value.filter(example => example.videoId !== newExample.videoId);
        this.templateForm.patchValue({examples: examples.concat(newExample)});
      });
  }

  deleteExample(selectedExample: any): void {
    this.currentExampleId = 0;
    this.templateForm.patchValue({examples: this.examples.filter(example => example !== selectedExample)});
  }


  getVideoObject(fileId: string) {
    return this.db.object<VideoObject>(`videos/${fileId}`).valueChanges();
  }

  onFormSubmit(): void {
    this.formSubmitted = true;

    this.updateDueDateValidity();

    if (this.templateForm.valid) {
      const {_id: templateId} = this.templateForm.value;
      const template = toTemplate(this.templateForm.value);

      if (templateId) {
        this.templateService.update(this.companyId, templateId, template)
          .subscribe(() => {
            this.router.navigateByUrl(`/company/${this.companyId}/scenarios/templates`);
            this.showSuccessToast(this.translate.instant('templates.successfullyUpdated'));
          });
      } else {
        this.templateService.create(this.companyId, template)
          .subscribe(() => {
            this.router.navigateByUrl(`/company/${this.companyId}/scenarios/templates`);
            this.showSuccessToast(this.translate.instant('templates.successfullyAdded'));
          });
      }
    }
  }

  updateDueDateValidity() {
    const dueDateCtrl = this.templateForm.get('dueDate');

    dueDateCtrl.clearValidators();
    dueDateCtrl.updateValueAndValidity();
  }

  handleLeftClick() {
    this.currentExampleId = this.currentExampleId === 0 ? this.examples.length - 1 : this.currentExampleId - 1;
  }

  handleRightClick() {
    this.currentExampleId = this.currentExampleId + 1 < this.examples.length ? this.currentExampleId + 1 : 0;
  }

  get examples() {
    return this.templateForm.get('examples').value;
  }

  get selectedExample() {
    return this.examples ? this.examples[this.currentExampleId] : null;
  }

  get selectedExampleDuration() {
    const seconds = this.selectedExample.duration;
    const hours = Time.getHoursFromSeconds(seconds);
    const hoursString = hours ? `${hours}:` : '';
    return `${hoursString}${Time.formatSecondsWithMinutes(seconds % TIME.SEC_IN_HOURS)}`;
  }

  get videoProcessing(): boolean {
    const {examples, video} = this.templateForm.value;

    return Boolean((examples && examples.some(example => inProcessing(example.video))) || inProcessing(video));
  }

  openPlayerDialog() {
    this.dialog.open(PlayerComponent, {
      data: this.selectedExample.video,
      minWidth: '40vw',
      maxWidth: '60vw',
      height: '400px',
    })
  }

  showSuccessToast(text) {
    this.toasts.clear();
    this.toasts.show(`<i class="icon-check"></i><span>${text}</span>`, null, {
      positionClass: 'toast-top-center',
      toastClass: 'toast-custom',
      enableHtml: true
    });
  }
}

function toTemplate({ name, info, videoId, duration, steps, examples, _criterias, dueDate, canEditVideo }): Partial<Template> {
  const template = {
    name: name.trim(),
    info: info.trim(),
    dueDate: +endOfDay(+new Date(dueDate)),
    steps,
    _criterias,
    canEditVideo
  };

  if (videoId) { Object.assign(template, {videoId, duration}); }
  if (examples) { Object.assign(template, { examples: examples.map(({name, duration, videoId}) => ({name, duration, videoId})) }); }

  return template;
}
