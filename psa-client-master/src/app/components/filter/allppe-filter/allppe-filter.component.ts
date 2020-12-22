import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
@Component({
  selector: 'app-allppe-filter',
  templateUrl: './allppe-filter.component.html',
  styleUrls: ['./allppe-filter.component.scss'],
})
export class AllPpeFilterComponent implements OnInit {
  name: string;
  searchText: string = "";
  selected_count: number = 0;
  selected_games: { name: string; id: number; selected: boolean; type: string }[];
  selected_properties: { name: string; id: number; selected: boolean; type: string }[];

  // Data Object to List Games
  games = []
  PropertyFilter = []
  constructor(
    private modalController: ModalController,
    private navParams: NavParams) {

  }

  ngOnInit() {
    this.games = this.navParams.data.templates;
    this.PropertyFilter = this.navParams.data.properties;
    this.selected_games = this.navParams.data.selected;
    this.selected_properties = this.navParams.data.selectedProperties;
  }

  async closeModal() {
    let dataOBJ = {
      "selected": this.selected_games,
      "selectedProperties": this.selected_properties
    }
    await this.modalController.dismiss(dataOBJ);
  }

  resetFilter() {
    this.clearSelection();

  }

  // Getting Selected Games and Count
  getSelected() {
    this.selected_games = this.games.filter(s => {
      return s.selected;
    });
  }

  // Getting Selected Games and Count
  getSelectedProperties() {
    this.selected_properties = this.PropertyFilter.filter(s => {
      return s.selected;
    });
  }


  // Clearing All Selections
  clearSelection() {
    this.searchText = "";
    this.games = this.games.filter(g => {
      g.selected = false;
      return true;
    });

    this.PropertyFilter = this.PropertyFilter.filter(g => {
      g.selected = false;
      return true;
    });
    this.getSelected();
  }
}
