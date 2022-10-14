import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AppService} from "../../services/app-service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() alphabets: Array<string>;
  @Input() finishedGame: boolean;

  constructor( private appService: AppService ) { }

  ngOnInit() {  }

  onClick(event:any){
    this.appService.addLetter(event.target.textContent);
  }



}
