import { Component, OnInit, ViewChild } from '@angular/core';
import { GameSocketService } from '../../services/game-socket.service';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
// @ts-ignore: no type definitions for canvas-confetti
import confetti from 'canvas-confetti';
import { OrderByScorePipe } from '../../pipes/order-by-score-pipe';

@Component({
  selector: 'app-game',
  imports: [CommonModule, AsyncPipe, OrderByScorePipe],
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

    // ⭐ FIREWORKS TRIGGER
    this.state$.subscribe((state) => {
      if (state?.phase === 'ENDED') {
        this.launchFireworks();
      }
      if (state?.phase === 'ANSWER_REVEAL') {
        (document.getElementById('correctSound') as HTMLAudioElement)?.play();
      }
      if (state?.questionType !== 'audio') {
        const audio = document.querySelector('audio');
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      }
    });
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
    (document.getElementById('buzzSound') as HTMLAudioElement)?.play();
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
    setTimeout(() => {
      (document.getElementById('correctSound') as HTMLAudioElement)?.play();
    }, 200);
  }

  markWrong() {
    this.socket.send({
      type: 'MARK_WRONG',
      playerId: this.socket.playerId,
    });
    setTimeout(() => {
      (document.getElementById('wrongSound') as HTMLAudioElement)?.play();
    }, 200);
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

  getPlayersSortedByScore(players: any[]) {
    return players.sort((a, b) => b.score - a.score);
  }

  skipQuestion() {
    this.socket.send({
      type: 'SKIP_QUESTION',
      playerId: this.socket.playerId,
    });
  }

  launchFireworks() {
    setTimeout(() => {
      (document.getElementById('winnerSound') as HTMLAudioElement)?.play();
    }, 500);

    const duration = 4000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
      });

      confetti({
        particleCount: 4,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }

  getTeamsFormatted(players: any[]) {
    if (!players) return '';

    const teams: Record<string, string[]> = {};

    players.forEach((p) => {
      if (!teams[p.team]) teams[p.team] = [];
      teams[p.team].push(p.name);
    });

    let text = '🎮 TEAM LIST\n\n';

    Object.entries(teams).forEach(([team, members]) => {
      text += `${team}\n`;
      members.forEach((m) => (text += `• ${m}\n`));
      text += '\n';
    });

    return text;
  }

  copyTeams(players: any[]) {
    const text = this.getTeamsFormatted(players);

    navigator.clipboard.writeText(text);
    alert('Teams copied! Share on Teams/WhatsApp 🙂');
  }
}
