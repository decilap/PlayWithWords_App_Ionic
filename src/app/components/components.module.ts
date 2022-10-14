import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {ButtonComponent} from "./button/button.component";
import {ButtonsComponent} from "./buttons/buttons.component";
import {LettersComponent} from "./letters/letters.component";
import {SettingComponent} from "./setting/setting.component";
import {StatComponent} from "./stat/stat.component";
import {FormsModule} from "@angular/forms";
import {SettingToggleComponent} from "./setting-toggle/setting-toggle.component";
import {Vibration} from "@ionic-native/vibration/ngx";

@NgModule({
	declarations: [
      ButtonComponent,
      ButtonsComponent,
      LettersComponent,
      SettingComponent,
      StatComponent,
      SettingToggleComponent
	],
	imports: [
		CommonModule,
		IonicModule,
    FormsModule
	],
	exports: [
    ButtonComponent,
    ButtonsComponent,
    LettersComponent,
    SettingComponent,
    StatComponent,
    SettingToggleComponent
	],
  providers: [Vibration]
})
export class ComponentsModule {}
