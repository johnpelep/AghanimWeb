import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Player } from '../player';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  player!: Player;
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

      // return if no streak
      if (record.streakCount == 1) return;

      if (record.isWinStreak)
        this.streak = `${record.streakCount.toString()} wins`;
      else this.streak = `${record.streakCount.toString()} losses`;
    });
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
}
