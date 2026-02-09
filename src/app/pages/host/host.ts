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
    try {
      const res = await fetch(`${environment.backendUrl}/create`);

      if (!res.ok) {
        throw new Error('Failed to create session');
      }

      const data = await res.json();

      // ⭐ Save host token (important for reconnect + auth)
      localStorage.setItem('hostToken', data.hostToken);

      this.router.navigate(['/join', data.sessionId], {
        queryParams: { host: 'true' },
      });
    } catch (err) {
      console.error('Session creation error:', err);
      alert('Unable to create game session. Try again.');
    }
  }
}
