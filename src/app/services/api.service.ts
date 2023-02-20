import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io } from 'socket.io-client'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url: string = 'http://localhost:3000/'
  private socket: any = io(this.url, { transports: ['websocket'], reconnection: true })

  constructor(private http: HttpClient) { }

  testConnection(): Observable<any> {
    console.log(this.socket.id);
    
    return this.http.get<any>(this.url);
  }


}
