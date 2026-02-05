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
  origin = window.location.origin;
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

  buzz() {
    this.socket.send({
      type: 'BUZZ',
      playerId: this.socket.playerId,
    });
  }

  getWinner(state: any) {
    if (!state?.currentBuzzPlayerId) return null;

    return state.players?.find((p: any) => p.id === state.currentBuzzPlayerId);
  }

  copyLink() {
    const link = `${window.location.origin}/join/${this.socket.sessionId}`;
    navigator.clipboard.writeText(link);
    alert('Join link copied!');
  }

  markCorrect() {
    this.socket.send({
      type: 'MARK_CORRECT',
      playerId: this.socket.playerId,
    });
  }

  markWrong() {
    this.socket.send({
      type: 'MARK_WRONG',
      playerId: this.socket.playerId,
    });
  }
}
