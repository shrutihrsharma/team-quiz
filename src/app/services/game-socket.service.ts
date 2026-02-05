import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GameSocketService {
  private ws!: WebSocket;
  playerId!: string;
  isHost = false;
  sessionId!: string;


  state$ = new BehaviorSubject<any>(null);

  connect(sessionId: string, name: string, isHost: boolean) {
    this.sessionId = sessionId;
    this.isHost = isHost;
    this.ws = new WebSocket(
      `${environment.backendUrl.replace('https', 'wss')}/join/${sessionId}`,
    );

    this.ws.onopen = () => {
      this.playerId = crypto.randomUUID();
      this.ws.send(
        JSON.stringify({
          type: 'JOIN',
          playerId: this.playerId,
          name: name,
          host: isHost,
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
