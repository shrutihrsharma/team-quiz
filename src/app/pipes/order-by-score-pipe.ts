import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderByScore',
  standalone: true,
})
export class OrderByScorePipe implements PipeTransform {
  transform(players: any[]): any[] {
    if (!players) return [];

    return [...players].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.name.localeCompare(b.name);
    });
  }
}
