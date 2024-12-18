import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api.service';
import { ToastrService } from 'ngx-toastr';
import { common } from '../../common';
import * as bootstrap from 'bootstrap';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  
  priorties: any = [
    { id: 3, priorty: 'Low', color: 'green' },
    { id: 2, priorty: 'Medium', color: 'blue' },
    { id: 1, priorty: 'High', color: 'red' },
  ]
  userID: any;
  roleId: any;
  taskDetailsList : any=[]

  constructor(private api: ApiService, private toastr : ToastrService, private common : common){
    this.userID = this.common.userid;
    this.roleId = this.common.roleid;
  }

  ngOnInit(): void {
    this.BindDashboard(0, 0, '', '9', 'T_id desc','','', '', '', '',0);
  }
  BindDashboard(
    id: any, count: any, srchstr: any, taskstatusid: any, orderby: any,
    srchflag: any, DlrTagids: any, DptTagids: any, sdate: any, edate: any, tktType: any
  ) {  
    const obj = {
      id: 0,
      UserId: this.userID,
      MaxId: count,
      SearchString: srchstr,
      TaskStatus: taskstatusid,
      orderby: orderby,
      srchflag: srchflag,
      DlrTagids: DlrTagids,
      DptTagids: DptTagids,
      dt1: sdate,
      dt2: edate,
      tkttype: tktType
    };
  
    this.api.postmethod('TaskManagement/GetTaskFeed', obj).subscribe(res => {
      console.log(res);
    if (res.StatusCode === 200 && res.UserTasksInfo.length > 0) {
      this.taskDetailsList = res.UserTasksInfo;
    }
    });
  }

  onSelectChange(event: any, Ticket: any): void {
    const obj = {
      "ticketId":Ticket,
      "priorityid":event.target.value
    }
    this.api.changePriority('xpert/UpdateTicketPriority',obj).subscribe((res: any)=>{
      if(res.status == 200){
        this.toastr.success("Priority updated successfully");
      //  this.socketService.sendTask();
      }
      
    })
  }
}
