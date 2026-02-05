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
  constructor(public socket: GameSocketService) {
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

  showQuestion(question: string) {
    this.socket.send({
      type: 'SHOW_QUESTION',
      playerId: this.socket.playerId,
      question,
    });
  }

  enableBuzzers() {
    this.socket.send({
      type: 'ENABLE_BUZZERS',
      playerId: this.socket.playerId,
    });
  }
}
