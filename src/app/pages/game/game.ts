import { Component } from '@angular/core';
import { GameSocketService } from '../../services/game-socket.service';
import { Observable } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-game',
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class GameComponent {
  state$!: Observable<any>;
  constructor(private socket: GameSocketService) {
    this.state$ = this.socket.state$;
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
