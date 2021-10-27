import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  loader = <HTMLElement>document.getElementById('loader');

  constructor() {}

  showLoader() {
    this.loader.classList.add('loading');
  }

  hideLoader() {
    this.loader.classList.remove('loading');
  }
}
