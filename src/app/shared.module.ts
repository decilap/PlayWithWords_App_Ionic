import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from './components/components.module';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ComponentsModule
  ],
  exports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ComponentsModule
  ],
  providers: [],
})
export class SharedModule {}
