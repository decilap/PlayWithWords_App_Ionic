import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import * as CryptoJS from "crypto-js";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  $subject: Subject<any> = new Subject<any>();
  $subjectBool: Subject<boolean> = new Subject<boolean>();
  $subjectWord: Subject<any> = new Subject<any>();
  $subjectModal: Subject<string> = new Subject<string>();
  $subjectKeyboard: Subject<number> = new Subject<number>();
  $subjectSetting: Subject<number> = new Subject<number>();

  constructor( private http: HttpClient) {}

  addLetter(letter:any){
    this.$subject.next(letter);
  }

  disabledButton(isTrue:any){
   // this.$subjectBool.next(isTrue);
  }

  goalWord(obj:any){
    this.$subjectWord.next(obj);
  }

  setMessage(str:string) {
    this.$subjectModal.next(str);
  }

  getRandomWord(index:number): Promise<any>{
    let url = index === 0 ? "./assets/json/letter5.json" :
              index === 1 ? "./assets/json/letter6.json" :
              index === 2 ? "./assets/json/letter7.json" : "./assets/json/letter8.json";
    return this.http.get(url).pipe(
      map((data:any) => {
        return this.encrypt(
          data.wordlist[Math.floor(Math.random() * data.wordlist.length)],
          environment.secret).toString()
      })
    ).toPromise();
  }

  getListWords(colCount:number): Promise<any>{
    let url = colCount === 5 ? "./assets/json/letter5.json" :
              colCount === 6 ? "./assets/json/letter6.json" :
              colCount === 7 ? "./assets/json/letter7.json" : "./assets/json/letter8.json";
    return this.http.get(url).pipe(
      map((data:any) => {
        return data.wordlist;
      })
    ).toPromise();
  }


  keyBoard(index: number){
    this.$subjectKeyboard.next(index);
  }

  changeSettingOpts(data:any){
    this.$subjectSetting.next(data);
  }

  encrypt(message, key) {
    return CryptoJS.AES.encrypt(message, key);
  }


  decrypt(encrypted, key) {
    return CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8);
  }


}
