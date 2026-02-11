import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GameSocketService } from '../../services/game-socket.service';

@Component({
  selector: 'app-join',
  imports: [FormsModule],
  templateUrl: './join.html',
  styleUrl: './join.css',
})
export class JoinComponent {
  name = '';
  sessionId = '';
  isHost = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private socket: GameSocketService,
  ) {
    this.sessionId = this.route.snapshot.paramMap.get('sessionId')!;
    this.isHost = this.route.snapshot.queryParamMap.get('host') === 'true';
  }

  join() {
    localStorage.setItem('playerName', this.name);
    localStorage.setItem('sessionId', this.sessionId);

    this.socket.connect(this.sessionId, this.name, this.isHost);
    this.router.navigate(['/game']);
  }
}
