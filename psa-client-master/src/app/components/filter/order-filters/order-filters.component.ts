import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Supplier } from 'src/app/models/supplier';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-order-filters',
  templateUrl: './order-filters.component.html',
  styleUrls: ['./order-filters.component.scss'],
})
export class OrderFiltersComponent implements OnInit {

  private test = "2020-01-24";

  private suppliers: Supplier[] = new Array<Supplier>();
  private startdate = null;
  private enddate = null;
  startDateFilter = new FormControl('');
  endDateFilter = new FormControl('');
  constructor(
    private modalController: ModalController,
    private navParams: NavParams
  ) {

  }

  ngOnInit() {
    this.games = this.navParams.data.suppliers;
    this.startdate = this.navParams.data.start;
    this.enddate = this.navParams.data.end;
    this.startDateFilter = new FormControl(this.startdate)
    this.endDateFilter = new FormControl(this.enddate);
    this.selected_games = this.navParams.data.selected;
  }

  async closeModal() {
    let dataOBJ = {
      "start": this.startDateFilter.value,
      "end": this.endDateFilter.value,
      "selected": this.selected_games
    }
    await this.modalController.dismiss(dataOBJ);
  }

  name: string;
  searchText: string = "";
  selected_count: number = 0;
  selected_games: { name: string; id: number; selected: boolean; type: string }[];


  resetFilter() {
    this.clearSelection();
    this.startDateFilter.reset();
    this.endDateFilter.reset();
  }

  // Data Object to List Games
  games = []

  // Getting Selected Games and Count
  getSelected() {
    this.selected_games = this.games.filter(s => {
      return s.selected;
    });
    this.selected_count = this.selected_games.length;
  }

  // Clearing All Selections
  clearSelection() {
    this.searchText = "";
    this.games = this.games.filter(g => {
      g.selected = false;
      return true;
    });
    this.getSelected();

  }

  //Delete Single Listed Game Tag
  deleteGame(id: number) {
    this.searchText = "";
    this.games = this.games.filter(g => {
      if (g.id == id)
        g.selected = false;

      return true;
    });
    this.getSelected();
  }

  //Clear term types by user
  clearFilter() {
    this.searchText = "";
  }
}
