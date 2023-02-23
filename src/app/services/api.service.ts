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
  private userId: number = -1;

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

  createUser(name: string): Observable<any> {
    return this.http.post<any>(`${this.url}api/createUser`, { name });
  }
}
