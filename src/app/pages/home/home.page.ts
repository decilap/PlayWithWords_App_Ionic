import {Component, OnInit, Output, ViewChild} from '@angular/core';
import {AppService} from "../../services/app-service";
import {LoadingController, ModalController, NavController} from "@ionic/angular";
import {StatComponent} from "../../components/stat/stat.component";
import {SettingComponent} from "../../components/setting/setting.component";
import {LettersComponent} from "../../components/letters/letters.component";
import {ModalComponent} from "../../components/modal/modal.component";
import {LocalStorage} from "../../services/local-storage";
import {environment} from "../../../environments/environment";
import {Game} from "../../models/stat";
import {HelpComponent} from "../../components/help/help.component";
import { Vibration } from '@ionic-native/vibration/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  @ViewChild(LettersComponent, {static : true}) letter : LettersComponent;
  html:boolean = true;
  loading:any;

  constructor(
    private storage: LocalStorage,
    private appService: AppService,
    private modalCtrl: ModalController,
    private router: NavController,
    private loadingCtrl: LoadingController
  ) {}

  async onLogout() {
   // await this.storage.clearStorage(environment.statKey);
    this.router.back()
  }

  ngOnInit() {
    this.loadLoader();
  }

  loadLoader(){
    setTimeout(() => {
      this.loading.dismiss();
    }, 1500);
    this.presentLoading("Loading ...");
  }

  async presentLoading(message: string){
    this.loading = await this.loadingCtrl.create({
      message
    });
    return await this.loading.present();
  }

  async onStat() {
    const modal = await this.modalCtrl.create({
      component: StatComponent,
      componentProps: {params: "filteredParams"}
    });
    await modal.present();
  }

  async onSetting() {
    const modal = await this.modalCtrl.create({
      component: SettingComponent,
      componentProps: {params: "filteredParams"},
      cssClass: 'transparent-modal small-modal'
    });
    await modal.present();
  }

  async onFinishedGame(obj:any) {
    if(!this.letter.isModalPresent) {
      const modal = await this.modalCtrl.create({
        component: ModalComponent,
        componentProps: {message: obj.str, colCount: obj.colCount},
        cssClass: 'transparent-modal'
      });
      this.letter.isModalPresent = true;
      modal.onDidDismiss().then(async (objDiss) => {
        this.letter.isModalPresent = false;
        if (objDiss !== null) {
          if (objDiss.data.type == 'next') {
            let chosenWordEncrypt = await this.appService.getRandomWord(objDiss.data.index);
            this.letter.currentRow = 0;
            this.letter.currentCol = 0;
            this.letter.player.stop();
            this.letter.colCount = obj.colCount;
            this.letter.game = new Game({});
            this.letter.chosenWord = this.appService.decrypt(chosenWordEncrypt, environment.secret);
            await this.storage.updateStorage(environment.statKey, {goalWord: chosenWordEncrypt});
            this.letter.build();
          } else {
            //await this.storage.clearStorage();
            this.letter.player.stop();
            this.router.back();
          }
        }
      });
      await modal.present();
    }
  }

  async onHelp() {
    const modal = await this.modalCtrl.create({
      component: HelpComponent,
      cssClass: 'help-modal'
    });
    await modal.present();
  }
  onSubmit(event:any){
    this.letter.wordSubmitted(event);
  }

  onDelete(event:any){
    this.letter.letterDeleted(event);
  }

}
