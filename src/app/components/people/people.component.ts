import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mpw-people',
  template: `<router-outlet></router-outlet>`
})
export class PeopleComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}
}
