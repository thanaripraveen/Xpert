import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-createtask',
  templateUrl: './createtask.component.html',
  styleUrl: './createtask.component.scss'
})
export class CreatetaskComponent {
  constructor(private modalService: NgbModal) {}

}
