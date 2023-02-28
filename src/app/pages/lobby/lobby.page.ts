import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.page.html',
  styleUrls: ['./lobby.page.scss'],
})
export class LobbyPage implements OnInit {
  private lobbyId: number = Number(this.route.snapshot.paramMap.get('id'));

  private socket = this.api.getSocket();

  private players: any[] = [];

  private data = {
    userId: this.api.getUserId(),
    userName: this.api.getUserName(),
    userLevel: this.api.getUserLevel(),
    lobbyId: this.lobbyId,
  }

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private utils: UtilsService,
  ) { }

  ngOnInit() {
    this.socket.emit('joinLobby', this.data);
    // this.api.joinLobby(this.api.getUserId(), this.lobbyId).subscribe({
    //   next: (a) => console.log(a),
    //   error: (e) => console.log(e),
    // });
    this.socket.on(`joined ${this.lobbyId}`, (playersInLobby: any) => {
      this.players = playersInLobby;
    })
  }

  deleteLobby() {
    this.api.deleteLobby(this.lobbyId).subscribe({
      next: () => this.router.navigate(['tabs/tab2']),
      error: (e) => this.utils.presentToast('danger', 'close-circle', JSON.stringify(e))
    });
  }

}
