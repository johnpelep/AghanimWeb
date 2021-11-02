import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../player.service';
import { HeroService } from '../hero.service';
import { LoaderService } from '../loader.service';
import { Match, SortedMatch } from '../match';
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
  sortedMatches: SortedMatch[] = [];

  constructor(
    private playerService: PlayerService,
    private heroService: HeroService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.loaderService.showLoader();
    this.getHeroes();
  }

  getHeroes() {
    this.heroService.getHeroes().subscribe((heroes) => {
      this.heroes = heroes;
      this.getMatches();
    });
  }

  getMatches() {
    this.playerService.getPlayers().subscribe(
      (players) => {
        players.forEach((player) => {
          player.matches.forEach((match) => {
            match.personaName = player.personaName;
            const options: Intl.DateTimeFormatOptions = {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            };
            match.time = new Date(match.startTime).toLocaleString(
              'en-US',
              options
            );
            match.hero = <Hero>this.heroes[match.heroId.toString()];
            match.durationInTime = this.secondsToHms(match.duration);
            match.kda = `${match.kills}/${match.deaths}/${match.assists}`;
            match.hero.img = `${
              environment.hero_images
            }/${match.hero.name.replace('npc_dota_hero_', '')}.png`;
            this.matches.push(match);
          });
        });

        this.matches.sort((a, b) => b.matchId - a.matchId);

        this.getSortedMatches();
      },
      () => {},
      () => this.loaderService.hideLoader()
    );
  }

  getSortedMatches() {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };

    while (this.matches.length) {
      const firstMatch = this.matches[0];
      const firstMatchDate = new Date(firstMatch.startTime).toLocaleString(
        'en-US',
        options
      );
      const matches = this.matches.filter(
        (m) =>
          new Date(m.startTime).toLocaleString('en-US', options) ==
          firstMatchDate
      );
      const sortedMatch: SortedMatch = {
        date: firstMatchDate,
        matches: matches,
      };
      this.sortedMatches.push(sortedMatch);
      this.matches.splice(0, matches.length);
    }
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
