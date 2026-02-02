import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { HostComponent } from './pages/host/host';
import { JoinComponent } from './pages/join/join';
import { GameComponent } from './pages/game/game';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'host', component: HostComponent },
  { path: 'join/:sessionId', component: JoinComponent },
  { path: 'game', component: GameComponent }
];
