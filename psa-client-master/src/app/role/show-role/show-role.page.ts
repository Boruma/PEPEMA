import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../services/role.service';
import {Events} from '@ionic/angular';

@Component({
  selector: 'app-show-role-page',
  templateUrl: './show-role.page.html',
  styleUrls: ['./show-role.page.scss'],
})
export class ShowRolePage implements OnInit {

  constructor(private roleService: RoleService, private events: Events) {
    this.events.publish('updateMenuSelected');
   }

  ngOnInit() {
  }

  public updateRole() {
    this.roleService.updateRoleMobile();
  }

  public deleteRole() {
    this.roleService.removeRoleMobile();
  }

}
