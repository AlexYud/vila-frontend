import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private toastController: ToastController) { }

  async presentToast(color: string, icon: string, msg: string) {
    const toast = await this.toastController.create({
      color: color,
      icon: icon,
      message: msg,
      duration: 1500,
    });

    await toast.present();
  }
}
