import { Component } from '@angular/core';
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

  constructor(private alertController: AlertController, private utils: UtilsService, private api: ApiService) { }

  ngOnInit() {
    this.api.getAllLobbys().subscribe(servers => {
      this.servers = servers;
    });
  }

  async createLobby() {
    const alert = await this.alertController.create({
      header: 'Please enter the lobby data',
      buttons: ['Cancel', 'OK'],
      inputs: [
        {
          placeholder: 'Lobby name (max 8 characters)',
          attributes: {
            maxlength: 8,
          },
        },
        {
          type: 'number',
          placeholder: 'Capacity',
          min: 1,
          max: 1,
        },
      ],
    });

    await alert.present();

    const { role, data } = await alert.onDidDismiss();
    if (role === undefined) this.validateLobbyData(data.values);

  }

  async validateLobbyData(data: any) {
    if (data[0].length === 0) return await this.utils.presentToast('danger', 'close-circle', 'Empty name not allowed.');
    if (data[1].length === 0) return await this.utils.presentToast('danger', 'close-circle', 'Empty capacity not allowed.');
    return this.sendLobbyData(data);
  }

  sendLobbyData(data: any) {
    this.api.createLobby(data[0], data[1]).subscribe((resp: any) => {
      this.utils.presentToast('success', 'checkmark-circle', JSON.stringify(resp));
    });
  }

}
