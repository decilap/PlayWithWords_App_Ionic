import {Component, Input, OnInit} from '@angular/core';
import {AppService} from "../../services/app-service";
import {ModalController} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {

  @Input() message:string;
  @Input() colCount:number;

  constructor(private appService: AppService,
              private modalCtrl: ModalController,
             // private router: Router
  ) { }

  ngOnInit() {}

  onContinue() {
    //this.router.navigateByUrl('/home').then(() => {
      //window.location.reload();
   // });
    let index = this.colCount === 5 ? 0 : this.colCount === 6 ? 1 : this.colCount === 7 ? 2 : 3;
    this.dismiss({type:'next', index: index});
  }

  onExit() {
   /* this.router.navigateByUrl('/login')
      .then(() => {
        window.location.reload();
      });*/
    this.dismiss('stop');
  }

  dismiss(query: any = null) {
    this.modalCtrl.dismiss(query);
  }
}
