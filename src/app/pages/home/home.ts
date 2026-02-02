import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.html'
})
export class HomeComponent {
  constructor(private router: Router) {}

  join(code: string) {
    if (code) {
      this.router.navigate(['/join', code]);
    }
  }
}
