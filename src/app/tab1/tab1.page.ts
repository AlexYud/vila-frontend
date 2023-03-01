import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {

  userName: string = 'Galowillian'

  constructor(private api: ApiService, private alertController: AlertController, private utils: UtilsService) { }

  ngOnInit() {
    this.userName = this.api.getUserName();
  }

  async presentAlert() {
    try {
      const alert = await this.alertController.create({
        header: 'Please enter your name',
        buttons: ['Cancel', 'OK'],
        inputs: [
          {
            placeholder: 'Nickname (max 8 characters)',
            attributes: {
              maxlength: 8,
            },
          },
        ],
      });

      await alert.present();

      const { role, data } = await alert.onDidDismiss();
      if (role === undefined) this.validateName(data.values[0]);

    } catch (error) {
      await this.utils.presentToast('danger', 'close-circle', JSON.stringify(error));
    }
  }

  async validateName(name: string) {
    try {
      if (name.length === 0) return await this.utils.presentToast('danger', 'close-circle', 'Empty name is not allowed.');
      return this.sendName(name);
    } catch (error) {
      await this.utils.presentToast('danger', 'close-circle', JSON.stringify(error));
    }
  }

  sendName(name: string) {
    this.api.createUser(name).subscribe(id => {
      this.api.setUserId(id);
      this.api.setUserName(name);
      this.userName = name;
    });
  }


}
