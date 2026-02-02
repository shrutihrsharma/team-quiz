import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { HostComponent } from './pages/host/host.component';
import { JoinComponent } from './pages/join/join.component';
import { GameComponent } from './pages/game/game.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'host', component: HostComponent },
  { path: 'join/:sessionId', component: JoinComponent },
  { path: 'game', component: GameComponent }
];
