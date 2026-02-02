import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
})
export class HomeComponent {
  constructor(private router: Router) {}

  goToHost() {
    console.log('Navigating to host...');
    this.router.navigate(['/host']);
  }

  join(code: string) {
    if (code) {
      this.router.navigate(['/join', code]);
    }
  }
}
