import { Component } from '@angular/core';
import { GameSocketService } from '../../services/game-socket.service';
import { Observable } from 'rxjs';
import { AsyncPipe, JsonPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  imports: [CommonModule, AsyncPipe, JsonPipe],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class GameComponent {
  state$!: Observable<any>;
  playerId!: string;
  constructor(private socket: GameSocketService) {
    this.state$ = this.socket.state$;
    this.playerId = this.socket.playerId;
  }

  start(question: string) {
    this.socket.send({
      type: 'START_QUESTION',
      playerId: this.socket.playerId,
      question,
      duration: 30,
    });
  }
}
