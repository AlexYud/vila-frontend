import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
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

  private users: any[] = [];

  private leader: boolean = false;

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
    private alertController: AlertController,
  ) { }

  ngOnInit() { 
    if (!this.api.getIsInLobby()) this.socket.emit('joinLobby', this.data);
    this.api.getUsersInLobby(this.lobbyId).subscribe({
      next: (usersInLobby) => {
        this.users = usersInLobby;
        if (this.isLeader()) this.leader = true;
      },
      error: (e) => this.utils.presentToast('danger', 'close-circle', JSON.stringify(e))
    })
    this.socket.on(`update ${this.lobbyId}`, (usersInLobby: any) => {
      this.users = usersInLobby;
      if (this.isLeader()) this.leader = true;
    })
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert!',
      buttons: [
        {
          text: 'Sair e Desfazer grupo',
          role: 'cancel',
          handler: () => {
            this.api.setIsInLobby(false);
            this.deleteLobby();
          },
        },
        {
          text: 'Sair',
          role: 'confirm',
          handler: () => {
            this.api.setIsInLobby(false);
            this.socket.emit('exitLobby', this.data);
            this.router.navigate(['tabs/tab2'], { replaceUrl: true });
          },
        },
      ],
    });

    await alert.present();

    // const { role } = await alert.onDidDismiss();
  }

  isLeader() {
    return this.users.filter(u => u.userId === this.api.getUserId())[0].isLeader;
  }

  deleteLobby() {
    this.api.deleteLobby(this.lobbyId).subscribe({
      next: () => this.router.navigate(['tabs/tab2'], { replaceUrl: true }),
      error: (e) => this.utils.presentToast('danger', 'close-circle', JSON.stringify(e))
    });
  }

  async exitLobby() {
    try {
      if (this.leader) {
        await this.presentAlert();
      } else {
        this.api.setIsInLobby(false);
        this.socket.emit('exitLobby', this.data);
        this.router.navigate(['tabs/tab2'], { replaceUrl: true });
      }
    } catch (error) {
      console.log(error);
    }
  }

}
