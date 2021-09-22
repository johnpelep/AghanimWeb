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
  player: Player | undefined;

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
      console.log(this.player.rank.medalName);
    });
  }
}
