import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';
import { EmployeeService } from '../../services/employee.service';
@Component({
  selector: 'app-show-employee-page',
  templateUrl: './show-employee.page.html',
  styleUrls: ['./show-employee.page.scss'],
})
export class ShowEmployeePage implements OnInit {


  constructor(private events: Events, private employeeService: EmployeeService) {
    this.events.publish('updateMenuSelected');
  }

  ngOnInit() {
  }

  public updateEmployee() {
    this.employeeService.updateEmployeeMobile();
  }

  public deleteEmployee() {
    this.employeeService.removeEmployeeMobile();
  }
  public addpsa() {
    this.employeeService.addPsaMobile();
  }

}
