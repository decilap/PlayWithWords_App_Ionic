import { Component, OnInit } from '@angular/core';
import {AppService} from "../../services/app-service";
import {Storage} from "@capacitor/storage";
import {LocalStorage} from "../../services/local-storage";
import {Router} from "@angular/router";
import {Stat} from "../../models/stat";
import {environment} from "../../../environments/environment";
import {AppConfig} from "../../models/app-config";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  chosenWord:string;
  stat: Stat;
  appConfig: AppConfig;
  name:string;
  constructor( private appService: AppService,
               private localStoage: LocalStorage,
               private router: Router
  ) { }


  async ionViewWillEnter() {
    this.appConfig = await this.localStoage.getItemFromLocalStorage(environment.configKey) || new AppConfig({});
    this.chosenWord = await this.appService.getRandomWord(this.appConfig.colNumber);
    this.stat = new Stat({
      goalWord: this.chosenWord
    });
  }



  async onSubmit(event: any) {
    this.stat.pseudo = "current"//this.name;
    this.localStoage.setItemIntoLocalStorage(environment.statKey, this.stat);

    this.localStoage.setItemIntoLocalStorage(environment.configKey, this.appConfig);
    this.router.navigate(['/home']);
  }
}
