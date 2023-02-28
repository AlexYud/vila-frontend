import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// const io = require('../socket/socket');
import io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url: string = 'http://localhost:3000/';
  private socket: any = io(this.url, { transports: ['websocket'], reconnection: true });
  private userId: number = 1;
  private userName: string = 'Galowillian';
  private userLevel: number = 0;

  constructor(private http: HttpClient) { }

  testConnection(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  setUserId(id: number) {
    this.userId = id;
  }

  getUserId() {
    return this.userId;
  }

  setUserName(name: string) {
    this.userName = name;
  }

  getUserName() {
    return this.userName;
  }

  setUserLevel(level: number) {
    this.userLevel = level;
  }

  getUserLevel() {
    return this.userLevel;
  }

  getSocket() {
    return this.socket;
  }

  createUser(name: string): Observable<any> {
    return this.http.post<any>(`${this.url}api/createUser`, { name });
  }

  getAllLobbys(): Observable<any> {
    return this.http.get<any>(`${this.url}api/getAllLobbys`);
  }

  createLobby(name: string, capacity: number): Observable<any> {
    return this.http.post<any>(`${this.url}api/createLobby`, {
      name,
      capacity,
      userId: this.userId,
    });
  }

  deleteLobby(lobbyId: number): Observable<any> {
    return this.http.post<any>(`${this.url}api/deleteLobby`, { lobbyId });
  }

  // joinLobby(userId: number, lobbyId: any): Observable<any> {
  //   return this.http.post<any>(`${this.url}api/joinLobby`, { userId, lobbyId });
  // }
}
