import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../player.service';
import { HeroService } from '../hero.service';
import { Match } from '../player';
import { Hero } from '../hero';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  heroes!: any;
  matches: Match[] = [];
  openDotaUrl = environment.open_dota_url;

  constructor(
    private playerService: PlayerService,
    private heroService: HeroService
  ) {}

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes() {
    this.heroService.getHeroes().subscribe((heroes) => {
      this.heroes = heroes;
      this.getMatches();
    });
  }

  getMatches() {
    this.playerService.getPlayers().subscribe((players) => {
      players.forEach((player) => {
        player.matches.forEach((match) => {
          match.personaName = player.personaName;
          match.time = new Date(match.startTime)
            .toLocaleString('en-US')
            .replace(',', '');
          match.hero = <Hero>this.heroes[match.heroId.toString()];
          match.durationInTime = this.secondsToHms(match.duration);
          match.kda = `${match.kills}/${match.deaths}/${match.assists}`;
          this.matches.push(match);
        });
      });

      this.matches.sort((a, b) => b.matchId - a.matchId);
    });
  }

  //src: https://stackoverflow.com/a/5539081
  secondsToHms(d: number): string {
    d = Number(d);

    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    return (
      (h > 0 ? h + ':' : '') + ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2)
    );
  }
}
