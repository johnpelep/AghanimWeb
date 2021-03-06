import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerService } from './player.service';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'AghanimWeb';
  id = '';

  constructor(
    private router: Router,
    private playerService: PlayerService,
    private loaderService: LoaderService
  ) {}

  invitePlayer(text: string) {
    if (text.endsWith('/')) text = text.slice(0, -1);

    this.id = <string>text.split('/').pop();

    this.loaderService.showLoader();

    this.playerService.invitePlayer(this.id).subscribe(
      (player) => {
        const input = <HTMLInputElement>document.querySelector('#profile-url');
        input.value = '';
        this.router.navigate([`/player/${player.id}`]);
      },
      () => {},
      () => this.loaderService.hideLoader()
    );
  }

  onClick() {
    navigator.clipboard.readText().then((text) => {
      if (!text.startsWith('https://steamcommunity.com/')) return;
      const input = <HTMLInputElement>document.querySelector('#profile-url');
      input.value = text;
      this.invitePlayer(text);
    });
  }

  onKey(event: KeyboardEvent) {
    if (event.code != 'Enter') return;
    const input = <HTMLInputElement>document.querySelector('#profile-url');
    if (!input.value.startsWith('https://steamcommunity.com/')) {
      alert(
        'Invalid steam profile URL.\n\nSample URLs:\n- https://steamcommunity.com/id/johnpelep\n- https://steamcommunity.com/profiles/76561198069500729'
      );
      return;
    }
    this.invitePlayer(input.value);
  }
}
