import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import ApexCharts from 'apexcharts';
import { PlayerService } from '../player.service';
import { HeroService } from '../hero.service';
import { LoaderService } from '../loader.service';
import { Player, Record } from '../player';
import { Match } from '../match';
import { Hero } from '../hero';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  playerId = 0;
  heroes!: any;
  player!: Player;
  statusClass = 'offline';

  // for record display
  totalGames = '--';
  winCount = '--';
  lossCount = '--';
  winRate = '--';
  streak = '--';

  // for chart and modal
  openDotaUrl = environment.open_dota_url;
  datesUntilLastMonth: Date[] = [];
  matchesPerCategory: Match[][] = [];
  selectedMatches: Match[] = [];
  selectedRecord: Record = {
    winCount: 0,
    lossCount: 0,
    isWinStreak: false,
    streakCount: 0,
    lastMatchOn: '',
    totalGames: 0,
    winRate: 0,
  };

  constructor(
    private route: ActivatedRoute,
    private playerService: PlayerService,
    private heroService: HeroService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.getHeroes();
    this.route.params.subscribe((res) => {
      this.playerId = Number(res.id);
      this.getPlayer();
    });
  }

  getHeroes() {
    this.heroService.getHeroes().subscribe((heroes) => (this.heroes = heroes));
  }

  getPlayer() {
    this.loaderService.showLoader();
    this.playerService.getPlayer(this.playerId).subscribe(
      (player) => {
        this.player = player;

        if (!player) return;
        this.setPersonaState();

        if (!player.record.totalGames) return;
        this.setRecord();

        if (!player.matches.length) return;
        this.setUpChart();
      },
      () => {},
      () => this.loaderService.hideLoader()
    );
  }

  setPersonaState() {
    const personaState = this.player.personaState;
    let status = '';
    if (personaState.game) status = 'ingame';
    else if (personaState.id == 0) status = 'offline';
    else if (personaState.id == 1) status = 'online';
    else status = 'away';
    this.statusClass = status;
  }

  setRecord() {
    const record = this.player.record;

    this.totalGames = record.totalGames.toString();
    this.winCount = record.winCount.toString();
    this.lossCount = record.lossCount.toString();
    this.winRate = `${record.winRate}%`;

    // return if no streak
    if (record.streakCount == 1) return;

    if (record.isWinStreak)
      this.streak = `${record.streakCount.toString()} wins`;
    else this.streak = `${record.streakCount.toString()} losses`;
  }

  //https://stackoverflow.com/a/8207708
  getDateTimeInPh(): Date {
    const OFFSET = 8; //UTC+8

    // create Date object for current location
    const d = new Date();

    // convert to msec
    // subtract local time zone offset
    // get UTC time in msec
    const utc = d.getTime() + d.getTimezoneOffset() * 60000;

    // create new Date object for different city
    // using supplied offset
    return new Date(utc + 3600000 * OFFSET);
  }

  setUpChart() {
    const options = {
      chart: {
        type: 'line',
        forecolore: '#FFFFFF',
        events: {
          click: (e: any, chart?: any, options?: any) => {
            this.clickChart(options.dataPointIndex);
          },
        },
        toolbar: {
          show: false,
        },
        zoom: { enabled: false },
      },
      series: [
        {
          data: this.getMatchData(),
        },
      ],
      tooltip: {
        custom: ({ series, seriesIndex, dataPointIndex, w }: any) => {
          return this.getToolTip(dataPointIndex);
        },
      },
      xaxis: {
        categories: this.getCategories(),
        labels: {
          style: {
            colors: '#FFFFFF',
            fontSize: '0.7rem',
          },
        },
        title: {
          text: 'Past 30 Days',
          style: {
            color: '#FFFFFF',
            fontSize: '1rem',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#FFFFFF',
            fontSize: '0.7rem',
          },
        },
        title: {
          text: 'Net W/L',
          style: {
            color: '#FFFFFF',
            fontSize: '1rem',
          },
        },
      },
    };

    const chartElem = <Element>document.querySelector('#chart');
    chartElem.innerHTML = '';
    const chart = new ApexCharts(chartElem, options);

    chart.render();
  }

  getMatchData(): number[] {
    const matches = this.player.matches;
    const data: number[] = [];
    this.datesUntilLastMonth = this.getDatesUntilLastMonth();

    let netWinLoss = 0;

    this.datesUntilLastMonth.forEach((date) => {
      const matchesOfDay = matches.filter(
        (m) =>
          new Date(m.startTime).getDate() == date.getDate() &&
          new Date(m.startTime).getMonth() == date.getMonth()
      );

      this.matchesPerCategory.push(matchesOfDay);

      matchesOfDay.forEach((match) => {
        netWinLoss += match.isWin ? 1 : -1;
      });

      data.push(netWinLoss);
    });

    return data;
  }

  getCategories(): string[] {
    const categories: string[] = [];
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
    };

    this.datesUntilLastMonth.forEach((date) => {
      categories.push(date.toLocaleString('en-US', options));
    });

    return categories;
  }

  getDatesUntilLastMonth(): Date[] {
    const dates: Date[] = [];
    const dateInPh = this.getDateTimeInPh();
    let date = new Date(dateInPh.setDate(dateInPh.getDate() - 30));

    do {
      dates.push(date);
      date = new Date(date.setDate(date.getDate() + 1)); // increment day by 1
    } while (date.getDate() != dateInPh.getDate());

    return dates;
  }

  getToolTip(dataPointIndex: number): string {
    const selectedDate = this.datesUntilLastMonth[dataPointIndex];
    let options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      year: 'numeric',
      day: 'numeric',
    };
    this.selectedRecord.lastMatchOn = selectedDate.toLocaleString(
      'en-US',
      options
    );

    this.selectedMatches = this.matchesPerCategory[dataPointIndex];

    this.selectedRecord.winCount = 0;
    this.selectedRecord.lossCount = 0;

    this.selectedMatches.forEach((match) => {
      if (match.isWin) this.selectedRecord.winCount++;
      else this.selectedRecord.lossCount++;

      const startTime = new Date(match.startTime);
      options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      };
      match.time = startTime.toLocaleString('en-US', options);
      match.hero = <Hero>this.heroes[match.heroId.toString()];
      match.durationInTime = this.secondsToHms(match.duration);
      match.kda = `${match.kills}/${match.deaths}/${match.assists}`;
    });

    const tooltip = <HTMLElement>(
      document.getElementById('custom-tooltip-container')
    );
    return tooltip.innerHTML;
  }

  clickChart(dataPointIndex: number) {
    this.selectedMatches = this.matchesPerCategory[dataPointIndex];

    if (!this.selectedMatches.length) return;

    // sort match ascending
    this.selectedMatches.sort((a, b) => a.matchId - b.matchId);

    const modal = <HTMLElement>document.getElementById('matches-modal');
    modal.style.display = 'block';
  }

  closeModal() {
    const modal = <HTMLElement>document.getElementById('matches-modal');
    modal.style.display = 'none';
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
