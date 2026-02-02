import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GameSocketService {
  private ws!: WebSocket;
  playerId!: string;
  isHost = false;

  state$ = new BehaviorSubject<any>(null);

  connect(sessionId: string, name: string) {
    this.ws = new WebSocket(
      `${environment.backendUrl.replace('https', 'wss')}/join/${sessionId}`,
    );

    this.ws.onopen = () => {
      this.playerId = crypto.randomUUID();
      this.ws.send(
        JSON.stringify({
          type: 'JOIN',
          name,
          host: this.isHost,
        }),
      );
    };

    this.ws.onmessage = (event) => {
      this.state$.next(JSON.parse(event.data));
    };
  }

  send(payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }
}
