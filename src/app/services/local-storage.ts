import { Injectable } from '@angular/core';
import {Storage} from "@capacitor/storage";
import {AppConfig} from "../models/app-config";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LocalStorage {

  constructor() {}

  async getItemFromLocalStorage(item:string):Promise<any>{
    let data:any = await Storage.get({key: item});
    return JSON.parse(data.value);
  }

  setItemIntoLocalStorage(key: string, objetStat:any){
    Storage.set({key: key, value: JSON.stringify(objetStat)});
  }

  async updateStorage(key:string, dataStorage:any){
    let obj = await this.getItemFromLocalStorage(key);
    this.setItemIntoLocalStorage(
      key,
      Object.assign(obj, dataStorage)
    );
  }

  clearStorage(key:string): Promise<void> {
    return Storage.remove({key:key});
  }
}
