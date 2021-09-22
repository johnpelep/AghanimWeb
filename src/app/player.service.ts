import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Player } from './player';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private playersUrl =
    'http://ec2-3-1-83-97.ap-southeast-1.compute.amazonaws.com/api/players';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.playersUrl);
  }

  getPlayer(id: number): Observable<Player> {
    return this.http.get<Player>(`${this.playersUrl}/${id}`);
  }
}
