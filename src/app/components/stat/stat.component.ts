import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {LocalStorage} from "../../services/local-storage";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss'],
})
export class StatComponent implements OnInit {
  @Input() colCount:number;

  nbGames:number = 0;
  averageTentatives:number = 0;
  wonGamesEnPourcent:number = 0;
  topSerie:number = 0;
  words:Array<string>;


  constructor(private modalCtrl: ModalController,
              private localStorage: LocalStorage
              ) { }

  async ngOnInit() {
    let result = await this.localStorage.getItemFromLocalStorage(environment.statKey);
    let wonGames = result.stats.filter(game => game.winner === true);
    this.nbGames = result.stats.length;
    if (wonGames.length !== 0){
      this.wonGamesEnPourcent = parseFloat(((result.wonGame * 100) / this.nbGames).toFixed(2));
      this.averageTentatives = parseFloat(this.calculMoyenneTentative(wonGames).toFixed(2));
      this.topSerie = this.nbTentativeSmallerToWin(wonGames);
      this.words = this.listFoundWords(wonGames);
    }
  }

  calculMoyenneTentative(resultat){
    let totalTentatives = resultat.reduce(function(acc, val){
      return (acc + val.numberOfTries);
    }, 0);
    return totalTentatives/resultat.length
  }

  /**
   * méthode qui retourne le nombre minimale de tentatives réalisées pour trouver le mot sur la base des games
   * @param resultat : tableau de games gagnés par le player
   */
  nbTentativeSmallerToWin(resultat){
    let listOfnumbersOfTries = resultat.map(game => game.numberOfTries);
    return listOfnumbersOfTries.reduce(function(acc, val){
      return Math.min(acc, val);
    });
  }

  /**
   * méthode qui renvoie la liste des 10 derniers mots trouvés
   * @param resultat : tableau de games gagnés par le player
   */
  listFoundWords(resultat){
    return resultat.map(word => word.chosenWinner).reverse().slice(0, 10);
  }


  onDismiss(query: any = null) {
    this.modalCtrl.dismiss(query);
  }
}
