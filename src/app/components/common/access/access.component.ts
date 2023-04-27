import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mpw-access',
  template: ``
})
export class AccessComponent {
  constructor(private router: Router) {
    router.navigate(['companies']);
  }
}
