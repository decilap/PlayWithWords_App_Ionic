import {Component, Injector, OnInit, Output} from '@angular/core';
import {AppService} from "../../services/app-service";
import {ToastController} from "@ionic/angular";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export abstract class BasePage {
  protected toastCtrl: ToastController;
  protected appService: AppService;

  constructor(private injector: Injector) {
   this.toastCtrl = injector.get(ToastController)
   this.appService = injector.get(AppService)

  }


  async showToast(
    message: string = '',
    position: string = 'bottom',
    buttons: any = null,
    duration: number = 3000) {

    let cssClass = '';

    if (position === 'top') {
      cssClass = 'tabs-top';
    } else if (position === 'bottom') {
      cssClass = 'tabs-bottom';
    }

    const toast = await this.toastCtrl.create({
      message: message,
      color: 'primary',
      position: 'bottom',
      cssClass: cssClass,
      duration: duration,
      buttons: buttons || [{
        text: "close",
        role: 'cancel',
      }]
    });

    return toast.present();
  }

  async showSweetSuccessView(msg): Promise<any> {

    Swal.fire({
      title: 'Info alert!',
      html: `<p>${msg}</p>`,
      timer: 1000,
      timerProgressBar: true,
      /*didOpen: () => {
        Swal.showLoading()
        const b = Swal.getHtmlContainer().querySelector('b')
        timerInterval = setInterval(() => {
          b.textContent = Swal.getTimerLeft()
        }, 100)
      }*/
      willClose: () => {
      //  clearInterval(timerInterval)
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer')
      }
    })

  }
}
