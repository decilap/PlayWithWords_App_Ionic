import {Component, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import {AppService} from "../../services/app-service";
import {Subscription} from "rxjs";
import {LocalStorage} from "../../services/local-storage";
import {environment} from "../../../environments/environment";
import {AppConfig} from "../../models/app-config";

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit, OnDestroy {
  @Output() onSubmit = new EventEmitter<boolean>();
  @Output() onDelete = new EventEmitter<boolean>();
  currentLayout: number;
  finishedGame: any = false;
  subscription:Subscription
  layouts = [
    {
      layoutTop: ['A','Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      layoutCenter: ['Q','S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
      layoutBottom: ['W', 'X', 'C', 'V', 'B', 'N']
    },
    {
      layoutTop: ['B','E', 'P', 'O', 'W', 'V', 'D', 'L', 'J', 'Z'],
      layoutCenter: ['A', 'U', 'I', 'C', 'T', 'S', 'R', 'N', 'M', 'F'],
      layoutBottom: ['Y', 'X', 'K', 'Q', 'G', 'H']
    },
    {
      layoutTop: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      layoutCenter: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z'],
      layoutBottom: [ 'X', 'C', 'V', 'B', 'N', 'M']
    }
  ]
  config: AppConfig;

  constructor(private appService: AppService,
              private localStorage: LocalStorage) {}

  async ngOnInit() {
    this.config = await this.localStorage.getItemFromLocalStorage(environment.configKey);
    this.currentLayout = this.config.keyboardState;

    this.subscription = this.appService.$subjectBool.subscribe(async isTrue => {
      this.finishedGame = isTrue;
    });

    this.subscription = this.appService.$subjectKeyboard.subscribe(index => {
      this.currentLayout = index;
      this.localStorage.updateStorage(environment.configKey, {keyboardState: index});
    });
  }




  enter(event:any){
    this.onSubmit.emit(true);
  }

  delete(event: any) {
    this.onDelete.emit(true);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
