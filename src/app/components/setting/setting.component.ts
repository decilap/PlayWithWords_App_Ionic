import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {AppService} from "../../services/app-service";
import updateSetting, {AppConfig} from "../../models/app-config";
import {LocalStorage} from "../../services/local-storage";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit, AfterViewInit {
  currentLayout: number;
  currentRow: number;
  currentCol: number;
  keyboardNames = [
    {
      val: 'AZERTY',
      isChecked: false
    },
    {
      val: 'BÉMO',
      isChecked: false
    },
    {
      val: 'QWERTY',
      isChecked: false
    }
  ];
  rowsCheckboxes = [
    {
      val: 'Facile',
      isChecked: false
    },
    {
      val: 'Difficile',
      isChecked: false
    }
  ];
  colsCheckboxes = [
    {
      val: '5 lettres',
      isChecked: false
    },
    {
      val: '6 lettres',
      isChecked: false
    },
    {
      val: '7 lettres',
      isChecked: false
    },
    {
      val: '8 lettres',
      isChecked: false
    }
  ];
  music: boolean = false;
  padSoundOptions: boolean = false;
  config: AppConfig;
  color="small"

  constructor(private modalCtrl: ModalController,
              private appService: AppService,
              private localStorage: LocalStorage) { }

  async ngOnInit() {

  }

  async ngAfterViewInit() {
    this.config = await this.localStorage.getItemFromLocalStorage(environment.configKey);
    this.currentLayout = this.config.keyboardState;
    this.currentRow = this.config.rowNumber;
    this.currentCol = this.config.colNumber;
    this.music = this.config.music;
    this.padSoundOptions = this.config.padSound;
    this.keyboardNames[this.currentLayout].isChecked = true;
    this.rowsCheckboxes[this.currentRow].isChecked = true;
    this.colsCheckboxes[this.currentCol].isChecked = true;
  }

  onDismiss(query: any = null) {
    this.modalCtrl.dismiss({});
  }

  onChangeKeyBoard(event: any, index:number) {
    if(event) {
      this.keyboardNames = updateSetting(this.keyboardNames, index, 'isChecked', () =>
        this.appService.keyBoard(index))
    }
  }

  onChangeRow(event: any, index: number) {
    if(event) {
      this.rowsCheckboxes = updateSetting(this.rowsCheckboxes, index, 'isChecked', () =>
        this.appService.changeSettingOpts({index:index, type: 'row'}))
    }
  }

  onSoundOption(event: any) {
      this.appService.changeSettingOpts({isChecked: event, type: 'music'});
  }

  onSoundPad(event: any) {
      this.appService.changeSettingOpts({isChecked: event, type: 'pad'});
  }

  async onChangeCol(event: any, index: number) {
    if(event) {
      let chosenWord = await this.appService.getRandomWord(index);
      await this.localStorage.updateStorage(environment.statKey, {goalWord: chosenWord});
      this.colsCheckboxes = updateSetting(this.colsCheckboxes, index, 'isChecked', () =>
        this.appService.changeSettingOpts({index:index, type: 'col', chosenWord: chosenWord}))
    }
  }



}

