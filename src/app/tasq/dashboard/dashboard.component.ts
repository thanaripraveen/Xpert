import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api.service';
import { ToastrService } from 'ngx-toastr';
import { common } from '../../common';
import * as bootstrap from 'bootstrap';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { environment } from '../../../environments/environment'
import { LoginComponent } from '../../login/login.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SavedocumentsComponent } from '../savedocuments/savedocuments.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  spinner : boolean = true;
  xpertProfileImg : any = environment.xpertProfileImg;
  priorties: any = [
    { id: 3, priorty: 'Low', color: 'green' },
    { id: 2, priorty: 'Medium', color: 'blue' },
    { id: 1, priorty: 'High', color: 'red' },
  ]
  userID: any;
  roleId: any;
  taskDetailsList : any=[]

  constructor(private api: ApiService, private toastr : ToastrService, private common : common,private modalService: NgbModal,){
    this.userID = this.common.userid;
    this.roleId = this.common.roleid;
  }

  ngOnInit(): void {
    this.BindDashboard();
  }
  BindDashboard() {  
    this.spinner =true;
    const obj = {
      "id":0,
      "UserId":this.userID,
      "MaxId":0,
      "SearchString":"",
      "TaskStatus":9,
      "orderby":"T_iD desc",
      "srchflag":"",
      "DlrTagids":"",
      "DptTagids":"",
      "dt1":"",
      "dt2":"",
      "tkttype":0
  }
  
    this.api.postmethod1('xpert/GetTaskFeed', obj).subscribe(res => {
      console.log(res);
    if (res.status === 200) {
      this.taskDetailsList = res.response;
      this.spinner = false;
    }
    else{
      this.taskDetailsList = [];
      this.spinner=false;
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

    LocalTimeConvertioninHours(DateTime: any) {
    var utcDate = moment.utc(DateTime);
    var dateWithTimezone = utcDate.local().format('MM.DD.YY hh:mm A');
    return dateWithTimezone;

  }
  LocalTimeConvertioninHours1(DateTime: any) {
    var utcDate = moment.utc(DateTime);
    var dateWithTimezone = utcDate.local().format('MM/DD/YY');
    return dateWithTimezone;

  }

  openDocumentsComponent(){
    this.modalService.open(SavedocumentsComponent, {
          size: 'lg', // Large modal
          backdrop: 'static', // Prevent closing on outside click
          centered: true, // Centered modal
        });
  }


}
