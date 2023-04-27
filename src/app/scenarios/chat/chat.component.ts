import { Location } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  Params,
  RouterState,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { ScenariosService } from '../../services/scenarios.service';
import { PlayerComponent } from '../player/player.component';

@Component({
  selector: 'mpw-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.sass']
})
export class ChatComponent implements OnInit, OnDestroy {
  chat: any;
  companyId: string;
  scenarioId: string;
  practiceId: string;
  scenario: any;
  user: any;
  routerSubscription: Subscription;
  public loaded: boolean;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private location: Location,
    private route: ActivatedRoute,
    private scenariosService: ScenariosService
  ) {
    this.loaded = true;
  }

  ngOnInit() {
    this.routerSubscription = this.route.params.subscribe((data: Params) => {
      const state: RouterState = this.router.routerState;
      const snapshot: RouterStateSnapshot = state.snapshot;
      const root: ActivatedRouteSnapshot = snapshot.root;
      const child = root.firstChild;
      this.companyId = child.params.id;
      this.scenarioId = data.scenarioId;
      this.practiceId = data.practiceId;

      combineLatest(
        this.scenariosService.getScenarioPracticeMessages(child.params.id, data.scenarioId, data.practiceId),
        this.scenariosService.getOneScenariosByCompany(child.params.id, data.scenarioId),
        this.scenariosService.getScenarioPracticesData(child.params.id, data.scenarioId)
      ).subscribe(
        res => {
          this.chat = res[0];
          this.scenario = res[1];
          const practice = res[2].list.filter(item => item._id === data.practiceId);
          this.user = practice[0].user;
          this.loaded = false;
        },
        err => {
          this.loaded = false;
          this.goBack();
        }
      );
    });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  goBack() {
    this.location.back();
  }

  unique(arr, prop) {
    return arr
      .map(function(e) {
        return e[prop];
      })
      .filter(function(e, i, a) {
        return i === a.indexOf(e);
      });
  }

  openVideo(video) {
    this.dialog.open(PlayerComponent, {
      width: 'initial',
      height: '400px',
      data: video,
      position: {
        top: '20px'
      }
    });
  }

  checkSameMessage(index: number): boolean {
    if (index === 0) {
      return false;
    }

    const prevMsg = this.chat[index - 1];
    const currentMsg = this.chat[index];

    const time = +currentMsg.time - +prevMsg.time;

    if (prevMsg._user === currentMsg._user && time < 60000) {
      return true;
    }

    return false;
  }
}
