import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GameSocketService {
  private socket!: WebSocket;

  state$ = new BehaviorSubject<any>(null);

  connect(sessionId: string, name: string) {
    this.socket = new WebSocket(
      `${environment.backendUrl.replace('https', 'wss')}/join/${sessionId}`
    );

    this.socket.onopen = () => {
      this.socket.send(JSON.stringify({ type: 'JOIN', name }));
    };

    this.socket.onmessage = (event) => {
      this.state$.next(JSON.parse(event.data));
    };
  }
}
