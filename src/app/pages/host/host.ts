import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-host',
  imports: [],
  templateUrl: './host.html',
  styleUrl: './host.css',
})
export class HostComponent {
  constructor(private router: Router) {}

  async createGame() {
    const res = await fetch(`${environment.backendUrl}/create`);
    const data = await res.json();
    this.router.navigate(['/join', data.sessionId], {
      queryParams: { host: 'true' },
    });
  }
}
