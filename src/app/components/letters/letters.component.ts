import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewEncapsulation,
  OnDestroy,
  AfterContentInit, AfterViewInit
} from '@angular/core';
import {AppService} from "../../services/app-service";
import {LoadingController, ModalController, ToastController} from "@ionic/angular";
import Swal from "sweetalert2";
import {LocalStorage} from "../../services/local-storage";
import {Game, Stat} from "../../models/stat";
import {environment} from "../../../environments/environment";
import {Subscription} from "rxjs";
import {AppConfig} from "../../models/app-config";
import {Howl} from 'howler';
import {map, shareReplay} from "rxjs/operators";
import {Vibration} from "@ionic-native/vibration/ngx";
import {Capacitor} from "@capacitor/core";


export interface Track{
  name: string,
  path: string
}


@Component({
  selector: 'app-letters',
  templateUrl: './letters.component.html',
  styleUrls: ['./letters.component.scss'],
})
export class LettersComponent implements OnInit, OnDestroy {
  @Input() row: number;
  @Output() onOpenModal = new EventEmitter<any>();
  playlist: Array<Track> = [
    {
      name: 'Game Over',
      path: './assets/sounds/game-over.mp3'
    },
    {
      name: 'Game Win',
      path: './assets/sounds/game-win.mp3'
    },
    {
      name: 'Click Pad',
      path: './assets/sounds/click.mp3'
    },
    {
      name: 'Delete Pad',
      path: './assets/sounds/delete.mp3'
    }
  ]
  defaultClassColor: string = "default";
  classSuccess: string = "success";
  classWarning: string = "warning";
  rowCount: number = 5;
  colCount: number = 5;
  cols: Array<any> = [];
  rows: Array<any> = [];
  words: Array<any> = [];
  autoIndexes: Array<any> = [];
  chosenWord: string;
  currentRow: number = 0;
  currentCol: number = 0;
  score: number = 0;
  game: Game;
  stat: Stat;
  localStorageObject:any;
  config: AppConfig;
  subscription:Subscription;
  isIndice: boolean = false;
  player: Howl = null;
  isPlaying: boolean = false;
  playingMusicActive: boolean = false;
  playingPadActive: boolean = false;
  isToastPresent:boolean=false;
  isModalPresent:boolean=false;
  loser: boolean = false;
  loading:any;
  countLettersInArray = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a),0);

  constructor(private appService: AppService,
              private toastCtrl: ToastController,
              private localStorage: LocalStorage,
              private vibration: Vibration,
              private loadingCtrl: LoadingController
  ) {}


  async ngOnInit() {
      this.config = await this.localStorage.getItemFromLocalStorage(environment.configKey);
      this.playingPadActive = this.config.padSound;
      this.playingMusicActive = this.config.music;
      this.rowCount = this.config.rowNumber === 0 ? 5 : 2; //this.build();
      this.colCount = this.config.colNumber === 0 ? 5 :
                      this.config.colNumber === 1 ? 6 :
                      this.config.colNumber === 2 ? 7 : 8; this.build();
      this.game = new Game({});

      this.playSound(this.playlist[1], this.playingMusicActive);
      this.localStorageObject = await this.localStorage.getItemFromLocalStorage(environment.statKey);
      //☝️😛 console.log("store", this.chosenWord);
      this.loadLetters();
      this.loadConfig();

  }

  private loadConfig(){
    this.subscription = this.appService.$subjectSetting.subscribe(async (data:any) => {
      if(data.type === "row"){
        this.currentCol = 0;
        this.currentRow = 0;
        this.rowCount = data.index === 0 ? 5 : 2; this.build();
        await this.localStorage.updateStorage(environment.configKey, {rowNumber: data.index});
      }else if(data.type === "col"){
        this.chosenWord = this.appService.decrypt(
          (await this.localStorage.getItemFromLocalStorage(environment.statKey)).goalWord, environment.secret);
        this.currentCol = 0;
        this.currentRow = 0;
        this.colCount = data.index === 0 ? 5 : data.index === 1 ? 6 : data.index === 2 ? 7 : 8; this.build();
        await this.localStorage.updateStorage(environment.configKey, {colNumber: data.index});
      }else if(data.type === "music"){
        this.playingMusicActive = data.isChecked;
        await this.localStorage.updateStorage(environment.configKey, {music: data.isChecked});
      }else if(data.type === "pad"){
        this.playingPadActive  = data.isChecked;
        await this.localStorage.updateStorage(environment.configKey, {padSound: data.isChecked});
      }
    });
  }

  private async loadLetters() {
      this.subscription = this.appService.$subject.subscribe(async (letter) => {
        if (this.currentCol < this.colCount && !this.isIndice) {
          this.playSound(this.playlist[2], this.playingPadActive);
          this.rows[this.currentRow][this.currentCol].letter = letter;
          if (this.currentRow < this.rowCount) {
            this.rows[this.currentRow][this.currentCol].active = true;
          } else {
            return await this.loadToast("Game Over", "bottom", "primary");
          }
          this.currentCol++;
        }else{
          if (Capacitor.isNativePlatform()) {
            this.vibration.vibrate(50)
          }
        }
        return letter;
      });
  }

  showInfo(msg:string){
    let timerInterval
    return  Swal.fire({
      title: 'Alert info',
      html: '<b>' +msg+ '</b>',
      timer: 3000,
      timerProgressBar: true,
      heightAuto: false,
      showConfirmButton: false,
      willClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer')
      }
    })
  }

  async build() {
    this.rows = [];
    this.chosenWord = this.appService.decrypt(
      (await this.localStorage.getItemFromLocalStorage(environment.statKey)).goalWord,
      environment.secret);
    console.log("store ", this.chosenWord)
    for (let row = 0; row < this.rowCount; row++) {
      let cols = [];
      for (let col = 0; col < this.colCount; col++) {
        cols.push({
          letter: '',
          active: false,
          class: this.defaultClassColor,
          status: ''
        });
      }
      this.rows.push(cols);
    }
  }

  isEmpty(rows:any){
     return !!rows.find(row => row.letter === '');
  }

  countLetter(str, find) {
    return (str.split(find)).length - 1;
  }

  findInCorrectStatus(tabLetters:any, letter:string){
    return tabLetters.filter(col => col.status === 'misplaced' && col.letter === letter);
  }

  findCorrectStatus(tabLetters:any, letter:string){
    return tabLetters.filter(col => col.status === 'correct' && col.letter === letter);
  }

  async wordSubmitted(event: any) {
    let answers = [];
    let rows = this.rows[this.currentRow];
    let answersMap = rows.map(row => row.letter);
    let words:any = await this.appService.getListWords(this.colCount);


    if(!(this.currentCol < this.colCount && (!this.game.winner && !this.loser)){
      if (this.isIndice || words.includes(answersMap.join(''))){
        this.isIndice ? this.isIndice = !this.isIndice : '';
        for (let i = 0; i < rows.length; i++) {
          let letter = rows[i].letter;
          let col = rows[i];
          answers.push(letter);
          if (this.chosenWord.includes(letter)) {
            if (this.chosenWord[i] === letter) {
              col.class = this.classSuccess;
              col.status = 'correct';
              this.game.correctLetter.push(col.letter);
            } else {
              if (this.countLettersInArray(answers, letter) <= this.countLetter(this.chosenWord, letter)) {
                col.status = 'misplaced';
              } else {
                col.status = 'noExist';
                col.class = "dark";
              }
            }
          } else {
            col.class = "dark";
            col.status = 'noExist';
          }
        }

        for (let i = 0; i < rows.length; i++) {
          let col = rows[i];
          let letter = col.letter;
          if (this.chosenWord.includes(letter)) {
            let correctStatus: number = this.findCorrectStatus(rows, letter).length;
            let countLetterInChosenWord: number = this.countLetter(this.chosenWord, letter);
            if (this.chosenWord[i] !== letter) {
              if (correctStatus < countLetterInChosenWord && col.status !== 'noExist') {
                col.class = this.classWarning;
                this.game.incorrectLetter.push(col.letter);
              } else {
                col.class = "dark";
                col.status = 'noExist';
              }
            }
          }
        }

        if (this.chosenWord === answersMap.join('')){
          this.playSound(this.playlist[1], this.playingMusicActive);
          this.openModal("Youpii vous avez gagné 😀 ");
          this.game.chosenWinner = this.chosenWord;
          //this.appService.disabledButton(true);
          this.score++;
          this.game.numberOfTries = this.score;
          this.game.winner = true;
          this.localStorageObject.wonGame+=1;
          this.localStorageObject.stats.push(this.game);
          //this.localStorageObject.goalWord = await this.appService.getRandomWord();
        } else{
          if (this.currentRow < this.rowCount - 1){
            this.currentRow = ++this.currentRow;
            this.currentCol = 0;
            this.score++;
            this.game.numberOfTries = this.score;
          } else {
            this.playSound(this.playlist[0], this.playingMusicActive);
            //this.appService.disabledButton(true);
            this.loser = true;
            this.openModal("Game Over 😥 ");
            this.score++;
            this.game.numberOfTries = this.score;
            this.localStorageObject.stats.push(this.game);
          }
        }

      } else {
        return await this.loadToast("Le mot n'existe pas !", "top", "primary");
      }
    }else{
      return await this.loadToast("Le mot doit contenir " + this.colCount + " lettres !", "top", "primary");
    }
    this.localStorage.setItemIntoLocalStorage(environment.statKey, this.localStorageObject);
  }

  private async loadToast(message:string, position:any, color:string) {
    if(!this.isToastPresent){
      const toast = await this.toastCtrl.create({
        message: message,
        color: color,
        position: position,
        cssClass: "tabs-top",
        duration: 3000,
        buttons: [{
          text: "close",
          role: 'cancel',
        }]
      });
      this.isToastPresent = true;
      toast.onDidDismiss().then((e:any) => {
        this.isToastPresent = false;
      });
      await toast.present();
    }
  }

  letterDeleted(event: any) {
    if (this.currentCol > 0){
      this.playSound(this.playlist[3], this.playingPadActive);
      this.currentCol--;
      this.rows[this.currentRow][this.currentCol] = {
        letter: '',
        active: false,
        class: this.defaultClassColor,
        status: 'default'
      };
    }
  }

  openModal(str:string) {
    this.onOpenModal.emit({str: str, colCount: this.colCount});
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  playSound(track : Track, active:boolean){
    if(active){
      this.player = new Howl({
        src: [track.path],
        volume: 0.2
      });
      this.player.play()
    }
  }

  randomNumshuffle(a) {
     for (let i = a.length - 1; i > 0; i--) {
       const j = Math.floor(Math.random() * (i + 1));
       [a[i], a[j]] = [a[j], a[i]];
     }
     return a;
 }

  indice(event:any){
    if(!this.isIndice){
      this.isIndice = true;
      let alphabetLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      let usedNums = this.chosenWord.split('');
      let usedNumsRandom = this.randomNumshuffle(usedNums).slice(-2);
      let alphabetLettersSliceCount = this.colCount === 5 ? -3 :
        this.colCount === 6 ? -4 :
          this.colCount === 6 ? -4 :
            this.colCount === 7 ? -5 : -6;
      let alphabetLettersRandom = this.randomNumshuffle(alphabetLetters).splice(alphabetLettersSliceCount);
      let mergeLetters = usedNumsRandom.concat(alphabetLettersRandom);
      let promesse = new Promise<void>((resolve, reject) => {
        this.randomNumshuffle(mergeLetters).forEach((letter, index) => {
          setTimeout(() => {
            this.rows[this.currentRow][index] = {
              letter: letter,
              active: true,
              class: this.defaultClassColor,
              status: ''
            };
            this.currentCol = index + 1;
            index === mergeLetters.length - 1 ? resolve() : '';
          }, 500 * (index + 1));
        });
      });

      promesse.then(() => {
        this.wordSubmitted(null);
      });
    }
  }

}
