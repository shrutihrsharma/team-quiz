import { Component, OnInit } from '@angular/core';
import { GameSocketService } from '../../services/game-socket.service';
import { Observable } from 'rxjs';
import { AsyncPipe, JsonPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  imports: [CommonModule, AsyncPipe, JsonPipe],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class GameComponent implements OnInit {
  state$!: Observable<any>;
  origin = window.location.origin;
  playerName = localStorage.getItem('playerName') || 'Player';

  constructor(public socket: GameSocketService) {
    this.state$ = this.socket.state$;
  }
  ngOnInit(): void {
    const sessionId = localStorage.getItem('sessionId');
    const playerName = localStorage.getItem('playerName');
    const hostToken = localStorage.getItem('hostToken');

    if (!sessionId) {
      console.error('No sessionId found');
      return;
    }

    this.socket.connect(sessionId, playerName || 'Unknown', !!hostToken);
  }

  getCurrentPlayer(state: any) {
    return state?.players?.find((p: any) => p.id === this.socket.playerId);
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

  nextQuestion() {
    this.socket.send({
      type: 'NEXT_QUESTION',
      playerId: this.socket.playerId,
    });
  }

  endGame() {
    this.socket.send({
      type: 'END_GAME',
      playerId: this.socket.playerId,
    });
  }

  getTeamScores(players: any[]) {
    const scores: Record<string, number> = {};
    players.forEach((p) => {
      scores[p.team] = (scores[p.team] || 0) + p.score;
    });
    return scores;
  }

  getWinningTeam(players: any[]) {
    const teamScores = this.getTeamScores(players);
    let winner = null;
    let max = -1;

    for (const team in teamScores) {
      if (teamScores[team] > max) {
        max = teamScores[team];
        winner = team;
      }
    }

    return winner;
  }
}
