import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { common } from '../../common';
import { environment } from '../../../environments/environment';
import moment from 'moment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { SavedocumentsComponent } from '../savedocuments/savedocuments.component';
import { CommentsComponent } from '../comments/comments.component';
import { DetailsComponent } from '../details/details.component';
import { EdittaskComponent } from '../edittask/edittask.component';


@Component({
  selector: 'app-alltasks',
  templateUrl: './alltasks.component.html',
  styleUrl: './alltasks.component.scss'
})
export class AlltasksComponent implements OnInit{
spinner : boolean = false;
statusData : any =[
  {'name' : 'Open' , count : 179},
  {'name' : 'Closed' , count : 179},
  {'name' : 'Resolved' , count : 179},
  {'name' : 'Un Assigned' , count : 179},
  {'name' : 'In Development' , count : 179},
  {'name' : 'Testing' , count : 179},
  {'name' : 'Ready For Release' , count : 179},
  {'name' : 'Un Resolved' , count : 179},
]

allTasksData : any =[];
xpertProfileImg: any = environment.xpertProfileImg;
priorties: any = [
  { id: 3, priorty: 'Low', color: 'green' },
  { id: 2, priorty: 'Medium', color: 'blue' },
  { id: 1, priorty: 'High', color: 'red' },
]
userID: any;
roleId: any;
  constructor(private api: ApiService,private fb: FormBuilder, private common: common,
    private router: Router, private toastr: ToastrService,private modalService : NgbModal){
      this.userID = this.common.userid;
      this.roleId = this.common.roleid;
  }

  ngOnInit(): void {
    this.getAllTickets()
  }

  getAllTickets(){
    this.spinner = true;

    const obj={
      "assignid": 0,
      "duedate": "",
      "exp": "",
      "exp2": "",
      "maxId": 0,
      "priority": 0,
      "stat": "",
      "tagid": 0,
      "taskId": 0,
      "userId": this.common.userid,
      "sortby": "",
      "orderby":"A",
      "createdby":""
      }
    this.api.postMethod1('xpert/GetAllTasks',obj).subscribe((res: any)=>{
      console.log(res);
      if(res.status == 200){
        this.allTasksData = res.response;
        this.spinner = false;
      }
      else{
        this.allTasksData =[];
        this.spinner = false;

      }
    })
  }

  onSelectChange(event: any, Ticket: any): void {
    const obj = {
      "ticketId": Ticket,
      "priorityid": event.target.value
    }
    this.api.changePriority('xpert/UpdateTicketPriority', obj).subscribe((res: any) => {
      if (res.status == 200) {
        this.toastr.success("Priority updated successfully");
        //  this.socketService.sendTask();
      }

    })
  }

  openComponent(task: any,component : any) {
  
      this.api.setTicketData(task)
      if(component == 'doc'){
        this.modalService.open(SavedocumentsComponent, {
          windowClass: 'documentModal',
          size: 'lg', 
          backdrop: 'static',
          centered: true, 
        });
      }
      else if(component == 'comments'){
        this.modalService.open(CommentsComponent, {
          windowClass: 'commentsModal',
          size: 'lg', 
          backdrop: 'static',
          centered : true, 
        });
      }
      else if(component == 'view'){
        this.modalService.open(DetailsComponent, {
          windowClass: 'viewModal',
          size: 'xl', 
          backdrop: 'static',
          centered: true, 
        });
      }
      else if(component == 'edit'){
        this.modalService.open(EdittaskComponent, {
          windowClass: 'editModal',
          size: 'xl', 
          backdrop: 'static',
          centered: true, 
        });
      }
  
  
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
    
}
