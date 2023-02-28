import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  servers: any[] = [];

  constructor(
    private alertController: AlertController, 
    private utils: UtilsService, 
    private api: ApiService,
    public router: Router,
    ) { }

  ngOnInit() {
    this.getLobbys();
  }

  async createLobby() {
    const alert = await this.alertController.create({
      header: 'Please enter the lobby data',
      buttons: ['Cancel', 'OK'],
      inputs: [
        {
          placeholder: 'Lobby name (max 15 characters)',
          attributes: {
            maxlength: 15,
          },
        },
        {
          type: 'number',
          placeholder: 'Capacity',
          min: 5,
          max: 5,
        },
      ],
    });

    await alert.present();

    const { role, data } = await alert.onDidDismiss();
    if (role === undefined) this.validateLobbyData(data.values);

  }

  getLobbys() {
    this.api.getAllLobbys().subscribe(servers => {
      this.servers = servers;
      console.log(servers);
      
    });
  }

  async validateLobbyData(data: any) {
    if (data[0].length === 0) return await this.utils.presentToast('danger', 'close-circle', 'Empty name not allowed.');
    if (data[1].length === 0) return await this.utils.presentToast('danger', 'close-circle', 'Empty capacity not allowed.');
    return this.sendLobbyData(data);
  }

  sendLobbyData(data: any) {
    this.api.createLobby(data[0], data[1]).subscribe({
      next: (lobbyId) => this.router.navigate(['lobby', lobbyId[0]], { replaceUrl: true }),
      error: (e) => this.utils.presentToast('danger', 'close-circle', JSON.stringify(e)),
  });
  }

  joinLobby(lobbyId: number) {
    this.router.navigate(['lobby', lobbyId], { replaceUrl: true })
  }

}
