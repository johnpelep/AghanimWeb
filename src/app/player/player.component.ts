import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import ApexCharts from 'apexcharts';
import { Player } from '../player';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  player!: Player;
  status: string = 'offline';
  gameCount: string = '--';
  winCount: string = '--';
  lossCount: string = '--';
  winRate: string = '--';
  streak: string = '--';

  constructor(
    private route: ActivatedRoute,
    private playerService: PlayerService
  ) {}

  ngOnInit() {
    this.getPlayer();
  }

  getPlayer() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.playerService.getPlayer(id).subscribe((player) => {
      this.player = player;

      this.setPersonaState();

      if (!player.records.length) return;

      // get current record
      const dateInPh = this.getTimeInPh();
      const record = player.records.find(
        (r) =>
          r.month == dateInPh.getMonth() + 1 && r.year == dateInPh.getFullYear()
      );

      // return if no record
      if (!record || !record.streakCount) return;

      this.gameCount = (record.winCount + record.lossCount).toString();
      this.winCount = record.winCount.toString();
      this.lossCount = record.lossCount.toString();
      this.winRate = `${record.winRate}%`;

      this.setUpChart();

      // return if no streak
      if (record.streakCount == 1) return;

      if (record.isWinStreak)
        this.streak = `${record.streakCount.toString()} wins`;
      else this.streak = `${record.streakCount.toString()} losses`;
    });
  }

  setPersonaState() {
    const personaState = this.player.personaState;
    let status = '';
    if (personaState.game) status = 'ingame';
    else if (personaState.id == 0) status = 'offline';
    else if (personaState.id == 1) status = 'online';
    else status = 'away';
    this.status = status;
  }

  //https://stackoverflow.com/a/8207708
  getTimeInPh(): Date {
    const OFFSET = 8; //UTC+8

    // create Date object for current location
    var d = new Date();

    // convert to msec
    // subtract local time zone offset
    // get UTC time in msec
    var utc = d.getTime() + d.getTimezoneOffset() * 60000;

    // create new Date object for different city
    // using supplied offset
    return new Date(utc + 3600000 * OFFSET);
  }

  setUpChart() {
    const options = {
      chart: {
        type: 'line',
        forecolore: '#FFFFFF',
        toolbar: {
          show: false,
        },
        zoom: { enabled: false },
      },
      series: [
        {
          name: 'Net W/L',
          data: this.getMatchData(),
        },
      ],
      xaxis: {
        categories: this.getDaysOfMonth(),
        labels: {
          style: {
            colors: '#FFFFFF',
            fontSize: '0.7 rem',
          },
        },
        title: {
          text: 'Days of Month',
          style: {
            color: '#FFFFFF',
            fontSize: '1 rem',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#FFFFFF',
            fontSize: '0.7 rem',
          },
        },
        title: {
          text: 'Net W/L',
          style: {
            color: '#FFFFFF',
            fontSize: '1 rem',
          },
        },
      },
    };

    const chart = new ApexCharts(document.querySelector('#chart'), options);

    chart.render();
  }

  getMatchData(): number[] {
    const matches = this.player.matches;
    const data: number[] = [];
    const daysOfMonth = this.getDaysOfMonth();

    let netWinLoss = 0;

    for (let index = 1; index <= daysOfMonth.length; index++) {
      const matchesOfDay = matches.filter((m) => m.day == index);

      matchesOfDay.forEach((match) => {
        netWinLoss += match.isWin ? 1 : -1;
      });

      data.push(netWinLoss);
    }

    return data;
  }

  getDaysOfMonth(): number[] {
    const dateInPh = this.getTimeInPh();
    const currentDay = dateInPh.getDate();
    const categories: number[] = [];

    for (let index = 1; index <= currentDay; index++) {
      categories.push(index);
    }

    return categories;
  }
}
