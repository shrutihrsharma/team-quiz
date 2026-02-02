import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    private route: ActivatedRoute,
    private socket: GameSocketService
  ) {
    this.sessionId = this.route.snapshot.paramMap.get('sessionId')!;
  }

  join() {
    this.socket.connect(this.sessionId, this.name);
  }
}
